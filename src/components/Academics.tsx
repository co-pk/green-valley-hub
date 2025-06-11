
import { BookOpen, Calculator, Palette, Microscope, Music, Globe2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Academics = () => {
  const programs = [
    {
      icon: BookOpen,
      title: 'English & Literature',
      description: 'Comprehensive language arts program focusing on reading, writing, and critical analysis.',
      features: ['Creative Writing', 'Literary Analysis', 'Public Speaking', 'Drama Club']
    },
    {
      icon: Calculator,
      title: 'Mathematics',
      description: 'Advanced mathematics curriculum from basic arithmetic to calculus and beyond.',
      features: ['Algebra & Geometry', 'Calculus', 'Statistics', 'Math Olympiad']
    },
    {
      icon: Microscope,
      title: 'Sciences',
      description: 'Hands-on science education with modern laboratory facilities.',
      features: ['Biology', 'Chemistry', 'Physics', 'Environmental Science']
    },
    {
      icon: Globe2,
      title: 'Social Studies',
      description: 'Comprehensive study of history, geography, and social sciences.',
      features: ['World History', 'Geography', 'Economics', 'Civics']
    },
    {
      icon: Palette,
      title: 'Arts & Design',
      description: 'Creative arts program fostering artistic expression and creativity.',
      features: ['Visual Arts', 'Digital Design', 'Ceramics', 'Art History']
    },
    {
      icon: Music,
      title: 'Music & Performance',
      description: 'Music education program with various instruments and performance opportunities.',
      features: ['Choir', 'Orchestra', 'Band', 'Music Theory']
    }
  ];

  return (
    <section id="academics" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-valley-green">Academic Excellence</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our comprehensive curriculum is designed to challenge and inspire students while 
            providing a strong foundation for future academic and career success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-valley-green/20">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-valley-green to-valley-blue rounded-full flex items-center justify-center">
                  <program.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-valley-green">{program.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">{program.description}</p>
                <div className="space-y-2">
                  {program.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-valley-green rounded-full mr-3"></div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-valley-green to-valley-blue rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">Advanced Placement Programs</h3>
            <p className="text-lg mb-6 text-white/90">
              Prepare for college with our comprehensive AP program offering 15+ advanced courses 
              taught by certified instructors.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>AP Biology</div>
              <div>AP Chemistry</div>
              <div>AP Physics</div>
              <div>AP Calculus</div>
              <div>AP English</div>
              <div>AP History</div>
              <div>AP Psychology</div>
              <div>AP Art</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Academics;
