
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { Player } from "@/types/sports";
import { toast } from "sonner";

interface AddGoalFormProps {
  matchId: string;
  matchTeamA: string;
  matchTeamB: string;
  players: Player[];
  addGoal: (
    matchId: string,
    playerId: string,
    team: string,
    nbGoals: number
  ) => void;
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({
  matchId,
  matchTeamA,
  matchTeamB,
  players,
  addGoal,
}) => {
  const [goalData, setGoalData] = useState({
    playerId: "",
    team: "",
    nbGoals: 1,
  });

  const handleAddGoal = () => {
    if (!goalData.playerId || !goalData.team) {
      toast.error("Veuillez sélectionner un joueur et une équipe");
      return;
    }
    addGoal(matchId, goalData.playerId, goalData.team, Number(goalData.nbGoals));
    setGoalData({ playerId: "", team: "", nbGoals: 1 });
  };

  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1">
        <Label>Buteur</Label>
        <select
          className="w-full p-2 border rounded"
          value={goalData.playerId}
          onChange={(e) => setGoalData({ ...goalData, playerId: e.target.value })}
        >
          <option value="">Sélectionner un joueur</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <Label>Équipe</Label>
        <select
          className="w-full p-2 border rounded"
          value={goalData.team}
          onChange={(e) => setGoalData({ ...goalData, team: e.target.value })}
        >
          <option value="">Sélectionner une équipe</option>
          <option value={matchTeamA}>{matchTeamA}</option>
          <option value={matchTeamB}>{matchTeamB}</option>
        </select>
      </div>
      <div className="flex-1">
        <Label>Nb buts</Label>
        <Input
          type="number"
          min={1}
          max={10}
          value={goalData.nbGoals}
          onChange={(e) =>
            setGoalData({ ...goalData, nbGoals: Number(e.target.value) })
          }
        />
      </div>
      <Button onClick={handleAddGoal} className="bg-green-600 hover:bg-green-700">
        <Target className="h-4 w-4 mr-1" />
        Ajouter but
      </Button>
    </div>
  );
};

export default AddGoalForm;
