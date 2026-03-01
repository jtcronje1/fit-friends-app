"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActivityLog, Team } from "@/types";
import { PRESET_EXERCISES } from "@/lib/exercises";
import { format } from "date-fns";
import { Flag, Trash2, ExternalLink, AlertCircle, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ActivityFeedProps {
  activities: ActivityLog[];
  teams: Team[];
  isReferee: boolean;
  onActivityDeleted: () => void;
}

export function ActivityFeed({ activities, teams, isReferee, onActivityDeleted }: ActivityFeedProps) {
  const [disputeActivity, setDisputeActivity] = useState<ActivityLog | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [deleteActivity, setDeleteActivity] = useState<ActivityLog | null>(null);
  const [loading, setLoading] = useState(false);

  const getExerciseName = (exerciseId: string) => {
    return PRESET_EXERCISES.find((e) => e.id === exerciseId)?.name || exerciseId;
  };

  const getExerciseIcon = (exerciseId: string) => {
    return PRESET_EXERCISES.find((e) => e.id === exerciseId)?.icon || "🏃";
  };

  const getTeam = (teamId: string) => {
    return teams.find((t) => t.id === teamId);
  };

  const handleDispute = async () => {
    if (!disputeActivity || !disputeReason) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("disputes").insert({
        activity_log_id: disputeActivity.id,
        raised_by: user.id,
        reason: disputeReason,
        status: "open",
      });

      if (error) throw error;

      setDisputeActivity(null);
      setDisputeReason("");
    } catch (err) {
      console.error("Error creating dispute:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteActivity) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("activity_logs")
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: user.id,
        })
        .eq("id", deleteActivity.id);

      if (error) throw error;

      setDeleteActivity(null);
      onActivityDeleted();
    } catch (err) {
      console.error("Error deleting activity:", err);
    } finally {
      setLoading(false);
    }
  };

  if (activities.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🏃</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No activities yet</h3>
          <p className="text-slate-600">
            Be the first to log an activity in this challenge!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {isReferee && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Referee Mode</p>
              <p className="text-sm text-slate-600">
                You can delete entries and resolve disputes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {activities.map((activity) => {
        const team = getTeam(activity.team_id);
        return (
          <Card key={activity.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback 
                    className="text-lg"
                    style={{ backgroundColor: `${team?.color}20`, color: team?.color }}
                  >
                    {getExerciseIcon(activity.exercise_type_id)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-900">
                        {getExerciseName(activity.exercise_type_id)}
                      </p>
                      <p className="text-sm text-slate-600">
                        {activity.measurement} {PRESET_EXERCISES.find((e) => e.id === activity.exercise_type_id)?.unit}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-xl font-bold text-lg">
                      +{activity.points}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <Badge 
                      variant="secondary" 
                      className="font-medium"
                      style={{ backgroundColor: `${team?.color}15`, color: team?.color, borderColor: `${team?.color}30` }}
                    >
                      {team?.name}
                    </Badge>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">
                      {format(new Date(activity.date), "MMM d, yyyy")}
                    </span>
                  </div>

                  {(activity.proof_url || activity.strava_link) && (
                    <div className="flex items-center gap-3 mt-3">
                      {activity.proof_url && (
                        <a
                          href={activity.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Proof
                        </a>
                      )}
                      {activity.strava_link && (
                        <a
                          href={activity.strava_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1 font-medium"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Strava
                        </a>
                      )}
                    </div>
                  )}

                  {activity.notes && (
                    <div className="flex items-start gap-2 mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                      <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0 text-slate-400" />
                      <p>{activity.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-4">
                    {!isReferee && (
                      <Dialog open={disputeActivity?.id === activity.id} onOpenChange={() => setDisputeActivity(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-orange-600 border-orange-200 hover:bg-orange-50"
                            onClick={() => setDisputeActivity(activity)}
                          >
                            <Flag className="h-4 w-4 mr-1.5" />
                            Dispute
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-2xl">
                          <DialogHeader>
                            <DialogTitle>Dispute Activity</DialogTitle>
                            <DialogDescription>
                              Report this activity if you believe it&apos;s incorrect or fraudulent.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Reason for dispute</Label>
                              <Input
                                placeholder="Explain why this activity is disputed..."
                                value={disputeReason}
                                onChange={(e) => setDisputeReason(e.target.value)}
                                className="h-12 rounded-xl"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDisputeActivity(null)} className="rounded-xl">
                              Cancel
                            </Button>
                            <Button
                              onClick={handleDispute}
                              disabled={!disputeReason || loading}
                              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
                            >
                              {loading ? "Submitting..." : "Submit Dispute"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}

                    {isReferee && (
                      <Dialog open={deleteActivity?.id === activity.id} onOpenChange={() => setDeleteActivity(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => setDeleteActivity(activity)}
                          >
                            <Trash2 className="h-4 w-4 mr-1.5" />
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-2xl">
                          <DialogHeader>
                            <DialogTitle>Delete Activity</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this activity? This action can be undone later.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteActivity(null)} className="rounded-xl">
                              Cancel
                            </Button>
                            <Button
                              onClick={handleDelete}
                              disabled={loading}
                              variant="destructive"
                              className="rounded-xl"
                            >
                              {loading ? "Deleting..." : "Delete Activity"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
