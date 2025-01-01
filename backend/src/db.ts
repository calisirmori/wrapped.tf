import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    ssl: {
        ca: process.env.NODE_ENV === "production" ? process.env.CA_CERT : fs.readFileSync("./ca-certificate.crt"),
        rejectUnauthorized: true, 
    },
});

export const query = (text: string, params?: any[]) => pool.query(text, params);


export const insertProcessedLog = async (logId: string, isCombined: boolean) => {
    try {
        const queryText = `
            INSERT INTO processed_logs (log_id, is_combined)
            VALUES ($1, $2)
        `;

        // Values to insert
        const values = [logId, isCombined];

        // Execute the query
        await query(queryText, values);
        //console.log(`Processed log with log_id ${logId} inserted.`);
    } catch (error) {
        console.error('Error inserting data into processed_logs table:', error);
    }
};

export const insertChatMessages = async (steamID64: string, time: string, message: string, isTeamChat: boolean, logId: string) => {
    await ensureUserExists(steamID64);

    // Convert time from milliseconds to seconds if necessary
    const epochInSeconds = Number(time) / 1000;

    const queryText = `
        INSERT INTO chats (user_id, date_time, log_id, message, is_team_chat)
        VALUES ($1, to_timestamp($2), $3, $4, $5)
    `;
    const values = [steamID64, epochInSeconds, logId, message, isTeamChat];

    try {
        await query(queryText, values); // Run the query to insert the chat message
        //console.log(`Inserted chat message for logId: ${logId}`);
    } catch (error) {
        //console.error('Error inserting chat message:', error);
        throw error;  // Rethrow error for the calling function to catch
    }
};

export const insertOrUpdateDailyClasses = async (
    yearId: number,
    dayId: number,
    steamID64: string,
    class_name: string,
    playtime_in_seconds: number,
    match_count: number,
    wins: number,
    losses: number,
    kills: number,
    assists: number,
    deaths: number,
    damage: number,
    healing: number,
    headshots: number,
    backstabs: number
) => {
    await ensureUserExists(steamID64);

    const queryText = `
        INSERT INTO daily_classes (
            year_id,
            day_id,
            user_id,
            class_name,
            playtime_in_seconds,
            match_count,
            wins,
            losses,
            kills,
            assists,
            deaths,
            damage,
            healing,
            headshots,
            backstabs
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (year_id, day_id, user_id, class_name) 
        DO UPDATE 
        SET
            playtime_in_seconds = daily_classes.playtime_in_seconds + $5,
            match_count = daily_classes.match_count + $6,
            wins = daily_classes.wins + $7,
            losses = daily_classes.losses + $8,
            kills = daily_classes.kills + $9,
            assists = daily_classes.assists + $10,
            deaths = daily_classes.deaths + $11,
            damage = daily_classes.damage + $12,
            healing = daily_classes.healing + $13,
            headshots = daily_classes.headshots + $14,
            backstabs = daily_classes.backstabs + $15
    `;

    const values = [
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
        damage,
        healing,
        headshots,
        backstabs,
    ];

    try {
        await query(queryText, values);
        //console.log(`Inserted/Updated daily classes for ${steamID64} (${class_name}) on ${yearId}-${dayId}`);
    } catch (error) {
        console.error('Error inserting/updating daily classes:', error);
        throw error;
    }
};

export const insertOrUpdateDailyMain = async (
    yearId: number,
    dayId: number,
    userId: string,
    totalPlaytimeInSeconds: number,
    matchCount: number,
    wins: number,
    losses: number,
    ninePlayerMatches: number,
    sixPlayerMatches: number,
    fourPlayerMatches: number,
    twoPlayerMatches: number
) => {
    const queryText = `
        INSERT INTO daily_main (
            year_id, day_id, user_id, total_playtime_in_seconds, 
            total_match_count, matches_won, matches_lost, 
            "9s_matches", "6s_matches", "4s_matches", "2s_matches"
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (year_id, day_id, user_id) 
        DO UPDATE 
        SET 
            total_playtime_in_seconds = daily_main.total_playtime_in_seconds + $4,
            total_match_count = daily_main.total_match_count + $5,
            matches_won = daily_main.matches_won + $6,
            matches_lost = daily_main.matches_lost + $7,
            "9s_matches" = daily_main."9s_matches" + $8,
            "6s_matches" = daily_main."6s_matches" + $9,
            "4s_matches" = daily_main."4s_matches" + $10,
            "2s_matches" = daily_main."2s_matches" + $11
    `;

    const values = [
        yearId,
        dayId,
        userId,
        totalPlaytimeInSeconds,
        matchCount,
        wins,
        losses,
        ninePlayerMatches,
        sixPlayerMatches,
        fourPlayerMatches,
        twoPlayerMatches
    ];

    try {
        await query(queryText, values);
        //console.log('Successfully inserted/updated daily_main stats');
    } catch (error) {
        console.error('Error inserting/updating daily_main stats:', error);
        throw error;
    }
};




export const ensureUserExists = async (steamID64: string) => {
    try {
        // First, check if the user already exists in the users table
        const checkUserQuery = `SELECT * FROM users WHERE user_id = $1`;
        const userCheckResult = await query(checkUserQuery, [steamID64]);

        if (userCheckResult.rowCount === 0) {
            // If the user does not exist, insert the user into the users table
            const insertUserQuery = `
                INSERT INTO users (user_id, has_logged_in_before, privacy_preference)
                VALUES ($1, false, 'public')
            `;
            await query(insertUserQuery, [steamID64]);
            //console.log(`Inserted new user with SteamID64: ${steamID64}`);
        } else {
            //console.log(`User with SteamID64: ${steamID64} already exists`);
        }
    } catch (error) {
        console.error('Error ensuring user exists:', error);
        throw error;
    }
};

