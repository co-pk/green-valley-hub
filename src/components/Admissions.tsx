
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AdmissionSteps from './AdmissionSteps';
import QuickInquiryForm from './QuickInquiryForm';
import AdmissionInfo from './AdmissionInfo';

const Admissions = () => {
  return (
    <section id="admissions" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-valley-green">Join Our Community</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Begin your child's journey to academic excellence. Learn about our admission process 
            and take the first step toward a brighter future.
          </p>
          <Button asChild className="bg-valley-green hover:bg-valley-green-dark text-lg px-8 py-3">
            <Link to="/apply">
              <Send className="w-5 h-5 mr-2" />
              Start Full Application
            </Link>
          </Button>
        </div>

        <AdmissionSteps />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <QuickInquiryForm />
          <AdmissionInfo />
        </div>
      </div>
    </section>
  );
};

export default Admissions;
