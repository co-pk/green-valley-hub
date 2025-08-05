import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  User,
  BookOpen,
  Calendar,
  MessageSquare,
  FileText,
  Award,
  LogOut,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useStudentStore } from "@/store/student.store";

const ADMISSION_DECISION_KEY = "gv_admission_decision";

const StudentPortal = () => {
  const { student, setStudent, clearStudent } = useStudentStore();
  const [showAdmission, setShowAdmission] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!student) {
      navigate("/student-login");
    }
  }, [navigate, student]);

  useEffect(() => {
    // Only show the admission message if not previously accepted/declined
    const decision = localStorage.getItem(ADMISSION_DECISION_KEY);
    if (!decision) {
      setShowAdmission(true);
    }
  }, [student]);

  const handleLogout = () => {
    clearStudent();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/student-login");
  };

  const handleAdmissionDecision = (decision: "accepted" | "declined") => {
    localStorage.setItem(ADMISSION_DECISION_KEY, decision);
    setShowAdmission(false);
    if (decision === "accepted") {
      toast({
        title: "Congratulations!",
        description:
          "You have accepted your admission. Welcome to Green Valley School!",
      });
    } else {
      toast({
        title: "Admission Declined",
        description:
          "You have declined your admission. If this was a mistake, please contact the school.",
        variant: "destructive",
      });
    }
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

  const quickLinks = [
    {
      title: "My Grades",
      icon: Award,
      description: "View current grades and progress reports",
    },
    {
      title: "Assignments",
      icon: FileText,
      description: "Check homework and project deadlines",
    },
    {
      title: "Class Schedule",
      icon: Calendar,
      description: "View your daily and weekly schedule",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      description: "Communicate with teachers and staff",
    },
    {
      title: "Library Resources",
      icon: BookOpen,
      description: "Access digital library and resources",
    },
    {
      title: "Profile Settings",
      icon: User,
      description: "Update your personal information",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-valley-green to-valley-blue py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="text-center md:text-left flex-1 mb-6 md:mb-0">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Student Portal
                  </h1>
                  <p className="text-xl text-white/90">
                    Welcome back, {student.studentName}! Access your academic
                    information and school resources.
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-end space-y-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center md:text-right">
                    <p className="text-sm text-white/90">Logged in as:</p>
                    <p className="font-semibold text-lg">
                      {student.studentName}
                    </p>
                    <p className="text-xs text-white/80">
                      ID: {student.studentId}
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

        {/* Admission Congratulations Modal/Message */}
        {showAdmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 text-center border-2 border-valley-green">
              <h2 className="text-2xl font-bold text-valley-green mb-4">
                Congratulations, {student.studentName}!
              </h2>
              <p className="mb-4 text-gray-700">
                We are thrilled to inform you that you have been{" "}
                <span className="font-semibold text-valley-green">
                  granted admission
                </span>{" "}
                to Green Valley School.
              </p>
              <p className="mb-6 text-gray-600">
                Please confirm your decision below. Once you accept or decline,
                this message will not appear again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="w-full sm:w-auto bg-valley-green text-white font-bold hover:bg-valley-green/90"
                  onClick={() => handleAdmissionDecision("accepted")}
                >
                  Accept Admission
                </Button>
                <Button
                  className="w-full sm:w-auto bg-red-500 text-white font-bold hover:bg-red-600"
                  onClick={() => handleAdmissionDecision("declined")}
                  variant="destructive"
                >
                  Decline Admission
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-valley-green mb-4">
                Welcome back, {student.studentName}!
              </h2>
              <p className="text-muted-foreground mb-6">
                Here's your personalized dashboard with quick access to
                everything you need for your academic journey.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-valley-green/10 rounded-lg">
                  <div className="text-2xl font-bold text-valley-green">
                    4.2
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Current GPA
                  </div>
                </div>
                <div className="text-center p-4 bg-valley-blue/10 rounded-lg">
                  <div className="text-2xl font-bold text-valley-blue">3</div>
                  <div className="text-sm text-muted-foreground">
                    Pending Assignments
                  </div>
                </div>
                <div className="text-center p-4 bg-valley-gold/10 rounded-lg">
                  <div className="text-2xl font-bold text-valley-gold">98%</div>
                  <div className="text-sm text-muted-foreground">
                    Attendance Rate
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
                      <div className="w-12 h-12 bg-valley-green/10 rounded-lg flex items-center justify-center">
                        <link.icon className="w-6 h-6 text-valley-green" />
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

export default StudentPortal;
