
export interface LeetCodeStats {
  username: string;
  profile: {
    realName: string;
    avatar: string;
    ranking: number;
    reputation: number;
    gitHub: string;
    twitter: string;
    linkedIN: string;
    website: string[];
  };
  submitStats: {
    acSubmissionNum: LeetCodeSubmission[];
    totalSubmissionNum: LeetCodeSubmission[];
  };
  problemsSolved: {
    solvedProblem: number;
    totalProblem: number;
    easySolved: number;
    totalEasy: number;
    mediumSolved: number;
    totalMedium: number;
    hardSolved: number;
    totalHard: number;
  };
  contestRating: number;
  contestRanking: number;
  badges: LeetCodeBadge[];
  recentSubmissions: LeetCodeRecentSubmission[];
}

export interface LeetCodeSubmission {
  difficulty: string;
  count: number;
  submissions: number;
}

export interface LeetCodeBadge {
  id: string;
  name: string;
  shortName: string;
  displayName: string;
  icon: string;
  hoverText: string;
  medal: {
    slug: string;
    config: {
      iconGif: string;
      iconGifBackground: string;
    };
  };
  creationDate: string;
  category: string;
}

export interface LeetCodeRecentSubmission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

class LeetCodeService {
  private async fetchLeetCodeStats(username: string) {
    try {
      // Use leetcode-stats-api proxy since direct GraphQL is blocked by CORS
      const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
      
      if (!response.ok) {
        throw new Error(`LeetCode API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('LeetCode API fetch error:', error);
      // Try alternative API
      try {
        const altResponse = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`);
        if (altResponse.ok) {
          const altData = await altResponse.json();
          return this.transformAltApiData(altData, username);
        }
      } catch (altError) {
        console.error('Alternative LeetCode API also failed:', altError);
      }
      return null;
    }
  }

  private transformAltApiData(data: any, username: string) {
    return {
      status: 'success',
      message: 'retrieved',
      totalSolved: data.solvedProblem || 0,
      totalQuestions: data.totalQuestions || 0,
      easySolved: data.easySolved || 0,
      totalEasy: data.totalEasy || 0,
      mediumSolved: data.mediumSolved || 0,
      totalMedium: data.totalMedium || 0,
      hardSolved: data.hardSolved || 0,
      totalHard: data.totalHard || 0,
      acceptanceRate: data.acceptanceRate || 0,
      ranking: data.ranking || 0,
      contributionPoints: data.contributionPoints || 0,
      reputation: data.reputation || 0,
      submissionCalendar: data.submissionCalendar || {},
    };
  }

  async getUserStats(username: string): Promise<LeetCodeStats> {
    try {
      const data = await this.fetchLeetCodeStats(username);
      
      if (!data || data.status === 'error') {
        throw new Error('LeetCode user not found or API error');
      }

      return {
        username,
        profile: {
          realName: username,
          avatar: '',
          ranking: data.ranking || 0,
          reputation: data.reputation || 0,
          gitHub: '',
          twitter: '',
          linkedIN: '',
          website: [],
        },
        submitStats: {
          acSubmissionNum: [
            { difficulty: 'Easy', count: data.easySolved || 0, submissions: data.easySolved || 0 },
            { difficulty: 'Medium', count: data.mediumSolved || 0, submissions: data.mediumSolved || 0 },
            { difficulty: 'Hard', count: data.hardSolved || 0, submissions: data.hardSolved || 0 },
          ],
          totalSubmissionNum: [],
        },
        problemsSolved: {
          solvedProblem: data.totalSolved || 0,
          totalProblem: data.totalQuestions || 0,
          easySolved: data.easySolved || 0,
          totalEasy: data.totalEasy || 0,
          mediumSolved: data.mediumSolved || 0,
          totalMedium: data.totalMedium || 0,
          hardSolved: data.hardSolved || 0,
          totalHard: data.totalHard || 0,
        },
        contestRating: Math.floor(Math.random() * 200) + 1500, // Mock contest rating
        contestRanking: data.ranking || 0,
        badges: this.generateMockBadges(data.totalSolved || 0),
        recentSubmissions: [],
      };
    } catch (error) {
      console.error('Error fetching LeetCode data:', error);
      
      // Return fallback data
      return {
        username,
        profile: {
          realName: username,
          avatar: '',
          ranking: 0,
          reputation: 0,
          gitHub: '',
          twitter: '',
          linkedIN: '',
          website: [],
        },
        submitStats: {
          acSubmissionNum: [],
          totalSubmissionNum: [],
        },
        problemsSolved: {
          solvedProblem: 0,
          totalProblem: 0,
          easySolved: 0,
          totalEasy: 0,
          mediumSolved: 0,
          totalMedium: 0,
          hardSolved: 0,
          totalHard: 0,
        },
        contestRating: 0,
        contestRanking: 0,
        badges: [],
        recentSubmissions: [],
      };
    }
  }

  private generateMockBadges(problemsSolved: number): LeetCodeBadge[] {
    const badges: LeetCodeBadge[] = [];
    
    if (problemsSolved >= 10) {
      badges.push({
        id: '1',
        name: 'problem-solver',
        shortName: 'Solver',
        displayName: 'Problem Solver',
        icon: '🏆',
        hoverText: 'Solved 10+ problems',
        medal: {
          slug: 'bronze',
          config: {
            iconGif: '',
            iconGifBackground: '',
          },
        },
        creationDate: new Date().toISOString(),
        category: 'problem-solving',
      });
    }
    
    if (problemsSolved >= 50) {
      badges.push({
        id: '2',
        name: 'dedicated-solver',
        shortName: 'Dedicated',
        displayName: 'Dedicated Solver',
        icon: '🥈',
        hoverText: 'Solved 50+ problems',
        medal: {
          slug: 'silver',
          config: {
            iconGif: '',
            iconGifBackground: '',
          },
        },
        creationDate: new Date().toISOString(),
        category: 'problem-solving',
      });
    }
    
    if (problemsSolved >= 100) {
      badges.push({
        id: '3',
        name: 'coding-master',
        shortName: 'Master',
        displayName: 'Coding Master',
        icon: '🥇',
        hoverText: 'Solved 100+ problems',
        medal: {
          slug: 'gold',
          config: {
            iconGif: '',
            iconGifBackground: '',
          },
        },
        creationDate: new Date().toISOString(),
        category: 'mastery',
      });
    }
    
    return badges;
  }

}

export const leetcodeService = new LeetCodeService();
