
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      details: ['123 Education Drive', 'Green Valley, CA 94025', 'United States']
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['Main Office: (555) 123-4567', 'Admissions: (555) 123-4568', 'Emergency: (555) 123-4569']
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@greenvalley.edu', 'admissions@greenvalley.edu', 'principal@greenvalley.edu']
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: ['Monday - Friday: 7:30 AM - 5:00 PM', 'Saturday: 9:00 AM - 2:00 PM', 'Sunday: Closed']
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-valley-green">Get in Touch</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're here to answer your questions and help you learn more about Green Valley School. 
            Contact us today to schedule a visit or get more information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 mx-auto mb-4 bg-valley-green rounded-full flex items-center justify-center">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-valley-green">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-muted-foreground text-sm mb-1">
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Contact */}
            <Card className="bg-gradient-to-r from-valley-green to-valley-blue text-white">
              <CardHeader>
                <CardTitle className="text-2xl">Schedule a Campus Tour</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-white/90">
                  Experience our campus firsthand and meet our dedicated staff. Tours available Monday through Friday.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="tel:(555)123-4567" 
                    className="bg-white text-valley-green px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-100 transition-colors"
                  >
                    Call to Schedule
                  </a>
                  <a 
                    href="mailto:tours@greenvalley.edu" 
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-white hover:text-valley-green transition-colors"
                  >
                    Email Request
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map and Directions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-valley-green">Campus Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Interactive Map</p>
                    <p className="text-sm">123 Education Drive, Green Valley, CA</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Directions</h4>
                    <p className="text-sm text-muted-foreground">
                      From Highway 101: Take Exit 15 toward Green Valley. Turn left on Education Drive. 
                      The school will be on your right after 0.5 miles.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Parking</h4>
                    <p className="text-sm text-muted-foreground">
                      Visitor parking is available in the main lot. Please check in at the office upon arrival.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-valley-green">Transportation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">School Bus Service</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    We provide bus transportation to various neighborhoods. Routes include:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Downtown Green Valley</li>
                    <li>• Hillside Estates</li>
                    <li>• Meadowbrook</li>
                    <li>• Sunset Hills</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Alternative Transportation</h4>
                  <p className="text-sm text-muted-foreground">
                    Bike racks available. Walking groups organized for nearby neighborhoods.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
