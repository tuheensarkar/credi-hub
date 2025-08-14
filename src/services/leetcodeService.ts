
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
  private async makeGraphQLRequest(query: string, variables: any = {}) {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`LeetCode API error: ${response.status}`);
    }

    return response.json();
  }

  async getUserStats(username: string): Promise<LeetCodeStats> {
    try {
      const [profileData, statsData, contestData] = await Promise.all([
        this.getUserProfile(username),
        this.getUserSubmissionStats(username),
        this.getUserContestData(username),
      ]);

      return {
        username,
        profile: profileData,
        submitStats: statsData.submitStats,
        problemsSolved: statsData.problemsSolved,
        contestRating: contestData.rating,
        contestRanking: contestData.ranking,
        badges: profileData.badges || [],
        recentSubmissions: statsData.recentSubmissions || [],
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

  private async getUserProfile(username: string) {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          profile {
            realName
            userAvatar
            ranking
            reputation
            gitHub
            twitter
            linkedIN
            websites
          }
          badges {
            id
            name
            shortName
            displayName
            icon
            hoverText
            medal {
              slug
              config {
                iconGif
                iconGifBackground
              }
            }
            creationDate
            category
          }
        }
      }
    `;

    const response = await this.makeGraphQLRequest(query, { username });
    const user = response.data?.matchedUser;
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      realName: user.profile?.realName || username,
      avatar: user.profile?.userAvatar || '',
      ranking: user.profile?.ranking || 0,
      reputation: user.profile?.reputation || 0,
      gitHub: user.profile?.gitHub || '',
      twitter: user.profile?.twitter || '',
      linkedIN: user.profile?.linkedIN || '',
      website: user.profile?.websites || [],
      badges: user.badges || [],
    };
  }

  private async getUserSubmissionStats(username: string) {
    const query = `
      query getUserStats($username: String!) {
        matchedUser(username: $username) {
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
            totalSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          problemsSolvedBeatsStats {
            numSolved
            total
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
        userProblemsSolved(username: $username) {
          solvedProblem
          totalProblem
          easySolved
          totalEasy
          mediumSolved
          totalMedium
          hardSolved
          totalHard
        }
      }
    `;

    const response = await this.makeGraphQLRequest(query, { username });
    const user = response.data?.matchedUser;
    const problemsSolved = response.data?.userProblemsSolved;

    return {
      submitStats: user?.submitStats || { acSubmissionNum: [], totalSubmissionNum: [] },
      problemsSolved: problemsSolved || {
        solvedProblem: 0,
        totalProblem: 0,
        easySolved: 0,
        totalEasy: 0,
        mediumSolved: 0,
        totalMedium: 0,
        hardSolved: 0,
        totalHard: 0,
      },
      recentSubmissions: [],
    };
  }

  private async getUserContestData(username: string) {
    const query = `
      query getUserContestRanking($username: String!) {
        userContestRanking(username: $username) {
          attendedContestCount
          rating
          globalRanking
          totalParticipants
          topPercentage
        }
      }
    `;

    try {
      const response = await this.makeGraphQLRequest(query, { username });
      const contestData = response.data?.userContestRanking;

      return {
        rating: Math.round(contestData?.rating || 0),
        ranking: contestData?.globalRanking || 0,
      };
    } catch (error) {
      return { rating: 0, ranking: 0 };
    }
  }
}

export const leetcodeService = new LeetCodeService();
