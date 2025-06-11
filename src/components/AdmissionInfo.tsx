
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdmissionInfo = () => {
  return (
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
  );
};

export default AdmissionInfo;
