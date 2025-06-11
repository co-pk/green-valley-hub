
import { Target, Heart, Lightbulb, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'Striving for the highest standards in academic achievement and personal development.'
    },
    {
      icon: Heart,
      title: 'Caring',
      description: 'Creating a nurturing environment where every student feels valued and supported.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Embracing modern teaching methods and technology to enhance learning experiences.'
    },
    {
      icon: Globe,
      title: 'Global Perspective',
      description: 'Preparing students to become responsible global citizens and future leaders.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-valley-green">About Green Valley School</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Founded in 1985, Green Valley School has been a beacon of educational excellence, 
            committed to nurturing young minds and preparing students for success in an ever-changing world.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-valley-green mb-6">Our Mission</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To provide a comprehensive, innovative education that empowers students to achieve their 
              full potential academically, socially, and personally while fostering critical thinking, 
              creativity, and a lifelong love of learning.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe every child deserves an education that not only prepares them for academic 
              success but also develops their character, leadership skills, and global awareness.
            </p>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-valley-green mb-6">Our Vision</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To be recognized as a leading educational institution that graduates confident, 
              compassionate, and capable individuals who contribute positively to their communities 
              and the world.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We envision a school where innovation meets tradition, where technology enhances learning, 
              and where every student is inspired to reach beyond their perceived limitations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 bg-white">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-valley-green rounded-full flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-4 text-valley-green">{value.title}</h4>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
