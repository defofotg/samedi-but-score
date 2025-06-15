
import React from "react";

interface MatchCardTitleProps {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  isCompleted?: boolean;
}

const MatchCardTitle: React.FC<MatchCardTitleProps> = ({
  teamA,
  teamB,
  scoreA,
  scoreB,
  isCompleted,
}) => (
  <div className="flex flex-col items-center mb-4">
    <div className="font-bold text-lg md:text-xl flex items-center gap-2 justify-center">
      <span className="text-green-700">{teamA}</span>
      <span className="font-medium text-gray-500">vs</span>
      <span className="text-green-700">{teamB}</span>
    </div>
    <div className="flex items-center mt-1 text-xl font-semibold justify-center gap-1">
      <span className="text-green-600">{scoreA}</span>
      <span className="px-2 text-gray-500">-</span>
      <span className="text-green-600">{scoreB}</span>
      {isCompleted && (
        <span className="ml-2 text-xs px-2 py-1 bg-green-600 text-white rounded">Terminé</span>
      )}
    </div>
  </div>
);

export default MatchCardTitle;
