
import { Match } from "@/types/sports";


const API_URL = 'http://localhost:8080/api/matches'; // Adapte selon ton backend

// Simulates a call to a backend
export async function getMatches(): Promise<Match[]> {
  console.log('Fetching matches...');
  const res = await fetch(API_URL);
  return res.json();
}

export async function addMatch(match: Match): Promise<void> {
  const matches = await getMatches();
  matches.push(match);
  //localStorage.setItem(LS_KEY, JSON.stringify(matches));
}

export async function updateMatch(updated: Match): Promise<void> {
  let matches = await getMatches();
  matches = matches.map(m => m.id === updated.id ? updated : m);
  //localStorage.setItem(LS_KEY, JSON.stringify(matches));
}
