
import { Player } from "@/types/sports";

const API_URL = 'http://localhost:8080/api/players'; // Adapte selon ton backend

// Simulates a call to a backend
export async function getPlayers(): Promise<Player[]> {
  console.log('Fetching players...');
  const res = await fetch(API_URL);
  return res.json();
}

export async function addPlayer(player: Player): Promise<void> {
  const players = await getPlayers();
  players.push(player);
  //localStorage.setItem(LS_KEY, JSON.stringify(players));
}

// Future: add removePlayer, updatePlayer etc here
