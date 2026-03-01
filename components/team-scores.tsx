"use client";

import { Trophy, TrendingUp } from "lucide-react";
import { Team, ActivityLog } from "@/types";

interface TeamScoresProps {
  teams: Team[];
  activities: ActivityLog[];
}

export function TeamScores({ teams, activities }: TeamScoresProps) {
  // Calculate team scores
  const teamScores = teams.map((team) => {
    const teamActivities = activities.filter((a) => a.team_id === team.id);
    const totalPoints = teamActivities.reduce((sum, a) => sum + a.points, 0);
    return {
      ...team,
      totalPoints,
      activityCount: teamActivities.length,
    };
  });

  const totalPoints = teamScores.reduce((sum, t) => sum + t.totalPoints, 0);
  const leadingTeam = teamScores.reduce((prev, current) => 
    prev.totalPoints > current.totalPoints ? prev : current
  );

  return (
    <div className="bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-orange-500" />
            <span className="font-bold text-slate-900">Live Scores</span>
          </div>
          {leadingTeam.totalPoints > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-slate-600">
                <span style={{ color: leadingTeam.color }} className="font-semibold">
                  {leadingTeam.name}
                </span>
                {" "}is leading
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {teamScores.map((team) => {
            const percentage = totalPoints > 0 ? (team.totalPoints / totalPoints) * 100 : 50;
            return (
              <div key={team.id} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                    <span className="font-semibold text-slate-900">{team.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{team.totalPoints} pts</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: team.color,
                      width: `${Math.max(percentage, 5)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
