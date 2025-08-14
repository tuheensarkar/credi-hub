import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Github, Linkedin, Code2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchFormProps {
  onSearch: (usernames: { github: string; linkedin: string; leetcode: string }) => void;
  isLoading?: boolean;
}

export const SearchForm = ({ onSearch, isLoading = false }: SearchFormProps) => {
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const { toast } = useToast();

  const extractUsername = (input: string, platform: 'github' | 'linkedin' | 'leetcode'): string => {
    const trimmed = input.trim();
    if (!trimmed) return '';
    
    // Extract username from URLs
    if (platform === 'github') {
      const githubMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/\s]+)/);
      return githubMatch ? githubMatch[1] : trimmed;
    }
    
    if (platform === 'linkedin') {
      const linkedinMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([^\/\s]+)/);
      return linkedinMatch ? linkedinMatch[1] : trimmed;
    }
    
    if (platform === 'leetcode') {
      const leetcodeMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?leetcode\.com\/u\/([^\/\s]+)/);
      return leetcodeMatch ? leetcodeMatch[1] : trimmed;
    }
    
    return trimmed;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const githubUsername = extractUsername(github, 'github');
    
    if (!githubUsername) {
      toast({
        title: "GitHub username required",
        description: "Please enter at least a GitHub username to continue.",
        variant: "destructive",
      });
      return;
    }

    onSearch({
      github: githubUsername,
      linkedin: extractUsername(linkedin, 'linkedin'),
      leetcode: extractUsername(leetcode, 'leetcode'),
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-8 bg-gradient-card shadow-professional-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Create Your Developer Profile
        </h2>
        <p className="text-muted-foreground text-lg">
          Enter your usernames to generate a comprehensive professional profile
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Github className="h-5 w-5 text-foreground" />
            <div className="flex-1">
              <label htmlFor="github" className="block text-sm font-medium text-foreground mb-1">
                GitHub Username *
              </label>
              <Input
                id="github"
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="octocat"
                className="w-full"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Linkedin className="h-5 w-5 text-foreground" />
            <div className="flex-1">
              <label htmlFor="linkedin" className="block text-sm font-medium text-foreground mb-1">
                LinkedIn Username
              </label>
              <Input
                id="linkedin"
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="john-doe"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Code2 className="h-5 w-5 text-foreground" />
            <div className="flex-1">
              <label htmlFor="leetcode" className="block text-sm font-medium text-foreground mb-1">
                LeetCode Username
              </label>
              <Input
                id="leetcode"
                type="text"
                value={leetcode}
                onChange={(e) => setLeetcode(e.target.value)}
                placeholder="leetcode_user"
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Generating Profile...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Generate Profile
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>* GitHub username is required. LinkedIn and LeetCode are optional but recommended.</p>
      </div>
    </Card>
  );
};