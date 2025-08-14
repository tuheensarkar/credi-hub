import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { SearchForm } from "@/components/SearchForm";
import { ProfileDashboard } from "@/components/ProfileDashboard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { githubService, GitHubStats } from "@/services/githubService";
import { aiService, ProfileSummary } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  github: GitHubStats;
  aiSummary: ProfileSummary;
}

const Index = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (usernames: { github: string; linkedin: string; leetcode: string }) => {
    setIsLoading(true);
    
    try {
      // Fetch GitHub data
      const githubData = await githubService.getCompleteStats(usernames.github);
      
      // Generate AI summary
      const aiSummary = await aiService.generateProfileSummary(githubData);
      
      setUserData({
        github: githubData,
        aiSummary,
      });

      toast({
        title: "Profile Generated Successfully!",
        description: "Your professional developer profile is ready.",
      });
    } catch (error) {
      console.error('Error generating profile:', error);
      toast({
        title: "Error Generating Profile",
        description: "Please check the username and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Feature",
      description: "PDF export will be available soon!",
    });
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied!",
      description: "Profile link has been copied to clipboard.",
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (userData) {
    return (
      <ProfileDashboard
        githubData={userData.github}
        aiSummary={userData.aiSummary}
        onExport={handleExport}
        onShare={handleShare}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      <section id="search-section" className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose DevCredibility?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">AI</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-muted-foreground">
                Advanced AI analyzes your code and generates professional summaries that highlight your expertise.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Generation</h3>
              <p className="text-muted-foreground">
                Create comprehensive developer profiles in seconds, not hours. Just enter your username and go.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Recruiter-Friendly</h3>
              <p className="text-muted-foreground">
                Designed specifically for recruiters and hiring managers to quickly assess technical talent.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
