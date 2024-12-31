import * as express from 'express';
import axios from 'axios';  // For external API calls
import { parseLogFile } from '../parsers/mainParser'; // Internal log parsing function
import { getCombinedLogData } from '../utils/logAggregator'; // Utility to combine the data
import { insertProcessedLog, insertChatMessages, insertOrUpdateDailyClasses, insertOrUpdateDailyMain } from '../db'

const router: express.Router = express.Router();

// External API URL for logs.tf
const EXTERNAL_LOG_API = 'https://logs.tf/api/v1/log/';

// Define the shape of the players object
interface Player {
    team: string;
    class_stats: any[];  // Adjust the type as needed
}

// Function to convert SteamID3 to SteamID64
const steamID3ToID64 = (steamID3: string): string => {
    const match = steamID3.match(/\[U:\d+:(\d+)\]/);
    if (match) {
        const accountID = BigInt(match[1]);
        return (accountID + 76561197960265728n).toString();
    }
    throw new Error(`Invalid SteamID3 format: ${steamID3}`);
};

// API endpoint to process the log ID
router.get('/:logId', async (req, res) => {
    const logId = req.params.logId; // Extract log ID from URL
    const externalUrl = `http://logs.tf/api/v1/log/${logId}`; // External API URL
    const internalApiUrl = `/api/parse-log?logId=${logId}`; // Internal API URL (adjust as needed)

    try {
        // Fetch external data (JSON from logs.tf)
        const externalData = await axios.get(externalUrl);

        // Define a typed object to hold players with SteamID64 keys
        const playersWithID64: Record<string, Player> = {};  // Use Record<string, Player> type

        // Convert players from SteamID3 to SteamID64
        for (const steamID3 in externalData.data.players) {
            const steamID64 = steamID3ToID64(steamID3); // Convert SteamID3 to SteamID64
            playersWithID64[steamID64] = externalData.data.players[steamID3]; // Use SteamID64 as the key
        }

        // Replace players object with updated keys (SteamID64)
        externalData.data.players = playersWithID64;

        // Fetch internal data from internal API
        const internalData = await axios.get(internalApiUrl);

        // Combine internal and external data
        const combinedData = getCombinedLogData(internalData.data.data, externalData.data);

        // Processed logs book keeping
        await insertProcessedLog(logId, combinedData.internal.isCombined);

        // Chat Messages
        if (combinedData.internal.chatEvents && combinedData.internal.chatEvents.length > 0) {
            // Loop through each chat event in the internal data
            for (const chatEvent of combinedData.internal.chatEvents) {
                const { steamID64, time, message, isTeamChat } = chatEvent; // Destructure necessary values

                // Call insertChatMessages for each chat event
                await insertChatMessages(steamID64, time, message, isTeamChat, logId);
            }
        }

        //Classes specific stats
        if (combinedData.external.players && Object.keys(combinedData.external.players).length > 0) {
            // Extract the date from the external data's info
            const epochTimestamp = combinedData.external.info.date;
            const date = new Date(epochTimestamp * 1000); // Convert epoch to Date (multiplied by 1000 for ms)

            // Extract year and day of the year
            const yearId = date.getFullYear();
            const dayId = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);

            // Loop through each player in external data and insert/update daily classes
            for (const steamID64 in combinedData.external.players) {
                const player = combinedData.external.players[steamID64];
                const { class_stats, kills, assists, deaths, dmg, heal, headshots, backstabs, team } = player;

                // Assuming you're iterating over the class_stats
                for (const classStat of class_stats) {
                    const { type: class_name, total_time: playtime_in_seconds } = classStat;

                    // Assuming match_count is 1 for this example
                    const match_count = 1;
                    const redWon = combinedData.external.teams.Red.score > combinedData.external.teams.Blue.score;
                    const winner = (redWon && team === "Red") || (!redWon && team === "Blue");
                    const wins = winner ? 1 : 0;
                    const losses = !winner ? 1 : 0;

                    // Call the insertOrUpdateDailyClasses function for this class
                    await insertOrUpdateDailyClasses(
                        yearId,
                        dayId,
                        steamID64,
                        class_name,
                        playtime_in_seconds,
                        match_count,
                        wins,
                        losses,
                        kills,
                        assists,
                        deaths,
                        dmg,
                        heal,
                        headshots,
                        backstabs
                    );
                }
            }
        }

        // Main stats
        if (combinedData.external.players && Object.keys(combinedData.external.players).length > 0) {
            const playerCount = Object.keys(combinedData.external.players).length;

            // Extract the date from the external data's info
            const epochTimestamp = combinedData.external.info.date;
            const date = new Date(epochTimestamp * 1000); // Convert epoch to Date (multiplied by 1000 for ms)

            // Extract year and day of the year
            const yearId = date.getFullYear();
            const dayId = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);



            // Loop through each player in external data and insert/update daily stats
            for (const steamID64 in combinedData.external.players) {
                const player = combinedData.external.players[steamID64];
                const { team, class_stats } = player;

                // Initialize aggregated values for daily stats
                let totalPlaytimeInSeconds = 0;

                // Loop through class_stats to accumulate total playtime

                for (const classStat of class_stats) {
                    totalPlaytimeInSeconds += classStat.total_time; // Accumulate playtime from each class
                }

                let matchCount = 0;
                let wins = 0;
                let losses = 0;
                let ninePlayerMatches = 0;
                let sixPlayerMatches = 0;
                let fourPlayerMatches = 0;
                let twoPlayerMatches = 0;

                // Assuming match_count is 1 for this example
                matchCount = 1;

                // Determine if the team won and set wins/losses
                const redWon = combinedData.external.teams.Red.score > combinedData.external.teams.Blue.score;
                const winner = (redWon && team === "Red") || (!redWon && team === "Blue");
                if (winner) {
                    wins = 1;
                } else {
                    losses = 1;
                }

                if (playerCount >= 18) {
                    ninePlayerMatches = 1;
                } else if (playerCount >= 12) {
                    sixPlayerMatches = 1;
                } else if (playerCount >= 8) {
                    fourPlayerMatches = 1;
                } else if (playerCount >= 4) {
                    twoPlayerMatches = 1;
                }

                // Now, insert or update the daily stats using the method
                await insertOrUpdateDailyMain(
                    yearId,
                    dayId,
                    steamID64,
                    totalPlaytimeInSeconds,
                    matchCount,
                    wins,
                    losses,
                    ninePlayerMatches,
                    sixPlayerMatches,
                    fourPlayerMatches,
                    twoPlayerMatches
                );
            }
        }


        // Return the combined data as the response
        res.status(200).json({
            message: 'Log file processed successfully',
            data: combinedData,
        });
    } catch (error) {
        console.error('Error processing log data:', error);
        res.status(500).json({ error: 'Failed to process log data' });
    }
});

export default router;
