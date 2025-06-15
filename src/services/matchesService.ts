
import { Match } from "@/types/sports";

// Fake API with local data as fallback (replace with real fetches)
const LS_KEY = "matches";

// Simulates a call to a backend
export async function getMatches(): Promise<Match[]> {
  const str = localStorage.getItem(LS_KEY);
  return str ? JSON.parse(str) : [];
}

export async function addMatch(match: Match): Promise<void> {
  const matches = await getMatches();
  matches.push(match);
  localStorage.setItem(LS_KEY, JSON.stringify(matches));
}

export async function updateMatch(updated: Match): Promise<void> {
  let matches = await getMatches();
  matches = matches.map(m => m.id === updated.id ? updated : m);
  localStorage.setItem(LS_KEY, JSON.stringify(matches));
}
