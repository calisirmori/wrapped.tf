export function steamID3ToID64(steamID3: string): string {
  const match = steamID3.match(/\[U:\d+:(\d+)\]/);
  if (!match || match.length < 2) {
      throw new Error('Invalid SteamID3 format');
  }
  const accountID = parseInt(match[1], 10);
  return (BigInt(accountID) + 76561197960265728n).toString();
}
