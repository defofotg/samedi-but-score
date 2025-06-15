
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import {AddGoalCommand, Player} from "@/types/sports";
import { toast } from "sonner";
import {useSportsStore} from "@/stores/useSportsStore.ts";

interface AddGoalFormProps {
  matchId: string;
  matchTeamA: string;
  matchTeamB: string;
  players: Player[];
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({
  matchId,
  matchTeamA,
  matchTeamB,
  players
}) => {
  const [goalData, setGoalData] = useState({
    playerId: "",
    team: "",
    nbGoals: 1,
  });

  const addGoalToMatch = useSportsStore((state) => state.addGoalMatch);

  const handleAddGoal = async () => {
    if (!goalData.playerId || !goalData.team) {
      toast.error("Veuillez sélectionner un joueur et une équipe");
      return;
    }
    await addGoalToMatch(matchId, { playerId: goalData.playerId, team: goalData.team, nbGoals: Number(goalData.nbGoals)} as AddGoalCommand);
    setGoalData({ playerId: "", team: "", nbGoals: 1 });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="w-28 md:flex-1">
          <Label>Buteur</Label>
          <select
              className="w-full p-2 border rounded"
              value={goalData.playerId}
              onChange={(e) => setGoalData({...goalData, playerId: e.target.value})}
          >
            <option value="">Sélectionner un joueur</option>
            {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
            ))}
          </select>
        </div>
        <div className="w-28 md:flex-1">
          <Label>Équipe</Label>
          <select
              className="w-full p-2 border rounded"
              value={goalData.team}
              onChange={(e) => setGoalData({...goalData, team: e.target.value})}
          >
            <option value="">Sélectionner une équipe</option>
            <option value={matchTeamA}>{matchTeamA}</option>
            <option value={matchTeamB}>{matchTeamB}</option>
          </select>
        </div>
        <div className="md:flex-1">
          <Label>Nb buts</Label>
          <Input
              type="number"
              min={1}
              max={10}
              value={goalData.nbGoals}
              onChange={(e) =>
                  setGoalData({...goalData, nbGoals: Number(e.target.value)})
              }
          />
        </div>
      </div>

      <Button onClick={handleAddGoal} className="md:w-1/4 md:self-center bg-green-600 hover:bg-green-700">
        <Target className="h-4 w-4 mr-1"/>
        Ajouter but
      </Button>
    </div>
  );
};

export default AddGoalForm;
