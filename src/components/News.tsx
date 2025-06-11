
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const News = () => {
  const news = [
    {
      id: 1,
      title: 'Green Valley Students Win Regional Science Fair',
      excerpt: 'Our talented students took first place in the regional science competition with their innovative environmental project.',
      date: 'December 8, 2024',
      author: 'Dr. Sarah Johnson',
      category: 'Achievement',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      title: 'New STEM Laboratory Opens',
      excerpt: 'State-of-the-art STEM facility now open, featuring advanced equipment and collaborative learning spaces.',
      date: 'December 5, 2024',
      author: 'Principal Mark Thompson',
      category: 'Facilities',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      title: 'Annual Arts Showcase This Friday',
      excerpt: 'Join us for an evening celebrating student creativity with performances, exhibitions, and awards ceremony.',
      date: 'December 2, 2024',
      author: 'Ms. Emily Chen',
      category: 'Event',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=250&fit=crop'
    },
    {
      id: 4,
      title: 'Summer Programs Registration Open',
      excerpt: 'Early registration now available for our summer enrichment programs including STEM camps and language immersion.',
      date: 'November 28, 2024',
      author: 'Ms. Patricia Williams',
      category: 'Programs',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop'
    }
  ];

  const announcements = [
    { title: 'Holiday Break: December 20 - January 8', date: 'December 10, 2024' },
    { title: 'Parent-Teacher Conferences', date: 'December 15, 2024' },
    { title: 'Winter Concert Performance', date: 'December 18, 2024' },
    { title: 'Report Cards Available Online', date: 'December 22, 2024' }
  ];

  return (
    <section id="news" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-valley-green">Latest News & Events</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay updated with the latest happenings, achievements, and upcoming events at Green Valley School.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main News Section */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {news.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span className="bg-valley-green/10 text-valley-green px-2 py-1 rounded text-xs font-medium">
                        {article.category}
                      </span>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {article.date}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-valley-green leading-tight">{article.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="w-4 h-4 mr-1" />
                        {article.author}
                      </div>
                      <Button variant="ghost" size="sm" className="text-valley-green hover:text-valley-green-dark">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Announcements Sidebar */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <h3 className="text-2xl font-bold text-valley-green">Quick Announcements</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {announcements.map((announcement, index) => (
                  <div key={index} className="border-l-4 border-valley-green pl-4 py-2">
                    <h4 className="font-semibold text-sm leading-tight">{announcement.title}</h4>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      {announcement.date}
                    </p>
                  </div>
                ))}
                <Button className="w-full mt-6 bg-valley-green hover:bg-valley-green-dark">
                  View All Announcements
                </Button>
              </CardContent>
            </Card>

            {/* Calendar Widget */}
            <Card className="mt-6">
              <CardHeader>
                <h3 className="text-xl font-bold text-valley-green">Upcoming Events</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Winter Concert</span>
                    <span className="text-valley-green font-medium">Dec 18</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Holiday Break Starts</span>
                    <span className="text-valley-green font-medium">Dec 20</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Classes Resume</span>
                    <span className="text-valley-green font-medium">Jan 8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;
