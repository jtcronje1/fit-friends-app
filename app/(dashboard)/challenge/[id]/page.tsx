"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Trophy, ArrowLeft, Users, Calendar, MoreHorizontal, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Challenge, Team, ActivityLog, Profile } from "@/types";
import { LogActivity } from "@/components/log-activity";
import { ActivityFeed } from "@/components/activity-feed";
import { ChallengeStats } from "@/components/challenge-stats";
import { TeamScores } from "@/components/team-scores";
import { DailyQuote } from "@/components/daily-quote";

export default function ChallengePage() {
  const params = useParams();
  const challengeId = params.id as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [members, setMembers] = useState<Profile[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isReferee, setIsReferee] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("log");

  useEffect(() => {
    fetchChallengeData();
    checkUser();
  }, [challengeId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchChallengeData = async () => {
    try {
      // Fetch challenge
      const { data: challengeData, error: challengeError } = await supabase
        .from("challenges")
        .select("*")
        .eq("id", challengeId)
        .single();

      if (challengeError) throw challengeError;
      setChallenge(challengeData);

      // Check if user is referee
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsReferee((challengeData as any).referee_id === user.id);
      }

      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*")
        .eq("challenge_id", challengeId);

      if (teamsError) throw teamsError;
      setTeams(teamsData || []);

      // Fetch activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("challenge_id", challengeId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (activitiesError) throw activitiesError;
      setActivities(activitiesData || []);
    } catch (error) {
      console.error("Error fetching challenge data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "completed":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Challenge not found</h1>
          <Link href="/dashboard">
            <Button className="bg-orange-500 hover:bg-orange-600">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="rounded-full -ml-2">
                  <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-slate-900 leading-tight">{challenge.name}</h1>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(challenge.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(challenge.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isReferee && (
                <Badge className="bg-orange-100 text-orange-700 border-orange-200 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span className="hidden sm:inline">Referee</span>
                </Badge>
              )}
              <Badge className={getStatusColor(challenge.status)}>
                {challenge.status}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Daily Quote */}
      <DailyQuote startDate={challenge.start_date} />

      {/* Team Scores */}
      <TeamScores teams={teams} activities={activities} />

      {/* Main Content */}
      <main className="pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-16 z-40 bg-white border-b border-slate-100">
            <div className="container mx-auto px-4">
              <TabsList className="w-full grid grid-cols-3 bg-transparent p-0 h-14">
                <TabsTrigger 
                  value="log" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium"
                >
                  Log
                </TabsTrigger>
                <TabsTrigger 
                  value="feed"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium"
                >
                  Feed
                </TabsTrigger>
                <TabsTrigger 
                  value="stats"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium"
                >
                  Stats
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="container mx-auto px-4 py-6">
            <TabsContent value="log" className="mt-0">
              <LogActivity
                challengeId={challengeId}
                teams={teams}
                onActivityLogged={fetchChallengeData}
              />
            </TabsContent>

            <TabsContent value="feed" className="mt-0">
              <ActivityFeed
                activities={activities}
                teams={teams}
                isReferee={isReferee}
                onActivityDeleted={fetchChallengeData}
              />
            </TabsContent>

            <TabsContent value="stats" className="mt-0">
              <ChallengeStats
                teams={teams}
                activities={activities}
                challenge={challenge}
              />
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 safe-bottom md:hidden">
        <div className="flex items-center justify-around py-3">
          <button 
            onClick={() => setActiveTab("log")}
            className={`flex flex-col items-center gap-1 ${activeTab === "log" ? "text-orange-600" : "text-slate-400"}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === "log" ? "bg-orange-100" : ""}`}>
              <Trophy className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Log</span>
          </button>
          <button 
            onClick={() => setActiveTab("feed")}
            className={`flex flex-col items-center gap-1 ${activeTab === "feed" ? "text-orange-600" : "text-slate-400"}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === "feed" ? "bg-orange-100" : ""}`}>
              <Users className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Feed</span>
          </button>
          <button 
            onClick={() => setActiveTab("stats")}
            className={`flex flex-col items-center gap-1 ${activeTab === "stats" ? "text-orange-600" : "text-slate-400"}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === "stats" ? "bg-orange-100" : ""}`}>
              <MoreHorizontal className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Stats</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
