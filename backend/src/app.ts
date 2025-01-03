import * as express from "express";
import * as cors from "cors";
import * as session from "express-session";
import * as passport from "passport";
import { Strategy as SteamStrategy } from "passport-steam";
import { query } from "./db";
import * as dotenv from "dotenv";
import profileCardRouter from "./routes/profileCardRoute";
import * as path from "path";

// Load environment variables
dotenv.config();

// Decide where to redirect after login/logout
const FRONTEND_DEV_URL = "http://localhost:5173";
const FRONTEND_PROD_URL = "https://wrapped.tf";

// If in production, use the “wrapped.tf” for realm and returns; otherwise local dev.
const IS_PROD = process.env.NODE_ENV === "production";

const STEAM_REALM = IS_PROD
  ? "https://api.wrapped.tf"
  : "http://localhost:5000";

const STEAM_RETURN_URL = IS_PROD
  ? "https://api.wrapped.tf/auth/steam/return"
  : "http://localhost:5000/auth/steam/return";

const FRONTEND_URL = IS_PROD ? FRONTEND_PROD_URL : FRONTEND_DEV_URL;

// Set allowed origin for CORS
const allowedOrigin = IS_PROD ? FRONTEND_PROD_URL : FRONTEND_DEV_URL;

// Initialize Express
const app = express();

// CORS
app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);

// Static files & JSON parsing
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true for HTTPS
      sameSite: "none", // Required for cross-domain cookies
      domain: ".wrapped.tf", // Enables cookies across subdomains
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Serialize/deserialize
passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

// Steam Strategy
passport.use(
  new SteamStrategy(
    {
      returnURL: STEAM_RETURN_URL,
      realm: STEAM_REALM,
      apiKey: process.env.STEAMKEY || "your_steam_api_key",
    },
    (identifier: string, profile: any, done) => {
      const user: Express.User = {
        id: profile.id,
        steamId: identifier,
        displayName: profile.displayName,
        avatar: profile.photos?.[2]?.value || "",
      };
      done(null, user);
    }
  )
);

// ===================== AUTH ROUTES ========================

// Start Steam login
app.get("/auth/steam", passport.authenticate("steam"));

// Steam login callback
app.get(
    "/auth/steam/return",
    passport.authenticate("steam", { failureRedirect: FRONTEND_URL }),
    (req: any , res: any) => {

      if (req.user) {
        // Set a non-sensitive cookie
        res.cookie('userid', req.user, { 
          maxAge: 31556952000, // 1 year
          httpOnly: false, 
          secure: IS_PROD,
          sameSite: "none",
          domain: ".wrapped.tf",
        });
      }

      // Redirect to the recap
      res.redirect(FRONTEND_URL + '/recap/' + req.user.id );
    }
  );

// Logout
app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    // Clear the `userid` cookie
    res.clearCookie("userid", {
        domain: ".wrapped.tf",
        path: "/",
        secure: IS_PROD,
        sameSite: "none",
    });

    console.log("clear")
    // redirect to the frontend
    res.redirect(FRONTEND_URL);
  });
});

