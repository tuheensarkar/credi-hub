import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, GitFork } from "lucide-react";

export const HeroSection = () => {
  const scrollToSearch = () => {
    const searchSection = document.getElementById('search-section');
    searchSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 px-4 bg-gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white rounded-full blur-2xl" />
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            All Your Developer
            <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Credibility, One Link
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Showcase your GitHub contributions, LinkedIn achievements, and LeetCode prowess 
            in a beautiful, recruiter-friendly profile that tells your complete story.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              variant="hero"
              size="lg"
              onClick={scrollToSearch}
              className="bg-white text-primary hover:bg-blue-50 shadow-professional-xl text-lg px-8 py-4"
            >
              Create Your Profile
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4"
            >
              View Demo Profile
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Star className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold mb-2">5K+</div>
              <div className="text-blue-100">Profiles Created</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Users className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Recruiters Reached</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <GitFork className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-blue-100">Companies Hiring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};