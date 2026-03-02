"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trophy, Users, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Challenge, Team } from "@/types";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const inviteCode = params.code as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    checkUser();
    fetchChallenge();
  }, [inviteCode]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchChallenge = async () => {
    try {
      // Find challenge by invite code
      const { data: challengeData, error: challengeError } = await supabase
        .from("challenges")
        .select("*")
        .eq("invite_code", inviteCode)
        .single();

      if (challengeError) throw new Error("Invalid invite link");
      setChallenge(challengeData);

      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*")
        .eq("challenge_id", challengeData.id);

      if (teamsError) throw teamsError;
      setTeams(teamsData || []);
    } catch (err: any) {
      setError(err.message || "Failed to load challenge");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      // Redirect to login with redirect back to this invite
      router.push(`/login?redirect=/invite/${inviteCode}`);
      return;
    }

    if (!selectedTeam) {
      setError("Please select a team");
      return;
    }

    setJoining(true);
    setError("");

    try {
      // Check if already a member
      const { data: existingMember } = await supabase
        .from("team_members")
        .select("*")
        .eq("team_id", selectedTeam)
        .eq("user_id", user.id)
        .single();

      if (existingMember) {
        setJoined(true);
        setTimeout(() => router.push(`/challenge/${challenge?.id}`), 1500);
        return;
      }

      // Add to team
      const { error: joinError } = await supabase
        .from("team_members")
        .insert({
          team_id: selectedTeam,
          user_id: user.id,
        } as any);

      if (joinError) throw joinError;

      setJoined(true);
      setTimeout(() => router.push(`/challenge/${challenge?.id}`), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to join challenge");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          <span className="text-slate-600">Loading challenge...</span>
        </div>
      </div>
    );
  }

  if (error && !challenge) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-xl">Invalid Invite</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")} className="w-full bg-orange-500 hover:bg-orange-600">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (joined) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-xl">You're In!</CardTitle>
            <CardDescription>
              You've successfully joined {challenge?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-slate-500 text-sm">
              Redirecting to challenge...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900">Fit Friends</span>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <Badge className="mx-auto mb-4 bg-orange-100 text-orange-700 border-orange-200">
              Challenge Invite
            </Badge>
            <CardTitle className="text-2xl">{challenge?.name}</CardTitle>
            <CardDescription className="text-slate-500">
              {challenge?.description || "Join this fitness challenge and compete with friends!"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Challenge Info */}
            <div className="bg-slate-50 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">
                  {new Date(challenge?.start_date || "").toLocaleDateString()} - {" "}
                  {new Date(challenge?.end_date || "").toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Team Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">
                Choose Your Team
              </label>
              <div className="grid grid-cols-2 gap-3">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeam(team.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedTeam === team.id
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg mb-2"
                      style={{ backgroundColor: team.color }}
                    />
                    <p className="font-semibold text-slate-900">{team.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {!user ? (
              <div className="space-y-3">
                <p className="text-center text-sm text-slate-500">
                  Sign in to join this challenge
                </p>
                <Button
                  onClick={() => router.push(`/login?redirect=/invite/${inviteCode}`)}
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold"
                >
                  Sign In to Join
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleJoin}
                disabled={joining || !selectedTeam}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold"
              >
                {joining ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Challenge"
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
