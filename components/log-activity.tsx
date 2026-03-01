"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { Team } from "@/types";
import { PRESET_EXERCISES, calculatePoints, isWithinChallenge } from "@/lib/exercises";
import { Activity, Upload, Link, Zap, ChevronRight } from "lucide-react";

interface LogActivityProps {
  challengeId: string;
  teams: Team[];
  onActivityLogged: () => void;
}

export function LogActivity({ challengeId, teams, onActivityLogged }: LogActivityProps) {
  const [user, setUser] = useState<any>(null);
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [exerciseId, setExerciseId] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [proofUrl, setProofUrl] = useState("");
  const [stravaLink, setStravaLink] = useState("");
  const [notes, setNotes] = useState("");

  const [previewPoints, setPreviewPoints] = useState(0);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (exerciseId && measurement) {
      const points = calculatePoints(exerciseId, parseFloat(measurement) || 0);
      setPreviewPoints(points);
    } else {
      setPreviewPoints(0);
    }
  }, [exerciseId, measurement]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user && teams.length > 0) {
      const { data: memberData } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", user.id)
        .in("team_id", teams.map((t) => t.id))
        .single();

      if (memberData) {
        const team = teams.find((t) => t.id === memberData.team_id);
        setUserTeam(team || null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userTeam) {
      setError("You must be part of a team to log activities");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const points = calculatePoints(exerciseId, parseFloat(measurement));

      const { error: logError } = await supabase.from("activity_logs").insert({
        challenge_id: challengeId,
        user_id: user.id,
        team_id: userTeam.id,
        exercise_type_id: exerciseId,
        measurement: parseFloat(measurement),
        points,
        date,
        proof_url: proofUrl || null,
        strava_link: stravaLink || null,
        notes: notes || null,
      });

      if (logError) throw logError;

      setSuccess(true);
      resetForm();
      onActivityLogged();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to log activity");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setExerciseId("");
    setMeasurement("");
    setDate(new Date().toISOString().split("T")[0]);
    setProofUrl("");
    setStravaLink("");
    setNotes("");
    setPreviewPoints(0);
  };

  const selectedExercise = PRESET_EXERCISES.find((e) => e.id === exerciseId);

  if (!userTeam) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="h-10 w-10 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Not in a team yet</h3>
          <p className="text-slate-600 max-w-sm mx-auto">
            You need to join a team before you can log activities. Ask the challenge creator for an invite link!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Log Activity</CardTitle>
              {userTeam && (
                <p className="text-sm text-slate-500">
                  Logging for <span style={{ color: userTeam.color }} className="font-semibold">{userTeam.name}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Exercise Selection */}
          <div className="space-y-3">
            <Label className="text-slate-700 font-medium">Select Exercise</Label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_EXERCISES.map((exercise) => (
                <button
                  key={exercise.id}
                  type="button"
                  onClick={() => setExerciseId(exercise.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    exerciseId === exercise.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-slate-100 bg-white hover:border-orange-200"
                  }`}
                >
                  <div className="text-2xl mb-1">{exercise.icon}</div>
                  <div className="text-sm font-semibold text-slate-900 leading-tight">{exercise.name}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {exercise.points_per} pts / {exercise.unit_amount} {exercise.unit}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Measurement & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="measurement" className="text-slate-700 font-medium">
                {selectedExercise ? `Amount (${selectedExercise.unit})` : "Amount"}
              </Label>
              <Input
                id="measurement"
                type="number"
                step="0.1"
                min="0"
                placeholder="0"
                value={measurement}
                onChange={(e) => setMeasurement(e.target.value)}
                required
                className="h-12 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500 text-lg font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-slate-700 font-medium">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="h-12 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Points Preview */}
          {previewPoints > 0 && (
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  <span className="font-medium">Points Earned</span>
                </div>
                <span className="text-3xl font-bold">{previewPoints}</span>
              </div>
            </div>
          )}

          <Separator />

          {/* Optional Fields */}
          <div className="space-y-4">
            <Label className="text-slate-700 font-medium">Optional Details</Label>
            
            <div className="space-y-3">
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="url"
                  placeholder="Screenshot/Proof URL"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="h-12 pl-10 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="url"
                  placeholder="Strava Link"
                  value={stravaLink}
                  onChange={(e) => setStravaLink(e.target.value)}
                  className="h-12 pl-10 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <Input
                placeholder="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-12 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-4 rounded-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 p-4 rounded-xl">
              Activity logged successfully! 🎉
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/25 font-semibold text-lg"
            disabled={loading || !exerciseId || !measurement}
          >
            {loading ? "Logging..." : "Log Activity"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
