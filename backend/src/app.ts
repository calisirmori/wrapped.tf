import * as express from "express";
import * as cors from "cors";
import * as session from "express-session";
import * as passport from "passport";
import { Strategy as SteamStrategy } from "passport-steam";
import { query } from "./db";
import * as dotenv from "dotenv";
import profileCardRouter from "./routes/profileCardRoute";
import * as path from "path";

// Set the allowed origin based on the environment
const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? "https://wrapped.tf" // Production frontend URL
    : "http://localhost:5173"; // Development frontend URL

// Load environment variables
dotenv.config();

declare global {
  namespace Express {
    interface User {
      id: string;
      steamId: string;
      displayName: string;
      avatar: string;
    }

    interface Request {
      user?: User; // Add the `user` property injected by Passport
    }
  }
}

declare global {
  namespace Express {
    interface User {
      id: string;
      steamId: string;
      displayName: string;
      avatar: string;
    }
  }
}

// Define a User interface
interface User {
  id: string;
  steamId: string;
  displayName: string;
  avatar: string;
}

// Initialize Express app
const app = express();
app.use(
    cors({
      origin: allowedOrigin,
      credentials: true, // Allow cookies to be sent
    })
  );
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "public")));

// Session configuration
app.use(
    session({
      secret: process.env.SESSION_SECRET || "your_secret_key", // Use a strong secret
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true, // Prevent client-side JavaScript access
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production (requires HTTPS)
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Prevent cross-site request forgery
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    })
  );

// Passport.js initialization
app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user
passport.serializeUser((user: Express.User, done) => {
  // Store the entire user object in the session
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  // Directly retrieve the user object from the session
  done(null, user);
});

// Configure Steam strategy
passport.use(
    new SteamStrategy(
      {
        returnURL: process.env.STEAM_RETURN_URL || "http://localhost:5000/api/auth/steam/return",
        realm: process.env.STEAM_REALM || "http://localhost:5000",
        apiKey: process.env.STEAMKEY || "your_steam_api_key",
      },
      (identifier: string, profile: any, done) => {
        const user: Express.User = {
          id: profile.id,
          steamId: identifier,
          displayName: profile.displayName,
          avatar: profile.photos[2]?.value || "", // Default to empty string if avatar is missing
        };
        done(null, user);
      }
    )
  );

// Steam authentication routes
app.get("/api/auth/steam", passport.authenticate("steam"));

app.get(
  "/api/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: "/" }),
  (req: any, res: any) => {
    res.redirect("/"); // Redirect to the homepage after login
  }
);

// Logout route
app.get("/api/auth/logout", (req: any, res: any) => {
  req.logout((err: any) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/");
  });
});

app.get("/api/auth/user", (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

app.get("/api/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/");
  });
});

//currently not parsing
//app.use('/api', mainParser);
//app.use('/api/process', logProcessingRoute);

// Register the profile card route
app.use("/api", profileCardRouter);

// Route to get profile data
app.get("/api/profile/:id64", async (req, res) => {
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
