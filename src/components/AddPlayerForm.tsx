import React, { useState } from "react";
import { Player } from "@/types/sports";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface AddPlayerFormProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  isAuthenticated: boolean;
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ players, setPlayers, isAuthenticated }) => {
  const [newPlayer, setNewPlayer] = useState({ name: "" });

  const addNewPlayer = () => {
    if (!newPlayer.name) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    const player: Player = {
      id: Date.now().toString(),
      name: newPlayer.name,
    };
    setPlayers([...players, player]);
    setNewPlayer({ name: "" });
    toast.success("Joueur ajouté avec succès");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Ajouter un joueur
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label>Nom du joueur</Label>
            <Input
              placeholder="Nom du joueur"
              value={newPlayer.name}
              onChange={(e) => setNewPlayer({ name: e.target.value })}
            />
          </div>
          <Button
            onClick={addNewPlayer}
            className="bg-green-600 hover:bg-green-700"
            disabled={!isAuthenticated}
          >
            Ajouter
          </Button>
        </div>
        {!isAuthenticated && (
          <p className="text-xs text-gray-400 mt-2">Connectez-vous pour ajouter un joueur.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AddPlayerForm;
