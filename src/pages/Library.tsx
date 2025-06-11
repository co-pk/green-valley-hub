
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BookOpen, Search, Download, Clock, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Library = () => {
  const digitalResources = [
    { title: 'Encyclopedia Britannica Online', category: 'Reference', access: 'Unlimited', description: 'Comprehensive encyclopedia with articles on every subject.' },
    { title: 'National Geographic Kids', category: 'Educational', access: 'School Hours', description: 'Interactive content for young learners about nature and science.' },
    { title: 'Oxford English Dictionary', category: 'Language', access: 'Unlimited', description: 'Complete dictionary with etymology and usage examples.' },
    { title: 'Khan Academy', category: 'Learning Platform', access: 'Unlimited', description: 'Free online courses and practice exercises.' }
  ];

  const newBooks = [
    { title: 'The Future of Science', author: 'Dr. Jane Smith', genre: 'Science', rating: 4.8, image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop' },
    { title: 'History Unfolded', author: 'Prof. Michael Johnson', genre: 'History', rating: 4.6, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop' },
    { title: 'Mathematical Wonders', author: 'Dr. Sarah Chen', genre: 'Mathematics', rating: 4.7, image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=200&h=300&fit=crop' },
    { title: 'Creative Writing Guide', author: 'Emma Wilson', genre: 'Literature', rating: 4.9, image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200&h=300&fit=crop' }
  ];

  const libraryHours = [
    { day: 'Monday - Friday', hours: '7:30 AM - 4:30 PM' },
    { day: 'Saturday', hours: '9:00 AM - 2:00 PM' },
    { day: 'Sunday', hours: 'Closed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-valley-green to-valley-blue py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">School Library</h1>
              <p className="text-xl text-white/90">
                Discover a world of knowledge with our extensive collection of books and digital resources.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-valley-green">15,000+</div>
                <div className="text-muted-foreground">Books</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-valley-blue">500+</div>
                <div className="text-muted-foreground">Digital Resources</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-valley-gold">50</div>
                <div className="text-muted-foreground">Study Seats</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-valley-green">12</div>
                <div className="text-muted-foreground">Computer Stations</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="catalog" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="catalog">Catalog Search</TabsTrigger>
                <TabsTrigger value="digital">Digital Resources</TabsTrigger>
                <TabsTrigger value="new">New Arrivals</TabsTrigger>
                <TabsTrigger value="hours">Hours & Info</TabsTrigger>
              </TabsList>

              <TabsContent value="catalog" className="space-y-6">
                <div className="max-w-2xl mx-auto text-center">
                  <h2 className="text-3xl font-bold text-valley-green mb-4">Search Our Catalog</h2>
                  <p className="text-muted-foreground mb-6">
                    Find books, journals, and other materials in our collection.
                  </p>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search by title, author, or subject..."
                      className="pl-12 py-3 text-lg"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {['Fiction', 'Non-Fiction', 'Science', 'History', 'Literature', 'Reference'].map((category) => (
                      <Button key={category} variant="outline" size="sm">
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="digital" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-valley-green mb-4">Digital Resources</h2>
                  <p className="text-muted-foreground">
                    Access our online databases and digital learning materials.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {digitalResources.map((resource, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg text-valley-green">{resource.title}</CardTitle>
                            <p className="text-sm text-valley-blue">{resource.category}</p>
                          </div>
                          <span className="px-2 py-1 bg-valley-green/10 text-valley-green text-xs rounded">
                            {resource.access}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{resource.description}</p>
                        <Button size="sm" className="w-full">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Access Resource
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="new" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-valley-green mb-4">New Arrivals</h2>
                  <p className="text-muted-foreground">
                    Check out the latest additions to our collection.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {newBooks.map((book, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="p-4">
                        <div className="aspect-[2/3] overflow-hidden rounded-lg mb-4">
                          <img 
                            src={book.image} 
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardTitle className="text-sm leading-tight">{book.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">by {book.author}</p>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs bg-valley-blue/10 text-valley-blue px-2 py-1 rounded">
                            {book.genre}
                          </span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            <span className="text-xs">{book.rating}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          Reserve
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="hours" className="space-y-6">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-valley-green mb-4">Library Information</h2>
                    <p className="text-muted-foreground">
                      Hours, policies, and contact information.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-valley-green">
                          <Clock className="w-5 h-5 mr-2" />
                          Library Hours
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {libraryHours.map((schedule, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="font-medium">{schedule.day}</span>
                              <span className="text-muted-foreground">{schedule.hours}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-valley-green">
                          <Users className="w-5 h-5 mr-2" />
                          Services
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>• Book borrowing and returns</li>
                          <li>• Computer and internet access</li>
                          <li>• Study spaces and group rooms</li>
                          <li>• Research assistance</li>
                          <li>• Printing and copying</li>
                          <li>• Digital resource training</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-8 text-center">
                    <Card className="bg-valley-green text-white">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                        <p className="mb-4">Our librarians are here to assist you with research and finding resources.</p>
                        <Button variant="secondary">
                          Contact Librarian
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Library;
