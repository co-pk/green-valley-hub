
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar as CalendarIcon, Clock, MapPin, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const upcomingEvents = [
    {
      title: 'Science Fair',
      date: 'March 15, 2024',
      time: '9:00 AM - 3:00 PM',
      location: 'Main Auditorium',
      category: 'Academic',
      description: 'Students showcase their scientific research projects.'
    },
    {
      title: 'Parent-Teacher Conference',
      date: 'March 18, 2024',
      time: '6:00 PM - 8:00 PM',
      location: 'Individual Classrooms',
      category: 'Meeting',
      description: 'Quarterly parent-teacher meetings to discuss student progress.'
    },
    {
      title: 'Spring Break',
      date: 'March 25 - April 1, 2024',
      time: 'All Day',
      location: 'School Closed',
      category: 'Holiday',
      description: 'School will be closed for spring break vacation.'
    },
    {
      title: 'Drama Club Performance',
      date: 'April 5, 2024',
      time: '7:00 PM - 9:00 PM',
      location: 'School Theater',
      category: 'Arts',
      description: 'Annual spring drama production by our talented students.'
    }
  ];

  const eventCategories = ['All', 'Academic', 'Arts', 'Sports', 'Meeting', 'Holiday'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-valley-green to-valley-blue py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">School Calendar</h1>
              <p className="text-xl text-white/90">
                Stay updated with all school events, holidays, and important dates.
              </p>
            </div>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar Widget */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-valley-green">
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>

                {/* Event Categories Filter */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center text-valley-green">
                      <Filter className="w-5 h-5 mr-2" />
                      Filter Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {eventCategories.map((category, index) => (
                        <Button
                          key={index}
                          variant={index === 0 ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Events List */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-valley-green mb-4">Upcoming Events</h2>
                  <p className="text-muted-foreground">
                    Don't miss these important school events and activities.
                  </p>
                </div>

                <div className="space-y-6">
                  {upcomingEvents.map((event, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl text-valley-green">{event.title}</CardTitle>
                            <div className="flex items-center text-muted-foreground mt-2">
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              <span className="mr-4">{event.date}</span>
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{event.time}</span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            event.category === 'Academic' ? 'bg-valley-green/10 text-valley-green' :
                            event.category === 'Arts' ? 'bg-valley-blue/10 text-valley-blue' :
                            event.category === 'Holiday' ? 'bg-valley-gold/10 text-valley-gold' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {event.category}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <p className="text-muted-foreground">{event.description}</p>
                        <Button variant="outline" size="sm" className="mt-4">
                          Add to Calendar
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Calendar;
