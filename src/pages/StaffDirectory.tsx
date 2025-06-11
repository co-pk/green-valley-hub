
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const StaffDirectory = () => {
  const departments = [
    {
      name: 'Administration',
      staff: [
        { name: 'Dr. Mark Thompson', position: 'Principal', email: 'principal@greenvalley.edu', phone: '(555) 123-4567', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
        { name: 'Dr. Sarah Johnson', position: 'Vice Principal', email: 'vice.principal@greenvalley.edu', phone: '(555) 123-4568', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b172?w=150&h=150&fit=crop&crop=face' },
        { name: 'Ms. Rachel Martinez', position: 'Registrar', email: 'registrar@greenvalley.edu', phone: '(555) 123-4569', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' }
      ]
    },
    {
      name: 'Academic Staff',
      staff: [
        { name: 'Ms. Emily Chen', position: 'English Department Head', email: 'e.chen@greenvalley.edu', phone: '(555) 123-4570', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face' },
        { name: 'Dr. Robert Martinez', position: 'Math Department Head', email: 'r.martinez@greenvalley.edu', phone: '(555) 123-4571', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
        { name: 'Dr. Michelle Adams', position: 'Science Department Head', email: 'm.adams@greenvalley.edu', phone: '(555) 123-4572', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face' }
      ]
    },
    {
      name: 'Support Staff',
      staff: [
        { name: 'Mr. James Wilson', position: 'Librarian', email: 'librarian@greenvalley.edu', phone: '(555) 123-4573', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
        { name: 'Ms. Lisa Park', position: 'School Counselor', email: 'counselor@greenvalley.edu', phone: '(555) 123-4574', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face' },
        { name: 'Mr. David Brown', position: 'IT Coordinator', email: 'it@greenvalley.edu', phone: '(555) 123-4575', image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-valley-green to-valley-blue py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Staff Directory</h1>
              <p className="text-xl text-white/90">
                Connect with our dedicated faculty and staff members.
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search staff by name or department..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Staff Directory */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {departments.map((department, deptIndex) => (
              <div key={deptIndex} className="mb-12">
                <h2 className="text-3xl font-bold text-valley-green mb-8 text-center">{department.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {department.staff.map((member, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="text-center pb-4">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardTitle className="text-lg text-valley-green">{member.name}</CardTitle>
                        <p className="text-sm text-valley-blue font-medium">{member.position}</p>
                      </CardHeader>
                      <CardContent className="text-center space-y-3">
                        <div className="flex items-center justify-center text-sm text-muted-foreground">
                          <Mail className="w-4 h-4 mr-2" />
                          <a href={`mailto:${member.email}`} className="hover:text-valley-green">
                            {member.email}
                          </a>
                        </div>
                        <div className="flex items-center justify-center text-sm text-muted-foreground">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{member.phone}</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4">
                          Contact
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StaffDirectory;
