import { steamID3ToID64 } from '../utils/steamIDConverter'; // Helper function to convert SteamID3 to SteamID64

export interface ChatEvent {
    time: number;              // Timestamp of the chat message (epoch time)
    username: string;          // Username of the player
    steamID64: string;         // SteamID64 of the player
    team: string;              // Team of the player (e.g., "Red", "Blue")
    message: string;           // The chat message
    isTeamChat: boolean;       // Whether it's a team chat or not
}

// Array to store parsed chat events
let chatEvents: ChatEvent[] = [];

/**
 * Parses a chat log line and stores the chat event.
 * @param line The log line to be parsed.
 */
export const parseChatLine = (line: string) => {
    // Regex to match 'say' or 'say_team' chat messages
    const regex =
        /L (\d+\/\d+\/\d+ - \d+:\d+:\d+): "([^"]+)<\d+><(\[U:\d+:\d+\])><([^>]+)>" (say|say_team) "(.*)"/;

    const match = line.match(regex);

    if (match) {
        const timeString = match[1];  // Log timestamp (e.g., "01/01/2024 - 11:51:35")
        const username = match[2];     // Player's username (e.g., "ozn")
        const steamID3 = match[3];     // SteamID3 (e.g., "[U:1:420322629]")
        const team = match[4];         // Team ("Red" or "Blue")
        const chatType = match[5];     // "say" or "say_team"
        const message = match[6];      // The message content

        const steamID64 = steamID3ToID64(steamID3);  // Convert SteamID3 to SteamID64

        // Convert time to epoch
        const parseLogTime = (timeString: string): number => {
            const [datePart, timePart] = timeString.split(' - ');
            const [month, day, year] = datePart.split('/').map((num) => parseInt(num, 10));
            const [hours, minutes, seconds] = timePart.split(':').map((num) => parseInt(num, 10));

            return Date.UTC(year, month - 1, day, hours, minutes, seconds); // Convert to epoch time
        };

        const time = parseLogTime(timeString);

        // Create a new chat event object
        const chatEvent: ChatEvent = {
            time,
            username,
            steamID64,
            team,
            message,
            isTeamChat: chatType === 'say_team', // Determine if it's a team message
        };

        // Store the chat event
        chatEvents.push(chatEvent);

        //console.log(`Player ${username} (${steamID64}) [${team}] said: "${message}" (Team chat: ${chatType === 'say_team'})`);
    }
};

/**
 * Retrieves all chat events.
 * @returns All stored chat events.
 */
export const getChatEvents = (): ChatEvent[] => {
    return chatEvents;
};
