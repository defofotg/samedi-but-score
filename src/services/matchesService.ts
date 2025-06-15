
import {AddGoalCommand, Match, MatchCreationCommand} from "@/types/sports";

const BACK_URL = 'http://localhost:8080/api/';
const MATCHES_ENDPOINT = BACK_URL + 'matches'; // Adapte selon ton backend

// Simulates a call to a backend
export async function getMatches(): Promise<Match[]> {
  console.log('Fetching matches...');
  const res = await fetch(MATCHES_ENDPOINT);
  return res.json();
}

export async function addMatch(match: MatchCreationCommand): Promise<void> {
  console.log('Adding match...');
  const res = await fetch(MATCHES_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(match),
  });
  return res.json();
}

export async function addGoalMatch(matchId: string, addGoal: AddGoalCommand): Promise<void> {
  console.log('Adding goal to match...');
  const res = await fetch(`${MATCHES_ENDPOINT}/${matchId}/goals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(addGoal),
  });
  return res.json();
}

export async function updateMatch(updated: Match): Promise<void> {
  let matches = await getMatches();
  matches = matches.map(m => m.id === updated.id ? updated : m);
  //localStorage.setItem(LS_KEY, JSON.stringify(matches));
}
