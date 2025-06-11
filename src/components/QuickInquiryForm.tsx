
import { useState } from 'react';
import { Send, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const QuickInquiryForm = () => {
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
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-2xl text-valley-green">Quick Inquiry Form</CardTitle>
        <p className="text-muted-foreground">
          Get started with basic information, or proceed to our full application form.
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

          <div className="space-y-3">
            <Button type="submit" className="w-full bg-valley-green hover:bg-valley-green-dark">
              <Send className="w-4 h-4 mr-2" />
              Submit Quick Inquiry
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/apply">
                <FileText className="w-4 h-4 mr-2" />
                Complete Full Application
              </Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuickInquiryForm;
