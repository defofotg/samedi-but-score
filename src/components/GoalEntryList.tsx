
import React from "react";
import { Minus } from "lucide-react";
import { GoalEntry } from "@/types/sports";
import { Button } from "@/components/ui/button";

interface GoalEntryListProps {
  entries: GoalEntry[];
  team: string;
  matchId: string;
  onRemoveGoal: ({
    matchId,
    team,
    playerId,
  }: {
    matchId: string;
    team: string;
    playerId: string;
  }) => void;
  align?: "left" | "right";
  disabled?: boolean;
}

const GoalEntryList: React.FC<GoalEntryListProps> = ({
  entries,
  team,
  matchId,
  onRemoveGoal,
  align = "left",
  disabled = false,
}) => {
  // Aligner à gauche ou à droite selon align
  const alignClass = align === "right" ? "items-end text-right" : "items-start text-left";

  return (
    <div className={`flex-1 flex flex-col gap-2 ${alignClass}`}>
      {entries.map((entry, idx) => (
        <div
          key={entry.playerId + idx}
          className="p-2 rounded bg-green-50 w-fit flex items-center gap-2"
        >
          <span>{entry.playerName}</span>
          <span className="ml-1 text-gray-600">
            ({entry.nbGoals} but{entry.nbGoals > 1 ? "s" : ""})
          </span>
          {!disabled && entry.nbGoals > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              title="Retirer un but"
              onClick={() =>
                onRemoveGoal({
                  matchId,
                  team,
                  playerId: entry.playerId,
                })
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
