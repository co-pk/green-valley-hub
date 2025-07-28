import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Users,
  Calendar,
  MessageSquare,
  FileText,
  CreditCard,
  Bell,
  LogOut,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useParentStore } from "@/store/parent.store";

const ParentPortal = () => {
  const navigate = useNavigate();
  const { clearParent } = useParentStore();
  const { parent } = useParentStore();

  useEffect(() => {
    if (!parent) {
      navigate("/parent-login");
    }
  }, [parent, navigate]);

  const handleLogout = () => {
    // logout();
    clearParent();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/parent-login");
  };

  const quickLinks = [
    {
      title: "Student Progress",
      icon: FileText,
      description: "Monitor your child's academic performance",
    },
    {
      title: "Attendance Records",
      icon: Users,
      description: "View attendance history and reports",
    },
    {
      title: "School Calendar",
      icon: Calendar,
      description: "Stay updated with school events and holidays",
    },
    {
      title: "Teacher Communication",
      icon: MessageSquare,
      description: "Connect with teachers and staff",
    },
    {
      title: "Fee Payments",
      icon: CreditCard,
      description: "Manage tuition and fee payments online",
    },
    {
      title: "Notifications",
      icon: Bell,
      description: "Receive important school announcements",
    },
  ];

  // if (!parent) {
  //   return <div>Loading...</div>;
  // }

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
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Parent Portal
                  </h1>
                  <p className="text-xl text-white/90">
                    Welcome back, {parent?.parentName}! Stay connected with your
                    children's education.
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-end space-y-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center md:text-right">
                    <p className="text-sm text-white/90">Logged in as:</p>
                    <p className="font-semibold text-lg">
                      {parent?.parentName}
                    </p>
                    <p className="text-xs text-white/80">
                      ID: {parent?.parentId}
                    </p>
                    <p className="text-xs text-white/80">
                      Children: {parent.child}
                    </p>
                  </div>
                  <Button
                    onClick={handleLogout}
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-valley-blue font-bold px-6 py-3 shadow-lg transition-all duration-200 hover:shadow-xl"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    <span className="font-bold">Logout</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-valley-green mb-4">
                Welcome, {parent.parentName}!
              </h2>
              <p className="text-muted-foreground mb-6">
                Access all the tools you need to support your children's
                educational journey and stay informed about school activities.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-valley-green/10 rounded-lg">
                  <div className="text-2xl font-bold text-valley-green">
                    {parent.child}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Children Enrolled
                  </div>
                </div>
                <div className="text-center p-4 bg-valley-blue/10 rounded-lg">
                  <div className="text-2xl font-bold text-valley-blue">5</div>
                  <div className="text-sm text-muted-foreground">
                    Unread Messages
                  </div>
                </div>
                <div className="text-center p-4 bg-valley-gold/10 rounded-lg">
                  <div className="text-2xl font-bold text-valley-gold">$0</div>
                  <div className="text-sm text-muted-foreground">
                    Outstanding Balance
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickLinks.map((link, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-valley-blue/10 rounded-lg flex items-center justify-center">
                        <link.icon className="w-6 h-6 text-valley-blue" />
                      </div>
                      <CardTitle className="text-lg">{link.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">
                      {link.description}
                    </p>
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
