import { Button } from "@/components/ui/button";
import { Github, Linkedin, Code } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-gradient-card shadow-professional-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Code className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">DevCredibility</h1>
              <p className="text-sm text-muted-foreground">Professional Developer Profiles</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <Github className="h-4 w-4" />
              <span>GitHub</span>
              <span>•</span>
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn</span>
              <span>•</span>
              <Code className="h-4 w-4" />
              <span>LeetCode</span>
            </div>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};