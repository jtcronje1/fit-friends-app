"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy, Plus, Users, Calendar, ChevronRight, LogOut, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { Challenge } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    fetchChallenges();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUser(user);
  };

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error("Error fetching challenges:", error);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />;
      case "pending":
        return <span className="w-2 h-2 bg-orange-500 rounded-full" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Fit Friends</span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-2 border-orange-100">
              <AvatarFallback className="bg-orange-100 text-orange-700 text-sm font-semibold">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/login");
              }}
              className="text-slate-500 hover:text-slate-700"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-slate-600">
            Ready to compete with your friends?
          </p>
        </div>

        {/* Create Challenge CTA */}
        <Link href="/challenge/create">
          <Card className="mb-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 transition-shadow cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Plus className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Create New Challenge</h3>
                    <p className="text-orange-100 text-sm">Start a 28-day fitness competition</p>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-white/70 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Challenges Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Your Challenges</h2>
          <Badge variant="outline" className="text-slate-600">
            {challenges.length} active
          </Badge>
        </div>

        {challenges.length === 0 ? (
          <Card className="text-center py-16 border-dashed border-2 border-slate-200 bg-slate-50/50">
            <CardContent>
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No challenges yet</h3>
              <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                Create your first fitness challenge and invite friends to compete!
              </p>
              <Link href="/challenge/create">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Challenge
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {challenges.map((challenge) => (
              <Link key={challenge.id} href={`/challenge/${challenge.id}`}>
                <Card className="hover:shadow-lg hover:shadow-orange-500/5 transition-all cursor-pointer group border-slate-200">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-slate-900 text-lg truncate">
                            {challenge.name}
                          </h3>
                          <Badge className={`${getStatusColor(challenge.status)} flex items-center gap-1.5 px-2.5 py-1`}>
                            {getStatusIcon(challenge.status)}
                            {challenge.status}
                          </Badge>
                        </div>
                        
                        {challenge.description && (
                          <p className="text-slate-600 text-sm mb-3 line-clamp-1">
                            {challenge.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            {new Date(challenge.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(challenge.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-slate-400" />
                            Max {challenge.max_participants}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 safe-bottom md:hidden">
        <div className="flex items-center justify-around py-3">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-orange-600">
            <Trophy className="h-6 w-6" />
            <span className="text-xs font-medium">Challenges</span>
          </Link>
          <Link href="/challenge/create" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center -mt-6 shadow-lg shadow-orange-500/30">
              <Plus className="h-6 w-6 text-white" />
            </div>
          </Link>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <Users className="h-6 w-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
