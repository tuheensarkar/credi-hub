import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Github, 
  Linkedin, 
  Code2, 
  MapPin, 
  Building, 
  Calendar,
  Star,
  GitFork,
  Users,
  Download,
  Share2,
  ExternalLink
} from "lucide-react";
import { GitHubStats } from "@/services/githubService";
import { ProfileSummary } from "@/services/aiService";

interface ProfileDashboardProps {
  githubData: GitHubStats;
  aiSummary: ProfileSummary;
  onExport: () => void;
  onShare: () => void;
}

export const ProfileDashboard = ({ githubData, aiSummary, onExport, onShare }: ProfileDashboardProps) => {
  const { user, repos, languages, totalStars, totalForks } = githubData;

  const topLanguages = Object.entries(languages)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6);

  const topRepos = repos.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={user.avatar_url}
              alt={user.name || user.login}
              className="w-24 h-24 rounded-full border-4 border-white shadow-professional-lg"
            />
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{user.name || user.login}</h1>
              <p className="text-xl text-blue-100 mb-4">{aiSummary.headline}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    <span>{user.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{githubData.contributionYears} years contributing</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="hero"
                onClick={onExport}
                className="bg-white text-primary hover:bg-blue-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                onClick={onShare}
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Professional Summary */}
            <Card className="p-6 bg-gradient-card shadow-professional-md">
              <h2 className="text-2xl font-bold mb-4">Professional Summary</h2>
              <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                {aiSummary.summary}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  {aiSummary.professionalLevel} Developer
                </Badge>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center bg-gradient-card shadow-professional-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
                  <Github className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">{user.public_repos}</div>
                <div className="text-sm text-muted-foreground">Repositories</div>
              </Card>
              
              <Card className="p-4 text-center bg-gradient-card shadow-professional-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-full mx-auto mb-2">
                  <Star className="h-6 w-6 text-warning" />
                </div>
                <div className="text-2xl font-bold">{totalStars}</div>
                <div className="text-sm text-muted-foreground">Total Stars</div>
              </Card>
              
              <Card className="p-4 text-center bg-gradient-card shadow-professional-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mx-auto mb-2">
                  <GitFork className="h-6 w-6 text-accent" />
                </div>
                <div className="text-2xl font-bold">{totalForks}</div>
                <div className="text-sm text-muted-foreground">Total Forks</div>
              </Card>
              
              <Card className="p-4 text-center bg-gradient-card shadow-professional-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mx-auto mb-2">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <div className="text-2xl font-bold">{user.followers}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </Card>
            </div>

            {/* Top Repositories */}
            <Card className="p-6 bg-gradient-card shadow-professional-md">
              <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
              <div className="grid gap-4">
                {topRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className="p-4 border rounded-lg hover:shadow-professional-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-primary">
                        {repo.name}
                      </h3>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">
                      {repo.description || "No description available"}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {repo.language && (
                          <Badge variant="outline">{repo.language}</Badge>
                        )}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3" />
                          <span>{repo.stargazers_count}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <GitFork className="h-3 w-3" />
                          <span>{repo.forks_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Skills */}
            <Card className="p-6 bg-gradient-card shadow-professional-md">
              <h3 className="text-xl font-bold mb-4">Key Skills</h3>
              <div className="flex flex-wrap gap-2">
                {aiSummary.keySkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Programming Languages */}
            <Card className="p-6 bg-gradient-card shadow-professional-md">
              <h3 className="text-xl font-bold mb-4">Programming Languages</h3>
              <div className="space-y-3">
                {topLanguages.map(([language, count]) => (
                  <div key={language} className="flex items-center justify-between">
                    <span className="font-medium">{language}</span>
                    <Badge variant="outline">{count} repos</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Highlights */}
            <Card className="p-6 bg-gradient-card shadow-professional-md">
              <h3 className="text-xl font-bold mb-4">Highlights</h3>
              <ul className="space-y-2">
                {aiSummary.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{highlight}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Profile Links */}
            <Card className="p-6 bg-gradient-card shadow-professional-md">
              <h3 className="text-xl font-bold mb-4">Profile Links</h3>
              <div className="space-y-3">
                <a
                  href={`https://github.com/${user.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub Profile</span>
                </a>
                
                {user.blog && (
                  <a
                    href={user.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>Personal Website</span>
                  </a>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};