// Return user info if logged in
app.get("/auth/user", (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// ==================== PROFILE ROUTES ==================
app.use("/profile", profileCardRouter);

// Route to get profile data
app.get("/profile/:id64", async (req, res) => {
  const id64 = req.params.id64;

  try {
    // Execute all queries in parallel
    const [
      general,
      activity,
      teammates,
      enemies,
      losingEnemies,
      losingTeammates,
      topFiveClasses,
      topFiveMaps,
      winningEnemies,
      winningTeammates,
      dailyActivity,
      percentiles,
    ] = await Promise.all([
      query("SELECT * FROM wrapped.general WHERE id64 = $1", [id64]),
      query("SELECT * FROM wrapped.monthly_activity WHERE id64 = $1", [id64]),
      query(
        "SELECT * FROM wrapped.teammates WHERE id64 = $1 ORDER BY matches_played DESC LIMIT 5",
        [id64]
      ),
      query(
        "SELECT * FROM wrapped.enemy WHERE id64 = $1 ORDER BY matches_played DESC LIMIT 5",
        [id64]
      ),
      query(
        `
                SELECT *,
                       matches_won::FLOAT / NULLIF(matches_lost, 0) AS win_loss_ratio
                FROM wrapped.losingenemies
                WHERE id64 = $1
                ORDER BY win_loss_ratio
                LIMIT 5
            `,
        [id64]
      ),
      query(
        `
                SELECT *,
                       matches_won::FLOAT / NULLIF(matches_lost, 0) AS win_loss_ratio
                FROM wrapped.losingteammates
                WHERE id64 = $1
                ORDER BY win_loss_ratio
                LIMIT 5
            `,
        [id64]
      ),
      query(
        "SELECT * FROM wrapped.topfiveclasses WHERE id64 = $1 ORDER BY time_played DESC LIMIT 5",
        [id64]
      ),
      query(
        "SELECT * FROM wrapped.topfivemaps WHERE id64 = $1 ORDER BY time_played DESC LIMIT 5",
        [id64]
      ),
      query(
        `
                SELECT *,
                       matches_won::FLOAT / NULLIF(matches_lost, 0) AS win_loss_ratio
                FROM wrapped.winningenemies
                WHERE id64 = $1
                ORDER BY win_loss_ratio DESC
                LIMIT 5
            `,
        [id64]
      ),
      query(
        `
                SELECT *,
                       matches_won::FLOAT / NULLIF(matches_lost, 0) AS win_loss_ratio
                FROM wrapped.winningteammates
                WHERE id64 = $1
                ORDER BY win_loss_ratio DESC
                LIMIT 5
            `,
        [id64]
      ),
      query("SELECT * FROM wrapped.daily_activity WHERE id64 = $1", [id64]),
      query("SELECT * FROM wrapped.general_percentiles WHERE id64= $1", [id64]),
    ]);

    // Collect all unique id64s
    const collectedId64s = new Set<string>();

    // Add the initial id64
    collectedId64s.add(id64);

    // Extract id64s from the queries
    teammates.rows.forEach((row: any) => collectedId64s.add(row.teammate_id64));
    enemies.rows.forEach((row: any) => collectedId64s.add(row.enemy_id64));
    losingEnemies.rows.forEach((row: any) =>
      collectedId64s.add(row.enemy_id64)
    );
    losingTeammates.rows.forEach((row: any) =>
      collectedId64s.add(row.teammate_id64)
    );
    winningEnemies.rows.forEach((row: any) =>
      collectedId64s.add(row.enemy_id64)
    );
    winningTeammates.rows.forEach((row: any) =>
      collectedId64s.add(row.teammate_id64)
    );

    // Convert Set to Array
    const id64Array = Array.from(collectedId64s);

    // Query steam_info for all collected id64s
    const steamInfoQuery = `
            SELECT *
            FROM steam_info
            WHERE id64 = ANY($1)
        `;
    const steamInfoRows = await query(steamInfoQuery, [id64Array]);

    // Transform steamInfo rows into an object of objects
    const steamInfo = steamInfoRows.rows.reduce(
      (acc: Record<string, any>, row: any) => {
        acc[row.id64] = {
          avatar: row.avatar,
          name: row.name,
          last_updated: row.last_updated,
          rgl_name: row.rgl_name,
        };
        return acc;
      },
      {}
    );

    // Find id64s that are not in the database
    const missingId64s = id64Array.filter((id) => !steamInfo[id]);

    // Query Steam API for missing id64s
if (missingId64s.length > 0) {
  const steamApiResponses = await Promise.all(
    missingId64s.map(async (missingId64) => {
      try {
        const response = await fetch(
          `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAMKEY}&steamids=${missingId64}`
        );
        const data = await response.json();
        const player = data.response.players[0];
        
        // Extract avatar hash from the avatar URL
        const avatarHash = player.avatar
          .replace('https://avatars.steamstatic.com/', '')
          .replace('.jpg', '');

        return {
          id64: missingId64,
          avatar: avatarHash, // Use the extracted hash
          name: player.personaname,
          last_updated: new Date().toISOString(),
          rgl_name: null, // Assuming RGL name isn't in Steam API
        };
      } catch (error) {
        console.error(`Error fetching Steam data for id64 ${missingId64}:`, error);
        return null;
      }
    })
  );

  // Add valid responses to steamInfo
  steamApiResponses.forEach((player) => {
    if (player) {
      steamInfo[player.id64] = player;
    }
  });
}

    // Combine results into a single response object
    const responseData = {
      general: general.rows,
      activity: activity.rows,
      teammates: teammates.rows,
      enemies: enemies.rows,
      losingEnemies: losingEnemies.rows,
      losingTeammates: losingTeammates.rows,
      topFiveClasses: topFiveClasses.rows,
      topFiveMaps: topFiveMaps.rows,
      winningEnemies: winningEnemies.rows,
      winningTeammates: winningTeammates.rows,
      dailyActivity: dailyActivity.rows,
      percentiles: percentiles.rows,
      steamInfo, // Attach steam_info data as an object of objects
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    res.status(500).json({ error: "Failed to fetch profile data" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
export default app;
