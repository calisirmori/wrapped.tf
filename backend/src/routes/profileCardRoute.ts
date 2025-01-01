import { Router, Request, Response } from "express";
import puppeteer from "puppeteer";

const profileCardRouter = Router();

import { query } from "../db"; // Assuming you have a database module

profileCardRouter.get(
    "/card/:id64",
    async (req: Request<{ id64: string }>, res: Response): Promise<void> => {
      const { id64 } = req.params;

      // Fetch data from the database
      const dbResult = await query(
        "SELECT * FROM wrapped.summary INNER JOIN public.steam_info s ON s.id64 = summary.id64 WHERE summary.id64 = $1",
        [id64]
      );

      const queryData = dbResult.rows[0];
      console.log(queryData);
      try {
        // Sample Data (Replace with your actual data)
        const userData = {
          name: queryData.name,
          avatar: queryData.avatar,
          minutesPlayed: (queryData.minutes_played).toLocaleString(),
          hoursPlayed: (Number(queryData.hours_played)).toLocaleString(),
          moviesMissed: (queryData.minutes_played / 90).toFixed(0),
          topMap: (queryData.map_name).toUpperCase(),
          topClass: (queryData.class_name).toUpperCase(),
          topMapKDA: (queryData.map_hours_played).toLocaleString(),
          topMapWL: queryData.map_win_ratio,
          topMapMatches: queryData.map_matches_played,
          topClassKDA: queryData.kda,
          topClassWL: queryData.class_win_ratio,
          topClassMatches: queryData.class_matches_played,
          totalKDA: 1.01,
          totalWL: queryData.winrate,
          totalGames: queryData.matches_played,
        };
  
        const browser = await puppeteer.launch({
          headless: false,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        
        // Dynamic HTML Content
        const htmlContent = `
          <html>
              <head>
                <style>
                  @import url('https://fonts.googleapis.com/css2?family=Londrina+Solid:wght@100;200;300;400;500;600;700;800;900&display=swap');
                  @import url('https://fonts.googleapis.com/css?family=Istok+Web:wght@100;200;300;400;500;600;700;800;900&display=swap');

                  body {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #f0f0f0;
                  }
                  .box {
                    width: 800px;
                    height: 800px;
                    background-color: rgb(31, 31, 31);
                    background-image: url('/static/images/topo-background.svg');
                    background-size: cover;
                    background-position: center;
                    position: relative;
                  }
                  .box::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: black;
                    opacity: 0.5;
                    pointer-events: none;
                  }
                  .content {
                    position: absolute;
                    top: 48%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 800px;
                    height: 500px;
                    opacity: 50%;
                    background: linear-gradient(45deg, #F08149 0%, transparent 35%, transparent 65%, #F08149 100%);
                    z-index: 1;
                  }
                  .line {
                    position: absolute;
                    width: 525px;
                    height: 2px;
                    background-color: #F08149;
                    z-index: 1;
                  }
                  .line.top {
                    top: calc(48% - 252px);
                    width: 525px;
                    right: 0;
                  }
                  .line.bottom {
                    top: calc(48% + 250px);
                    width: 555px;
                    left: 0;
                  }
                  .text {
                    position: absolute;
                    font-family: 'Londrina Solid', cursive;
                    font-size: 48px;
                    color: white;
                    z-index: 2;
                  }
                  .text.center {
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                  }
                  .text.top-left {
                    top: 10%;
                    left: 10%;
                  }
                  .text.bottom-right {
                    bottom: 10%;
                    right: 10%;
                  }
                  .moretf-logo{
                    width: 34px;
                    height: 34px;
                    background-image: url('/static/images/new-logo.png');
                    background-size: cover;
                    background-position: center;
                    position: absolute;
                    z-index: 3;
                    top: 4%;
                    left: 4%;
                  }
                  .text.tf2wrapped {
                    font-family: 'Istok Web', cursive;
                    font-weight: 700;
                    opacity: 90%;
                    top: calc(4% - 2px);
                    left: calc(4% + 40px);
                    font-size: 32px;
                  }
                  .text.tf2wrapped-small-text {
                    font-family: 'Istok Web', cursive;
                    font-weight: 600;
                    top: calc(8% + 4px);
                    opacity: 30%;
                    left: calc(4%);
                    font-size: 16px;
                  }
                  .card {
                    display: flex;
                    align-items: center;
                    background-color: #f08149;
                    height: 36px;
                    padding: 0px 10px;
                    border-radius: 6px;
                    font-family: 'Istok Web', cursive;
                    font-weight: 600;
                    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                    font-size: 16px;
                    color: white;
                    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                    position: absolute;
                    z-index: 3;
                    top: calc(5%);
                    right: calc(4%);
                    gap: 10px;
                  }
                  .card-icon {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                  }
                  .card-text {
                    margin: 0;
                  }

                  .line.bottom-left {
                    position: absolute;
                    width: 2px;
                    height: 34px;
                    bottom: 3%;
                    left: 4%;
                  }

                  .text.bottom-left{
                    font-size: 28px;
                    font-weight: 300;
                    bottom: calc(3%);
                    left: calc(4% + 10px);
                  }

                  .text.bottom-left span {        
                    color: #f08149;
                    font-weight: 400;
                  }

                  .text.minutes-played-header{
                    top: calc(13% + 10px);
                    left: 4%;
                    font-size: 36px;
                    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                  }

                  .text.that-is{
                    top: calc(13% + 12px);
                    right: 4%;
                    font-size: 36px;
                    text-shadow: 0px 0px 7px rgba(0, 0, 0, 1);
                  }

                  .text.key-insights{
                    bottom: calc(17% + 8px);
                    right: 4%;
                    font-size: 36px;
                    text-shadow: 0px 0px 7px rgba(0, 0, 0, 1);
                  }

                  .text.minutes-played{
                    color: #f08149;
                    font-weight: 700;
                    top: calc(18% + 10px);
                    left: 4%;
                    font-size: 80px;
                    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                  }

                  .text.movies-missed{
                    top: calc(21%);
                    right: 4%;
                    font-size: 30px;
                    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                  }

                  .card.movies-missed{
                    top: calc(21% + 6px);
                    height: 26px;
                    right: calc(4% + 176px);
                  }

                  .text.hours-played{
                    top: calc(25%);
                    right: 4%;
                    font-size: 30px;
                    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                  }

                  .card.hours-played{
                    top: calc(25% + 6px);
                    height: 26px;
                    right: calc(4% + 136px);
                  }

                  .text.top-map-header{
                    font-size: 40px;
                    top: calc(37% + 3px);
                    right: 4%;
                    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                  }

                  .text.top-map{
                    color: #f08149;
                    font-weight: 700;
                    top: calc(42%);
                    right: 4%;
                    font-size: 70px;
                    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                  }

                  .text.top-class-header{
                    font-size: 40px;
                    bottom: calc(34%);
                    left: 4%;
                    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                  }

                  .text.top-class{
                    color: #f08149;
                    font-weight: 700;
                    bottom: calc(25%);
                    left: 4%;
                    font-size: 70px;
                    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                  }

                  .rectangle {
                    position: relative;
                    position: absolute;
                    left: 4%;
                    top: calc(35% + 4px);
                    z-index: 5;
                    width: 270px;
                    height: 150px;
                    background-color: black;
                    border: 2px solid transparent;
                    outline: 2px solid #f08149;
                    border-radius: 6px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                  }

                  .rectangle img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 80%;
                  }

                  .rectangle .overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    font-family: 'Londrina Solid', cursive;
                    font-size: 24px;
                    z-index: 2;
                  }

                  .rectangle-class {
                    position: relative;
                    position: absolute;
                    right: 4%;
                    bottom: calc(25% + 4px);
                    z-index: 5;
                    width: 270px;
                    height: 115px;
                    border: 2px solid transparent;
                    outline: 2px solid #f08149;
                    border-radius: 6px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                  }

                  .rectangle-class img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 80%;
                  }

                  .rectangle-class .overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    font-family: 'Londrina Solid', cursive;
                    font-size: 24px;
                    z-index: 2;
                  }

                  .line.map-1{
                    left: calc(39% - 5px);
                    top: calc(40%);
                    width: 32px;
                  }
                  .line.map-2{
                    left: calc(39% - 5px);
                    top: calc(45% );
                    width: 32px;
                  }
                  .line.map-3{
                    left: calc(39% - 5px);
                    top: calc(50%);
                    width: 32px;
                  }

                  .stat {
                    display: flex;
                    justify-content: left;
                    align-items: center;
                    gap: 6px;
                    z-index: 5;
                    color: white;
                    position: absolute;
                  }

                  .stat .value{
                    font-family: 'Istok Web', cursive;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-weight: 600;
                    height: 26px;
                    background: #F08149;
                    z-index: 5;
                    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                    border-radius: 2px;
                    padding: 0 6px;
                  }

                  .stat .textbox{
                    font-family: 'Londrina Solid', cursive;
                    z-index: 5;
                    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                    font-size: 22px;
                  }

                  .stat.map-1{
                    left: calc(44% - 5px);
                    top: calc(38% + 5px);
                  }

                  .stat.map-2{
                    left: calc(44% - 5px);
                    top: calc(43% + 5px);
                  }

                  .stat.map-3{
                    left: calc(44% - 5px);
                    top: calc(48% + 5px);
                  }

                  .line.class-1{
                    right: calc(39% - 5px);
                    bottom: calc(38%);
                    width: 32px;
                  }
                  .line.class-2{
                    right: calc(39% - 5px);
                    bottom: calc(33%);
                    width: 32px;
                  }
                  .line.class-3{
                    right: calc(39% - 5px);
                    bottom: calc(28%);
                    width: 32px;
                  }

                  .stat.class-1{
                    right: calc(44% - 5px);
                    bottom: calc(36% + 2px);
                  }

                  .stat.class-2{
                    right: calc(44% - 5px);
                    bottom: calc(31% + 2px);
                  }

                  .stat.class-3{
                    right: calc(44% - 5px);
                    bottom: calc(26% + 2px);
                  }
                  .text.kda{
                    font-weight: 700;
                    bottom: calc(10%);
                    left: 4%;
                    font-size: 40px;
                    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                  }
                  .text.kda-value{
                    color: #f08149;
                    font-weight: 700;
                    bottom: calc(8%);
                    left: 12%;
                    font-size: 70px;
                    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                  }
                  .text.win-percent{
                    font-weight: 700;
                    bottom: calc(10%);
                    left: 32%;
                    font-size: 40px;
                    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                  }
                  .text.win-percent-value{
                    color: #f08149;
                    font-weight: 700;
                    bottom: calc(8%);
                    left: 44%;
                    font-size: 70px;
                    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                  }
                  .text.games{
                    font-weight: 700;
                    bottom: calc(10%);
                    right: 20%;
                    font-size: 40px;
                    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                  }
                  .text.games-value{
                    color: #f08149;
                    font-weight: 700;
                    bottom: calc(8%);
                    right: 4%;
                    font-size: 70px;
                    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
                  }
                </style>
              </head>
              <body>
                <div class="box">
                    <!-- middle section background -->
                    <div class="line top"></div>
                    <div class="content"></div>
                    <div class="line bottom"></div>

                    <!-- top left signature -->
                    <div class="moretf-logo"></div>
                    <div class="text tf2wrapped">#TF2Wrapped</div>
                    <div class="text tf2wrapped-small-text">My 2024 more.tf wrapped</div>

                    <!-- bottom left signature -->
                    <div class="line bottom-left"></div>
                    <div class="text bottom-left">Get yours at <span>wrapped.tf</span></div>

                    <!-- top right profile card -->
                    <div class="card">
                        <img src="https://avatars.fastly.steamstatic.com/${userData.avatar}_full.jpg" alt="icon" class="card-icon" />
                        <span class="card-text">${userData.name}</span>
                    </div>

                    <!-- section headers -->
                    <div class="text minutes-played-header">MINUTES PLAYED</div>
                    <div class="text that-is">THAT'S:</div>
                    <div class="text key-insights">KEY INSIGHTS</div>

                    <!-- data sections -->
                    <div class="text minutes-played">${userData.minutesPlayed}</div>

                    <div class="text movies-missed">movies missed</div>
                    <div class="card movies-missed">${userData.moviesMissed}</div>

                    <div class="text hours-played">total hours</div>
                    <div class="card hours-played">${userData.hoursPlayed}</div>

                    <div class="text top-map-header">TOP MAP</div>
                    <div class="text top-map">${userData.topMap}</div>

                    <div class="text top-class-header">TOP CLASS</div>
                    <div class="text top-class">${userData.topClass}</div>

                    <!-- rectangles -->
                    <div class="rectangle">
                        <img src="/static/images/${userData.topMap}.png" alt=${userData.topMap}>
                    </div>
                    <div class="line map-1"></div>
                    <div class="line map-2"></div>
                    <div class="line map-3"></div>

                    <div class="stat map-1">
                        <div class="value">${userData.topMapKDA}</div>
                        <div class="textbox">KDA Ratio</div>
                    </div>

                    <div class="stat map-2">
                        <div class="value">${userData.topMapWL}</div>
                        <div class="textbox">W/L Ratio</div>
                    </div>

                    <div class="stat map-3">
                        <div class="value">${userData.topMapMatches}</div>
                        <div class="textbox">Matches</div>
                    </div>

                    <div class="line class-1"></div>
                    <div class="line class-2"></div>
                    <div class="line class-3"></div>

                    <div class="stat class-1">
                        <div class="textbox">KDA Ratio</div>
                        <div class="value">${userData.topClassKDA}</div>
                    </div>

                    <div class="stat class-2">
                        <div class="textbox">W/L Ratio</div>
                        <div class="value">${userData.topClassWL}</div>
                    </div>

                    <div class="stat class-3">
                        <div class="textbox">Matches</div>
                        <div class="value">${userData.topClassMatches}</div>
                    </div>

                    <div class="rectangle-class">
                        <img src="/static/classes/${userData.topClass}.png" alt=${userData.topClass}>
                    </div>

                    <div class="text kda">KDA</div>
                    <div class="text kda-value">${userData.totalKDA}</div>
                    <div class="text win-percent">WIN %</div>
                    <div class="text win-percent-value">${userData.totalWL}%</div>
                    <div class="text games">GAMES</div>
                    <div class="text games-value">${userData.totalGames}</div>

                </div>
              </body>
            </html>
        `;
        
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });
        await page.setViewport({ width: 800, height: 800 });
  
        // Generate the screenshot
        const screenshot = await page.screenshot({ type: "png" });
  
        await browser.close();
  
        // Serve the PNG
        res.setHeader("Content-Type", "image/png");
        res.end(screenshot);
      } catch (error) {
        console.error("Error generating profile card:", error);
        res.status(500).send("Failed to generate profile card");
      }
    }
  );

export default profileCardRouter;
