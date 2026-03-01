"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Team, ActivityLog, Challenge } from "@/types";
import { PRESET_EXERCISES, getMemberColor } from "@/lib/exercises";
import { format, parseISO } from "date-fns";
import { TrendingUp, Users, Activity, Trophy } from "lucide-react";

interface ChallengeStatsProps {
  teams: Team[];
  activities: ActivityLog[];
  challenge: Challenge;
}

export function ChallengeStats({ teams, activities, challenge }: ChallengeStatsProps) {
  // Calculate stats
  const totalPoints = activities.reduce((sum, a) => sum + a.points, 0);
  const totalActivities = activities.length;
  
  const uniqueParticipants = new Set(activities.map((a) => a.user_id)).size;
  
  const teamStats = teams.map((team) => {
    const teamActivities = activities.filter((a) => a.team_id === team.id);
    const points = teamActivities.reduce((sum, a) => sum + a.points, 0);
    const count = teamActivities.length;
    const avgPoints = count > 0 ? Math.round(points / count) : 0;
    return { ...team, points, count, avgPoints };
  });

  const topExercises = PRESET_EXERCISES.map((exercise) => {
    const exerciseActivities = activities.filter((a) => a.exercise_type_id === exercise.id);
    const count = exerciseActivities.length;
    const points = exerciseActivities.reduce((sum, a) => sum + a.points, 0);
    return { ...exercise, count, points };
  })
    .filter((e) => e.count > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  // Daily activity data
  const dailyData = activities.reduce((acc, activity) => {
    const date = format(parseISO(activity.date), "MMM d");
    if (!acc[date]) acc[date] = { date, points: 0, count: 0 };
    acc[date].points += activity.points;
    acc[date].count += 1;
    return acc;
  }, {} as Record<string, { date: string; points: number; count: number }>);

  const sortedDailyData = Object.values(dailyData).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Trophy className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{totalPoints}</p>
                <p className="text-xs text-slate-500">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{totalActivities}</p>
                <p className="text-xs text-slate-500">Activities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Stats */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-400" />
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamStats.map((team) => (
              <div key={team.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: team.color }}
                  >
                    {team.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{team.name}</p>
                    <p className="text-xs text-slate-500">{team.count} activities</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-slate-900">{team.points}</p>
                  <p className="text-xs text-slate-500">{team.avgPoints} avg</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Exercises */}
      {topExercises.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-slate-400" />
              Top Exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topExercises.map((exercise, index) => (
                <div key={exercise.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{exercise.icon}</span>
                    <div>
                      <p className="font-medium text-slate-900">{exercise.name}</p>
                      <p className="text-xs text-slate-500">{exercise.count} activities</p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-900">{exercise.points} pts</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Activity */}
      {sortedDailyData.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Daily Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sortedDailyData.slice(-7).map((day) => (
                <div key={day.date} className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-600">{day.date}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500">{day.count} activities</span>
                    <span className="font-semibold text-slate-900 w-12 text-right">{day.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
