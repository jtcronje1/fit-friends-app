"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trophy, ArrowLeft, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { getNextMonday, getChallengeEndDate } from "@/lib/exercises";

export default function CreateChallengePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Challenge details
  const [challengeName, setChallengeName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(getNextMonday().toISOString().split("T")[0]);

  // Team details
  const [team1Name, setTeam1Name] = useState("Team Orange");
  const [team2Name, setTeam2Name] = useState("Team Blue");
  const [team1Color, setTeam1Color] = useState("#f97316");
  const [team2Color, setTeam2Color] = useState("#3b82f6");

  const handleCreateChallenge = async () => {
    setLoading(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const start = new Date(startDate);
      const end = getChallengeEndDate(start);

      // Create challenge
      const { data: challenge, error: challengeError } = await supabase
        .from("challenges")
        .insert({
          name: challengeName,
          description,
          start_date: start.toISOString(),
          end_date: end.toISOString(),
          created_by: user.id,
          referee_id: user.id,
          status: "pending",
          max_participants: 6,
        } as any)
        .select()
        .single();

      if (challengeError) throw challengeError;

      // Create teams
      const { error: teamsError } = await (supabase.from("teams").insert as any)([
        {
          challenge_id: (challenge as any).id,
          name: team1Name,
          color: team1Color,
        },
        {
          challenge_id: (challenge as any).id,
          name: team2Name,
          color: team2Color,
        },
      ]);

      if (teamsError) throw teamsError;

      router.push(`/challenge/${(challenge as any).id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create challenge");
      setLoading(false);
    }
  };

  const colorOptions = [
    { name: "Orange", value: "#f97316", bg: "bg-orange-500" },
    { name: "Blue", value: "#3b82f6", bg: "bg-blue-500" },
    { name: "Green", value: "#22c55e", bg: "bg-green-500" },
    { name: "Red", value: "#ef4444", bg: "bg-red-500" },
    { name: "Purple", value: "#a855f7", bg: "bg-purple-500" },
    { name: "Pink", value: "#ec4899", bg: "bg-pink-500" },
    { name: "Teal", value: "#14b8a6", bg: "bg-teal-500" },
    { name: "Yellow", value: "#eab308", bg: "bg-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">New Challenge</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-32 max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
            step >= 1 ? "bg-orange-500 text-white" : "bg-slate-200 text-slate-500"
          }`}>
            1
          </div>
          <div className={`flex-1 h-1 rounded-full ${step >= 2 ? "bg-orange-500" : "bg-slate-200"}`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
            step >= 2 ? "bg-orange-500 text-white" : "bg-slate-200 text-slate-500"
          }`}>
            2
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        {step === 1 ? (
          <Card className="border-0 shadow-xl shadow-slate-200/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Challenge Details</CardTitle>
              <CardDescription>
                Set up your 28-day fitness competition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">
                  Challenge Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., March Fitness Showdown"
                  value={challengeName}
                  onChange={(e) => setChallengeName(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 font-medium">
                  Description <span className="text-slate-400 font-normal">(optional)</span>
                </Label>
                <Input
                  id="description"
                  placeholder="What's this challenge about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-slate-700 font-medium">
                  Start Date (Monday) *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                />
                <div className="flex items-start gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>Challenges run for 28 days from the selected Monday</p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-4 rounded-xl border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-orange-500" />
                  <span className="font-semibold text-slate-900">Free Plan</span>
                </div>
                <p className="text-sm text-slate-600">
                  Up to <strong>6 participants</strong> (3 per team) • 28 days • 13 exercise types
                </p>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!challengeName || !startDate}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/25 font-semibold"
              >
                Continue to Teams
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-xl shadow-slate-200/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Team Setup</CardTitle>
              <CardDescription>
                Create two teams to compete
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Team 1 */}
              <div className="space-y-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <h3 className="font-bold text-slate-900">Team 1</h3>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Team Name</Label>
                  <Input
                    value={team1Name}
                    onChange={(e) => setTeam1Name(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Team Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setTeam1Color(color.value)}
                        className={`w-10 h-10 rounded-xl ${color.bg} transition-all ${
                          team1Color === color.value
                            ? "ring-2 ring-offset-2 ring-slate-900 scale-110"
                            : "hover:scale-105"
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* VS Divider */}
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="text-slate-500 font-bold text-sm">VS</span>
                </div>
              </div>

              {/* Team 2 */}
              <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <h3 className="font-bold text-slate-900">Team 2</h3>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Team Name</Label>
                  <Input
                    value={team2Name}
                    onChange={(e) => setTeam2Name(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Team Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setTeam2Color(color.value)}
                        className={`w-10 h-10 rounded-xl ${color.bg} transition-all ${
                          team2Color === color.value
                            ? "ring-2 ring-offset-2 ring-slate-900 scale-110"
                            : "hover:scale-105"
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12 rounded-xl border-2"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCreateChallenge}
                  disabled={loading || !team1Name || !team2Name}
                  className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/25 font-semibold"
                >
                  {loading ? "Creating..." : "Create Challenge"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
