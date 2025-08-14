const GITHUB_TOKEN = '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';

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  company: string;
  blog: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
  html_url: string;
}

export interface GitHubStats {
  user: GitHubUser;
  repos: GitHubRepo[];
  languages: { [key: string]: number };
  totalStars: number;
  totalForks: number;
  contributionYears: number;
}

class GitHubService {
  private async makeRequest(url: string) {
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUserProfile(username: string): Promise<GitHubUser> {
    return this.makeRequest(`https://api.github.com/users/${username}`);
  }

  async getUserRepos(username: string): Promise<GitHubRepo[]> {
    const repos = await this.makeRequest(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
    );
    
    // Filter out forks and return top repos by stars
    return repos
      .filter((repo: GitHubRepo) => !repo.name.includes('fork'))
      .sort((a: GitHubRepo, b: GitHubRepo) => b.stargazers_count - a.stargazers_count)
      .slice(0, 20);
  }

  async getLanguageStats(repos: GitHubRepo[]): Promise<{ [key: string]: number }> {
    const languages: { [key: string]: number } = {};
    
    for (const repo of repos) {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    }
    
    return languages;
  }

  async getCompleteStats(username: string): Promise<GitHubStats> {
    try {
      const [user, repos] = await Promise.all([
        this.getUserProfile(username),
        this.getUserRepos(username),
      ]);

      const languages = await this.getLanguageStats(repos);
      const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
      const contributionYears = new Date().getFullYear() - new Date(user.created_at).getFullYear();

      return {
        user,
        repos,
        languages,
        totalStars,
        totalForks,
        contributionYears,
      };
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      throw error;
    }
  }
}

export const githubService = new GitHubService();