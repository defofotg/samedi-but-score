
import create from "zustand";
import { Match, Player } from "@/types/sports";
import { getPlayers, addPlayer, getMatches, addMatch, updateMatches } from "@/services/playersService";
import { getMatches as getMatchesApi, addMatch as addMatchApi, updateMatch as updateMatchApi } from "@/services/matchesService";

interface SportsState {
  players: Player[];
  matches: Match[];
  fetchPlayers: () => Promise<void>;
  fetchMatches: () => Promise<void>;
  addPlayer: (player: Player) => Promise<void>;
  addMatch: (match: Match) => Promise<void>;
  setPlayers: (players: Player[]) => void;
  setMatches: (matches: Match[]) => void;
}

export const useSportsStore = create<SportsState>((set, get) => ({
  players: [],
  matches: [],
  fetchPlayers: async () => {
    const players = await getPlayers();
    set({ players });
  },
  fetchMatches: async () => {
    const matches = await getMatchesApi();
    set({ matches });
  },
  addPlayer: async (player: Player) => {
    await addPlayer(player);
    const players = await getPlayers();
    set({ players });
  },
  addMatch: async (match: Match) => {
    await addMatchApi(match);
    const matches = await getMatchesApi();
    set({ matches });
  },
  setPlayers: (players: Player[]) => set({ players }),
  setMatches: (matches: Match[]) => set({ matches }),
}));
