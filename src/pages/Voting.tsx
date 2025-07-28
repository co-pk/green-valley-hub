import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Vote,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Trophy,
  LogOut,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useStudentStore } from "@/store/student.store";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { recordStudentVote } from "@/utils/firebase";

const Voting = () => {
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});
  const [voting, setVoting] = useState<string | null>(null);
  const { student } = useStudentStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!student) {
      navigate("/login");
    }
  }, [navigate, student]);

  // Fetch polls and voting status
  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "polls"));
      const pollsData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const poll = { id: docSnap.id, ...docSnap.data() };
          // Check if student has voted in this poll
          let voted = false;
          if (student) {
            const voteRef = doc(
              db,
              `polls/${poll.id}/votes`,
              student.studentId
            );
            const voteSnap = await getDoc(voteRef);
            voted = voteSnap.exists();
          }
          return { ...poll, hasVoted: voted };
        })
      );
      setPolls(pollsData);
      setHasVoted(Object.fromEntries(pollsData.map((p) => [p.id, p.hasVoted])));
      setLoading(false);
    };
    if (student) fetchPolls();
  }, [student]);

  const handleVote = async (pollId: string, nominationIdx: number) => {
    if (!student) return;
    setVoting(pollId);
    try {
      await recordStudentVote({
        pollId,
        nominationIdx,
        studentId: student.studentId,
      });
      toast({
        title: "Vote Recorded",
        description: "Your vote has been successfully recorded!",
      });
      setHasVoted((prev) => ({ ...prev, [pollId]: true }));
      // Update poll votes in UI
      setPolls((prev) =>
        prev.map((p) =>
          p.id === pollId
            ? {
                ...p,
                nominations: p.nominations.map((n: any, idx: number) =>
                  idx === nominationIdx
                    ? { ...n, totalVotes: (n.totalVotes || 0) + 1 }
                    : n
                ),
                hasVoted: true,
              }
            : p
        )
      );
    } catch (err: any) {
      toast({
        title: "Vote Failed",
        description: err.message,
        variant: "destructive",
      });
    }
    setVoting(null);
  };

  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  // Calculate total votes for each poll
  const getTotalVotes = (nominations: any[]) =>
    nominations.reduce((sum, n) => sum + (n.totalVotes || 0), 0);

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  // Show loading while checking authentication
  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-valley-green mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated (this shouldn't show due to useEffect, but keep as fallback)
  if (!student) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-valley-blue to-valley-green py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="text-center md:text-left flex-1 mb-6 md:mb-0">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6">
                    <Vote className="w-8 h-8" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Student Voting Platform
                  </h1>
                  <p className="text-xl text-white/90">
                    Welcome, {student?.studentName}! Participate in school
                    elections and make your voice heard.
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-end space-y-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center md:text-right">
                    <p className="text-sm text-white/90">Logged in as:</p>
                    <p className="font-semibold text-lg">
                      {student?.studentName}
                    </p>
                    <p className="text-xs text-white/80">
                      ID: {student?.studentId}
                    </p>
                  </div>
                  <Button
                    onClick={handleLogout}
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-valley-green font-bold px-6 py-3 shadow-lg transition-all duration-200 hover:shadow-xl"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    <span className="font-bold">Logout</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Voting Stats */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Active Polls */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-valley-green mb-8">
                Active Polls
              </h2>
              <div className="space-y-8">
                {loading ? (
                  <p>Loading polls...</p>
                ) : polls.length === 0 ? (
                  <p>No active polls found.</p>
                ) : (
                  polls.map((poll) => (
                    <Card key={poll.id} className="overflow-hidden">
                      <CardHeader className="bg-valley-green/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl text-valley-green">
                              {poll.category}
                            </CardTitle>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant="outline"
                              className="border-valley-green text-valley-green"
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {/* No end date for now */}
                              Ongoing
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              {getTotalVotes(poll.nominations)} votes cast
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {poll.nominations && poll.nominations.length > 0 ? (
                            poll.nominations.map((nom: any, idx: number) => (
                              <div key={idx} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    {nom.profileImageUrl && (
                                      <img
                                        src={nom.profileImageUrl}
                                        alt={nom.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                      />
                                    )}
                                    <div>
                                      <h4 className="font-semibold text-lg">
                                        {nom.name}
                                      </h4>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-valley-green">
                                      {getVotePercentage(
                                        nom.totalVotes || 0,
                                        getTotalVotes(poll.nominations)
                                      )}
                                      %
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {nom.totalVotes || 0} votes
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Progress
                                    value={getVotePercentage(
                                      nom.totalVotes || 0,
                                      getTotalVotes(poll.nominations)
                                    )}
                                    className="h-2"
                                  />
                                  <div className="flex justify-end">
                                    <Button
                                      onClick={() => handleVote(poll.id, idx)}
                                      disabled={
                                        hasVoted[poll.id] || voting === poll.id
                                      }
                                      size="sm"
                                      className="bg-valley-green hover:bg-valley-green-dark"
                                    >
                                      {hasVoted[poll.id]
                                        ? "Vote Cast"
                                        : voting === poll.id
                                        ? "Voting..."
                                        : "Vote"}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground">
                              No nominees yet.
                            </p>
                          )}
                        </div>
                        {hasVoted[poll.id] && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center text-green-700">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              <span className="text-sm font-medium">
                                Your vote has been recorded successfully!
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
            {/* Completed Elections (not implemented for Firestore polls) */}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Voting;
