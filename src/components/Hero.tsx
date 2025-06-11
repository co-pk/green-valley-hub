
import { ArrowRight, Users, Award, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-valley-green via-valley-blue to-valley-green-dark"></div>
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Decorative shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-valley-gold/20 rounded-full blur-xl"></div>
      
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Welcome to
            <span className="block text-valley-gold">Green Valley School</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
            Nurturing young minds, building bright futures. Experience excellence in education 
            with our innovative learning environment and dedicated faculty.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-valley-gold hover:bg-valley-gold/90 text-black font-semibold">
              Schedule a Tour
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-valley-green">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold mb-2">1,200+</div>
              <div className="text-white/80">Students</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Award className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-white/80">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full backdrop-blur-sm">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-white/80">Programs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
