
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User, BookOpen, Calendar, MessageSquare, FileText, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const StudentPortal = () => {
  const quickLinks = [
    { title: 'My Grades', icon: Award, description: 'View current grades and progress reports' },
    { title: 'Assignments', icon: FileText, description: 'Check homework and project deadlines' },
    { title: 'Class Schedule', icon: Calendar, description: 'View your daily and weekly schedule' },
    { title: 'Messages', icon: MessageSquare, description: 'Communicate with teachers and staff' },
    { title: 'Library Resources', icon: BookOpen, description: 'Access digital library and resources' },
    { title: 'Profile Settings', icon: User, description: 'Update your personal information' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-valley-green to-valley-blue py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Student Portal</h1>
              <p className="text-xl text-white/90">
                Access your academic information, assignments, and school resources all in one place.
              </p>
            </div>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-valley-green mb-4">Welcome back, Student!</h2>
              <p className="text-muted-foreground mb-6">
                Here's your personalized dashboard with quick access to everything you need for your academic journey.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-valley-green/10 rounded-lg">
                  <div className="text-2xl font-bold text-valley-green">4.2</div>
                  <div className="text-sm text-muted-foreground">Current GPA</div>
                </div>
                <div className="text-center p-4 bg-valley-blue/10 rounded-lg">
                  <div className="text-2xl font-bold text-valley-blue">3</div>
                  <div className="text-sm text-muted-foreground">Pending Assignments</div>
                </div>
                <div className="text-center p-4 bg-valley-gold/10 rounded-lg">
                  <div className="text-2xl font-bold text-valley-gold">98%</div>
                  <div className="text-sm text-muted-foreground">Attendance Rate</div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickLinks.map((link, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-valley-green/10 rounded-lg flex items-center justify-center">
                        <link.icon className="w-6 h-6 text-valley-green" />
                      </div>
                      <CardTitle className="text-lg">{link.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{link.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Access
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StudentPortal;
