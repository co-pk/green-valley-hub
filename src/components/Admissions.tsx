
import { useState } from 'react';
import { Calendar, FileText, Users, CheckCircle, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Admissions = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    grade: '',
    previousSchool: '',
    message: ''
  });

  const admissionSteps = [
    {
      icon: FileText,
      title: 'Submit Application',
      description: 'Complete and submit our online application form with required documents.'
    },
    {
      icon: Calendar,
      title: 'Schedule Interview',
      description: 'Arrange a meeting with our admissions team and take a campus tour.'
    },
    {
      icon: Users,
      title: 'Assessment',
      description: 'Student assessment and parent-student-school fit evaluation.'
    },
    {
      icon: CheckCircle,
      title: 'Enrollment',
      description: 'Receive admission decision and complete enrollment process.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Admission form submitted:', formData);
    toast({
      title: "Application Submitted!",
      description: "Thank you for your interest. We'll contact you within 2-3 business days.",
    });
    setFormData({
      studentName: '',
      parentName: '',
      email: '',
      phone: '',
      grade: '',
      previousSchool: '',
      message: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="admissions" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-valley-green">Join Our Community</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Begin your child's journey to academic excellence. Learn about our admission process 
            and take the first step toward a brighter future.
          </p>
        </div>

        {/* Admission Process */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-valley-green">Admission Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {admissionSteps.map((step, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow relative">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-valley-green to-valley-blue rounded-full flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-valley-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <CardTitle className="text-lg text-valley-green">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Application Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-2xl text-valley-green">Application Form</CardTitle>
              <p className="text-muted-foreground">
                Start your application process by providing basic information below.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentName">Student Name *</Label>
                    <Input
                      id="studentName"
                      value={formData.studentName}
                      onChange={(e) => handleInputChange('studentName', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                    <Input
                      id="parentName"
                      value={formData.parentName}
                      onChange={(e) => handleInputChange('parentName', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grade">Grade Level *</Label>
                    <Select value={formData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select grade level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kindergarten">Kindergarten</SelectItem>
                        <SelectItem value="1st">1st Grade</SelectItem>
                        <SelectItem value="2nd">2nd Grade</SelectItem>
                        <SelectItem value="3rd">3rd Grade</SelectItem>
                        <SelectItem value="4th">4th Grade</SelectItem>
                        <SelectItem value="5th">5th Grade</SelectItem>
                        <SelectItem value="6th">6th Grade</SelectItem>
                        <SelectItem value="7th">7th Grade</SelectItem>
                        <SelectItem value="8th">8th Grade</SelectItem>
                        <SelectItem value="9th">9th Grade</SelectItem>
                        <SelectItem value="10th">10th Grade</SelectItem>
                        <SelectItem value="11th">11th Grade</SelectItem>
                        <SelectItem value="12th">12th Grade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="previousSchool">Previous School</Label>
                    <Input
                      id="previousSchool"
                      value={formData.previousSchool}
                      onChange={(e) => handleInputChange('previousSchool', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Additional Information</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="mt-1"
                    rows={4}
                    placeholder="Tell us about your child's interests, special needs, or any questions you have..."
                  />
                </div>

                <Button type="submit" className="w-full bg-valley-green hover:bg-valley-green-dark">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Admission Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-valley-green">Admission Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Required Documents:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                    <li>• Completed application form</li>
                    <li>• Birth certificate or passport</li>
                    <li>• Previous school transcripts</li>
                    <li>• Immunization records</li>
                    <li>• Two recommendation letters</li>
                    <li>• Recent passport-size photographs</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Age Requirements:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                    <li>• Kindergarten: 5 years by September 1st</li>
                    <li>• Elementary: Ages 6-11</li>
                    <li>• Middle School: Ages 12-14</li>
                    <li>• High School: Ages 15-18</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-valley-green">Tuition & Fees</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Elementary (K-5)</span>
                    <span className="font-semibold">$12,000/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Middle School (6-8)</span>
                    <span className="font-semibold">$14,000/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span>High School (9-12)</span>
                    <span className="font-semibold">$16,000/year</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span>Application Fee</span>
                      <span className="font-semibold">$100</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Financial aid and scholarships available. Payment plans offered.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-valley-green">Important Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Application Opens</span>
                  <span className="font-semibold">November 1</span>
                </div>
                <div className="flex justify-between">
                  <span>Application Deadline</span>
                  <span className="font-semibold">March 15</span>
                </div>
                <div className="flex justify-between">
                  <span>Admission Decisions</span>
                  <span className="font-semibold">April 15</span>
                </div>
                <div className="flex justify-between">
                  <span>Enrollment Deadline</span>
                  <span className="font-semibold">May 1</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Admissions;
