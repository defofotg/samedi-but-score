
import React from "react";
import { Minus } from "lucide-react";
import {GoalEntry, RemoveGoalCommand} from "@/types/sports";
import { Button } from "@/components/ui/button";
import {useSportsStore} from "@/stores/useSportsStore.ts";

interface GoalEntryListProps {
  entries: GoalEntry[];
  team: string;
  matchId: string;
  align?: "left" | "right";
  disabled?: boolean;
}

const GoalEntryList: React.FC<GoalEntryListProps> = ({
  entries,
  team,
  matchId,
  align = "left",
  disabled = false,
}) => {
  // Aligner à gauche ou à droite selon align
  const alignClass = align === "right" ? "items-end text-right" : "items-start text-left";

  const removeGoalFromMatch = useSportsStore((state) => state.removeGoalMatch);

  return (
    <div className={`flex-1 flex flex-col gap-2 ${alignClass}`}>
      {entries.map((entry, idx) => (
        <div
          key={entry.playerId + idx}
          className="p-2 rounded bg-green-50 w-fit flex items-center gap-2"
        >
          <span>{entry.playerName}</span>
          <span className="ml-1 text-gray-600">
            {entry.nbGoals > 1 && `(x${entry.nbGoals})`}
          </span>
          {!disabled && entry.nbGoals > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              title="Retirer un but"
              onClick={() =>
                  removeGoalFromMatch(matchId,{
                  playerId: entry.playerId,
                  team,
                } as RemoveGoalCommand)
              }
            >
              <Minus className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default GoalEntryList;
