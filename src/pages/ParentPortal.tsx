
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, Calendar, MessageSquare, FileText, CreditCard, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ParentPortal = () => {
  const quickLinks = [
    { title: 'Student Progress', icon: FileText, description: 'Monitor your child\'s academic performance' },
    { title: 'Attendance Records', icon: Users, description: 'View attendance history and reports' },
    { title: 'School Calendar', icon: Calendar, description: 'Stay updated with school events and holidays' },
    { title: 'Teacher Communication', icon: MessageSquare, description: 'Connect with teachers and staff' },
    { title: 'Fee Payments', icon: CreditCard, description: 'Manage tuition and fee payments online' },
    { title: 'Notifications', icon: Bell, description: 'Receive important school announcements' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-valley-blue to-valley-green py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Parent Portal</h1>
              <p className="text-xl text-white/90">
                Stay connected with your child's education and school community.
              </p>
            </div>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-valley-green mb-4">Welcome, Parent!</h2>
              <p className="text-muted-foreground mb-6">
                Access all the tools you need to support your child's educational journey and stay informed about school activities.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-valley-green/10 rounded-lg">
                  <div className="text-2xl font-bold text-valley-green">2</div>
                  <div className="text-sm text-muted-foreground">Children Enrolled</div>
                </div>
                <div className="text-center p-4 bg-valley-blue/10 rounded-lg">
                  <div className="text-2xl font-bold text-valley-blue">5</div>
                  <div className="text-sm text-muted-foreground">Unread Messages</div>
                </div>
                <div className="text-center p-4 bg-valley-gold/10 rounded-lg">
                  <div className="text-2xl font-bold text-valley-gold">$0</div>
                  <div className="text-sm text-muted-foreground">Outstanding Balance</div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickLinks.map((link, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-valley-blue/10 rounded-lg flex items-center justify-center">
                        <link.icon className="w-6 h-6 text-valley-blue" />
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

export default ParentPortal;
