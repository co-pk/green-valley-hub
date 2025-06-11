
import { Calendar, FileText, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdmissionSteps = () => {
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

  return (
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
  );
};

export default AdmissionSteps;
