
import { Player } from "@/types/sports";

// Fake API with local data as fallback (replace with real fetches)
const LS_KEY = "players";

// Simulates a call to a backend
export async function getPlayers(): Promise<Player[]> {
  const str = localStorage.getItem(LS_KEY);
  return str ? JSON.parse(str) : [];
}

export async function addPlayer(player: Player): Promise<void> {
  const players = await getPlayers();
  players.push(player);
  localStorage.setItem(LS_KEY, JSON.stringify(players));
}

// Future: add removePlayer, updatePlayer etc here
