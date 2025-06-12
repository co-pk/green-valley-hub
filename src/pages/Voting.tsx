
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Vote, Users, Calendar, CheckCircle, Clock, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';

const Voting = () => {
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});

  const activeElections = [
    {
      id: 'student-council-2024',
      title: 'Student Council President 2024',
      description: 'Choose your next Student Council President',
      endDate: '2024-03-15',
      totalVotes: 847,
      status: 'active',
      candidates: [
        { id: 1, name: 'Sarah Johnson', grade: '12th Grade', votes: 324, platform: 'Improving school facilities and student activities' },
        { id: 2, name: 'Michael Chen', grade: '11th Grade', votes: 298, platform: 'Enhanced digital learning resources and environment' },
        { id: 3, name: 'Emma Rodriguez', grade: '12th Grade', votes: 225, platform: 'Stronger community outreach and volunteer programs' }
      ]
    },
    {
      id: 'class-rep-2024',
      title: 'Class Representative Elections',
      description: 'Vote for your grade level representatives',
      endDate: '2024-03-20',
      totalVotes: 623,
      status: 'active',
      candidates: [
        { id: 4, name: 'James Wilson', grade: '10th Grade Rep', votes: 156, platform: 'Better cafeteria options and study spaces' },
        { id: 5, name: 'Lily Zhang', grade: '9th Grade Rep', votes: 234, platform: 'More extracurricular activities and clubs' },
        { id: 6, name: 'Alex Thompson', grade: '11th Grade Rep', votes: 233, platform: 'Improved technology and WiFi access' }
      ]
    }
  ];

  const completedElections = [
    {
      id: 'spirit-week-theme',
      title: 'Spirit Week Theme 2024',
      description: 'Decade theme voting',
      winner: '80s Retro Theme',
      totalVotes: 1245,
      completedDate: '2024-02-28'
    }
  ];

  const handleVote = (electionId: string, candidateId: number) => {
    setHasVoted(prev => ({ ...prev, [electionId]: true }));
    // In a real application, this would send the vote to a backend
    console.log(`Voted for candidate ${candidateId} in election ${electionId}`);
  };

  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-valley-blue to-valley-green py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Vote className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Student Voting Platform</h1>
              <p className="text-xl text-white/90">
                Participate in school elections and make your voice heard in shaping our school community.
              </p>
            </div>
          </div>
        </section>

        {/* Voting Stats */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <Users className="w-8 h-8 text-valley-blue mx-auto mb-3" />
                <div className="text-2xl font-bold text-valley-blue">1,247</div>
                <div className="text-sm text-muted-foreground">Registered Voters</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <Vote className="w-8 h-8 text-valley-green mx-auto mb-3" />
                <div className="text-2xl font-bold text-valley-green">2</div>
                <div className="text-sm text-muted-foreground">Active Elections</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <CheckCircle className="w-8 h-8 text-valley-gold mx-auto mb-3" />
                <div className="text-2xl font-bold text-valley-gold">847</div>
                <div className="text-sm text-muted-foreground">Votes Cast Today</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <Trophy className="w-8 h-8 text-valley-green mx-auto mb-3" />
                <div className="text-2xl font-bold text-valley-green">68%</div>
                <div className="text-sm text-muted-foreground">Participation Rate</div>
              </div>
            </div>

            {/* Active Elections */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-valley-green mb-8">Active Elections</h2>
              <div className="space-y-8">
                {activeElections.map((election) => (
                  <Card key={election.id} className="overflow-hidden">
                    <CardHeader className="bg-valley-green/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl text-valley-green">{election.title}</CardTitle>
                          <p className="text-muted-foreground mt-1">{election.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="border-valley-green text-valley-green">
                            <Clock className="w-3 h-3 mr-1" />
                            Ends {election.endDate}
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            {election.totalVotes} votes cast
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {election.candidates.map((candidate) => (
                          <div key={candidate.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-lg">{candidate.name}</h4>
                                <p className="text-sm text-valley-blue">{candidate.grade}</p>
                                <p className="text-sm text-muted-foreground mt-1">{candidate.platform}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-valley-green">
                                  {getVotePercentage(candidate.votes, election.totalVotes)}%
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {candidate.votes} votes
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Progress 
                                value={getVotePercentage(candidate.votes, election.totalVotes)} 
                                className="h-2"
                              />
                              <div className="flex justify-end">
                                <Button
                                  onClick={() => handleVote(election.id, candidate.id)}
                                  disabled={hasVoted[election.id]}
                                  size="sm"
                                  className="bg-valley-green hover:bg-valley-green-dark"
                                >
                                  {hasVoted[election.id] ? 'Vote Cast' : 'Vote'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {hasVoted[election.id] && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center text-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Your vote has been recorded successfully!</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Completed Elections */}
            <div>
              <h2 className="text-3xl font-bold text-valley-green mb-8">Recent Results</h2>
              <div className="space-y-4">
                {completedElections.map((election) => (
                  <Card key={election.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{election.title}</h4>
                          <p className="text-muted-foreground">{election.description}</p>
                          <div className="flex items-center mt-2 text-sm text-valley-green">
                            <Trophy className="w-4 h-4 mr-1" />
                            Winner: {election.winner}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">Completed</Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            {election.totalVotes} total votes
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Ended {election.completedDate}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Voting;
