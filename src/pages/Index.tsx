
import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { SearchForm } from "@/components/SearchForm";
import { ProfileDashboard } from "@/components/ProfileDashboard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { githubService, GitHubStats } from "@/services/githubService";
import { linkedinService, LinkedInProfile } from "@/services/linkedinService";
import { leetcodeService, LeetCodeStats } from "@/services/leetcodeService";
import { aiService, ProfileSummary } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  github: GitHubStats;
  linkedin?: LinkedInProfile;
  leetcode?: LeetCodeStats;
  aiSummary: ProfileSummary;
}

const Index = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (usernames: { github: string; linkedin: string; leetcode: string }) => {
    setIsLoading(true);
    
    try {
      console.log('Fetching data for:', usernames);
      
      // Fetch GitHub data (required)
      const githubData = await githubService.getCompleteStats(usernames.github);
      console.log('GitHub data fetched:', githubData);
      
      // Fetch LinkedIn data (optional)
      let linkedinData: LinkedInProfile | undefined;
      if (usernames.linkedin) {
        try {
          linkedinData = await linkedinService.getPublicProfile(usernames.linkedin);
          console.log('LinkedIn data fetched:', linkedinData);
        } catch (error) {
          console.warn('LinkedIn data fetch failed:', error);
          toast({
            title: "LinkedIn Data Unavailable",
            description: "Continuing with GitHub data only.",
            variant: "default",
          });
        }
      }
      
      // Fetch LeetCode data (optional)
      let leetcodeData: LeetCodeStats | undefined;
      if (usernames.leetcode) {
        try {
          leetcodeData = await leetcodeService.getUserStats(usernames.leetcode);
          console.log('LeetCode data fetched:', leetcodeData);
        } catch (error) {
          console.warn('LeetCode data fetch failed:', error);
          toast({
            title: "LeetCode Data Unavailable", 
            description: "Continuing with available data.",
            variant: "default",
          });
        }
      }
      
      // Generate AI summary with all available data
      console.log('Generating AI summary...');
      const aiSummary = await aiService.generateProfileSummary(githubData, linkedinData, leetcodeData);
      console.log('AI summary generated:', aiSummary);
      
      setUserData({
        github: githubData,
        linkedin: linkedinData,
        leetcode: leetcodeData,
        aiSummary,
      });

      toast({
        title: "Profile Generated Successfully!",
        description: `Your professional developer profile is ready${linkedinData ? ' with LinkedIn data' : ''}${leetcodeData ? ' and LeetCode stats' : ''}.`,
      });
    } catch (error) {
      console.error('Error generating profile:', error);
      toast({
        title: "Error Generating Profile",
        description: "Please check the usernames and try again.",
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
    if (userData) {
      const shareData = {
        title: `${userData.github.user.name || userData.github.user.login} - Developer Profile`,
        text: userData.aiSummary.headline,
        url: window.location.href,
      };
      
      if (navigator.share) {
        navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied!",
          description: "Profile link has been copied to clipboard.",
        });
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (userData) {
    return (
      <ProfileDashboard
        githubData={userData.github}
        linkedinData={userData.linkedin}
        leetcodeData={userData.leetcode}
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
              <h3 className="text-xl font-semibold mb-2">Multi-Platform Analysis</h3>
              <p className="text-muted-foreground">
                Combines GitHub, LinkedIn, and LeetCode data for comprehensive developer credibility assessment.
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
