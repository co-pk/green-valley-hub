
import { Mail, Phone, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const Staff = () => {
  const leadership = [
    {
      name: 'Dr. Mark Thompson',
      position: 'Principal',
      education: 'Ed.D. Educational Leadership',
      experience: '15 years in education',
      email: 'principal@greenvalley.edu',
      phone: '(555) 123-4567',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'Dr. Sarah Johnson',
      position: 'Vice Principal',
      education: 'Ph.D. Educational Psychology',
      experience: '12 years in administration',
      email: 'vice.principal@greenvalley.edu',
      phone: '(555) 123-4568',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b172?w=300&h=300&fit=crop&crop=face'
    }
  ];

  const departments = [
    {
      name: 'English Department',
      head: 'Ms. Emily Chen',
      faculty: [
        { name: 'Ms. Emily Chen', subject: 'English Literature', experience: '10 years' },
        { name: 'Mr. David Wilson', subject: 'Creative Writing', experience: '8 years' },
        { name: 'Ms. Jennifer Lee', subject: 'English Language', experience: '6 years' }
      ]
    },
    {
      name: 'Mathematics Department',
      head: 'Dr. Robert Martinez',
      faculty: [
        { name: 'Dr. Robert Martinez', subject: 'Advanced Mathematics', experience: '15 years' },
        { name: 'Ms. Lisa Park', subject: 'Algebra & Geometry', experience: '9 years' },
        { name: 'Mr. James Brown', subject: 'Statistics', experience: '7 years' }
      ]
    },
    {
      name: 'Science Department',
      head: 'Dr. Michelle Adams',
      faculty: [
        { name: 'Dr. Michelle Adams', subject: 'Biology & Chemistry', experience: '12 years' },
        { name: 'Mr. Kevin Zhang', subject: 'Physics', experience: '8 years' },
        { name: 'Ms. Amanda Taylor', subject: 'Environmental Science', experience: '6 years' }
      ]
    },
    {
      name: 'Arts Department',
      head: 'Ms. Patricia Williams',
      faculty: [
        { name: 'Ms. Patricia Williams', subject: 'Visual Arts', experience: '11 years' },
        { name: 'Mr. Michael Davis', subject: 'Music', experience: '9 years' },
        { name: 'Ms. Rachel Green', subject: 'Drama & Theater', experience: '7 years' }
      ]
    }
  ];

  return (
    <section id="staff" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-valley-green">Our Dedicated Team</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet our exceptional faculty and staff who are committed to providing the highest quality 
            education and support for our students.
          </p>
        </div>

        {/* Leadership Team */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-valley-green">Leadership Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leadership.map((leader, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <img 
                      src={leader.image} 
                      alt={leader.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-2xl font-bold text-valley-green">{leader.name}</h4>
                  <p className="text-lg font-semibold text-valley-blue">{leader.position}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      <span>{leader.education}</span>
                    </div>
                    <p>{leader.experience}</p>
                    <div className="flex items-center justify-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <a href={`mailto:${leader.email}`} className="text-valley-green hover:underline">
                        {leader.email}
                      </a>
                    </div>
                    <div className="flex items-center justify-center">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{leader.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Department Faculty */}
        <div>
          <h3 className="text-3xl font-bold text-center mb-8 text-valley-green">Department Faculty</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {departments.map((dept, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <h4 className="text-xl font-bold text-valley-green">{dept.name}</h4>
                  <p className="text-sm text-valley-blue">Department Head: {dept.head}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dept.faculty.map((member, memberIndex) => (
                      <div key={memberIndex} className="border-l-4 border-valley-green/30 pl-4">
                        <h5 className="font-semibold">{member.name}</h5>
                        <p className="text-sm text-muted-foreground">{member.subject}</p>
                        <p className="text-xs text-muted-foreground">{member.experience}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-valley-green to-valley-blue rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">Connect with Our Team</h3>
            <p className="text-lg mb-6 text-white/90">
              Have questions or want to learn more about our programs? Our dedicated staff is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:info@greenvalley.edu" className="bg-white text-valley-green px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Email Us
              </a>
              <a href="tel:(555)123-4567" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-valley-green transition-colors">
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Staff;
