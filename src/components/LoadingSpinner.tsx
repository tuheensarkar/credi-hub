import { Card } from "@/components/ui/card";

export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="p-8 bg-gradient-card shadow-professional-lg text-center max-w-md">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">Generating Your Profile</h3>
        <p className="text-muted-foreground mb-4">
          We're gathering your data from GitHub and creating an AI-powered summary...
        </p>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>Fetching GitHub repositories</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></div>
            <span>Analyzing contribution patterns</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-700"></div>
            <span>Generating professional summary</span>
          </div>
        </div>
      </Card>
    </div>
  );
};