
const GROQ_API_KEY = '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';

export interface ProfileSummary {
  headline: string;
  summary: string;
  keySkills: string[];
  highlights: string[];
  professionalLevel: 'Junior' | 'Mid-Level' | 'Senior' | 'Lead' | 'Principal';
  strengthAreas: string[];
  careerTrajectory: string;
  categorizedSkills: {
    frontend: string[];
    backend: string[];
    database: string[];
    devops: string[];
    mobile: string[];
    algorithms: string[];
  };
  projectInsights: {
    topProjects: Array<{
      name: string;
      insight: string;
      technologies: string[];
    }>;
  };
  competitiveProgrammingInsights: {
    strongAreas: string[];
    improvementAreas: string[];
    overallAssessment: string;
  };
}

class AIService {
  private async makeRequest(messages: any[]) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages,
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async generateProfileSummary(githubData: any, linkedinData?: any, leetcodeData?: any): Promise<ProfileSummary> {
    const prompt = `
    You are a professional recruiter and technical writer. Based on the following developer data, create a comprehensive professional summary that highlights the candidate's strengths and credibility.

    GitHub Data:
    - Name: ${githubData.user.name || githubData.user.login}
    - Bio: ${githubData.user.bio || 'No bio provided'}
    - Company: ${githubData.user.company || 'Not specified'}
    - Location: ${githubData.user.location || 'Not specified'}
    - Public Repos: ${githubData.user.public_repos}
    - Followers: ${githubData.user.followers}
    - Total Stars: ${githubData.totalStars}
    - Total Forks: ${githubData.totalForks}
    - Years Contributing: ${githubData.contributionYears}
    - Top Languages: ${Object.keys(githubData.languages).slice(0, 5).join(', ')}
    - Top Repositories: ${githubData.repos.slice(0, 3).map((r: any) => `${r.name} (${r.stargazers_count} stars, ${r.language || 'Mixed'})`).join(', ')}

    ${linkedinData ? `
    LinkedIn Data:
    - Name: ${linkedinData.name}
    - Headline: ${linkedinData.headline}
    - Location: ${linkedinData.location}
    - Experience: ${linkedinData.experience.length} positions
    - Skills: ${linkedinData.skills.slice(0, 10).join(', ')}
    - Certifications: ${linkedinData.certifications.length} certifications
    ` : 'LinkedIn data not available'}

    ${leetcodeData ? `
    LeetCode Data:
    - Problems Solved: ${leetcodeData.problemsSolved.solvedProblem}/${leetcodeData.problemsSolved.totalProblem}
    - Easy: ${leetcodeData.problemsSolved.easySolved}/${leetcodeData.problemsSolved.totalEasy}
    - Medium: ${leetcodeData.problemsSolved.mediumSolved}/${leetcodeData.problemsSolved.totalMedium}
    - Hard: ${leetcodeData.problemsSolved.hardSolved}/${leetcodeData.problemsSolved.totalHard}
    - Contest Rating: ${leetcodeData.contestRating}
    - Global Ranking: ${leetcodeData.contestRanking}
    ` : 'LeetCode data not available'}

    Please provide a JSON response with the following structure:
    {
      "headline": "A compelling 1-2 line professional headline that captures their expertise",
      "summary": "A 4-5 sentence professional summary highlighting key achievements, expertise, and career trajectory",
      "keySkills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"],
      "highlights": ["achievement1", "achievement2", "achievement3", "achievement4"],
      "professionalLevel": "Junior|Mid-Level|Senior|Lead|Principal",
      "strengthAreas": ["area1", "area2", "area3"],
      "careerTrajectory": "Brief assessment of career growth and potential",
      "categorizedSkills": {
        "frontend": ["React", "TypeScript", "JavaScript"],
        "backend": ["Node.js", "Python", "API Development"],
        "database": ["SQL", "NoSQL", "Database Design"],
        "devops": ["Docker", "CI/CD", "Cloud Services"],
        "mobile": ["React Native", "Flutter"],
        "algorithms": ["Data Structures", "Problem Solving"]
      },
      "projectInsights": {
        "topProjects": [
          {
            "name": "Project Name",
            "insight": "Brief insight about the project's significance",
            "technologies": ["tech1", "tech2"]
          }
        ]
      },
      "competitiveProgrammingInsights": {
        "strongAreas": ["Arrays", "Dynamic Programming"],
        "improvementAreas": ["Graph Algorithms", "Advanced Trees"],
        "overallAssessment": "Assessment of competitive programming journey"
      }
    }

    Base the professional level on:
    - Junior: 0-2 years, few repos, basic projects, <50 LeetCode problems
    - Mid-Level: 2-5 years, moderate activity, some notable projects, 50-200 problems
    - Senior: 5+ years, high activity, significant contributions, >200 problems, mentoring evidence
    - Lead: Senior + leadership indicators, architectural decisions, team influence
    - Principal: Lead + industry recognition, open source leadership, technical vision

    Consider:
    - GitHub activity and project quality
    - LeetCode problem-solving consistency
    - LinkedIn professional progression
    - Technical depth vs breadth
    - Community involvement and mentoring

    Ensure the response is valid JSON and professionally written for recruiters.
    `;

    try {
      const response = await this.makeRequest([
        { role: 'user', content: prompt }
      ]);

      // Parse the JSON response
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const summary = JSON.parse(cleanResponse);
      
      // Validate the response structure
      if (!summary.headline || !summary.summary || !Array.isArray(summary.keySkills)) {
        throw new Error('Invalid AI response structure');
      }

      return summary;
    } catch (error) {
      console.error('Error generating AI summary:', error);
      
      // Enhanced fallback summary
      const leetcodeLevel = leetcodeData ? this.assessLeetCodeLevel(leetcodeData) : '';
      const githubLevel = this.assessGitHubLevel(githubData);
      
      return {
        headline: `${githubData.user.name || githubData.user.login} - ${githubLevel} Developer`,
        summary: `Experienced developer with ${githubData.contributionYears} years of contribution history and ${githubData.user.public_repos} public repositories. Specializes in ${Object.keys(githubData.languages)[0] || 'multiple programming languages'} with ${githubData.totalStars} total stars across projects.${leetcodeData ? ` Demonstrates strong algorithmic skills with ${leetcodeData.problemsSolved.solvedProblem} problems solved on LeetCode.` : ''}`,
        keySkills: [
          ...Object.keys(githubData.languages).slice(0, 4),
          'Problem Solving',
          'Software Development'
        ],
        highlights: [
          `${githubData.totalStars} total GitHub stars`,
          `${githubData.user.public_repos} public repositories`,
          `${githubData.user.followers} GitHub followers`,
          ...(leetcodeData ? [`${leetcodeData.problemsSolved.solvedProblem} LeetCode problems solved`] : [])
        ],
        professionalLevel: this.determineProfessionalLevel(githubData, leetcodeData),
        strengthAreas: ['Software Development', 'Code Quality', 'Technical Problem Solving'],
        careerTrajectory: 'Growing developer with consistent technical contributions',
        categorizedSkills: this.categorizeSkills(Object.keys(githubData.languages)),
        projectInsights: this.extractProjectInsights(githubData.repos),
        competitiveProgrammingInsights: this.analyzeLeetCodeInsights(leetcodeData),
      };
    }
  }

  private assessLeetCodeLevel(leetcodeData: any): string {
    const solved = leetcodeData.problemsSolved.solvedProblem;
    if (solved > 500) return 'Advanced Algorithmic';
    if (solved > 200) return 'Strong Algorithmic';
    if (solved > 50) return 'Developing Algorithmic';
    return 'Beginning Algorithmic';
  }

  private assessGitHubLevel(githubData: any): string {
    const { contributionYears, totalStars, user } = githubData;
    if (contributionYears >= 5 && totalStars > 100) return 'Senior';
    if (contributionYears >= 3 && user.public_repos > 15) return 'Mid-Level';
    return 'Junior';
  }

  private determineProfessionalLevel(githubData: any, leetcodeData?: any): 'Junior' | 'Mid-Level' | 'Senior' | 'Lead' | 'Principal' {
    const { contributionYears, totalStars, user } = githubData;
    const leetcodeSolved = leetcodeData?.problemsSolved?.solvedProblem || 0;
    
    // Enhanced scoring system
    let score = 0;
    
    // GitHub contributions
    score += Math.min(contributionYears * 2, 10);
    score += Math.min(totalStars / 10, 10);
    score += Math.min(user.public_repos / 5, 8);
    score += Math.min(user.followers / 10, 6);
    
    // LeetCode contributions
    if (leetcodeSolved > 0) {
      score += Math.min(leetcodeSolved / 20, 8);
    }
    
    if (score >= 35) return 'Principal';
    if (score >= 25) return 'Lead';
    if (score >= 18) return 'Senior';
    if (score >= 10) return 'Mid-Level';
    return 'Junior';
  }

  private categorizeSkills(languages: string[]) {
    const skillMap = {
      frontend: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'HTML', 'CSS', 'SCSS', 'Sass'],
      backend: ['Python', 'Java', 'C#', 'C++', 'C', 'Go', 'Rust', 'Ruby', 'PHP', 'Node.js'],
      database: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite'],
      devops: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Jenkins', 'GitLab'],
      mobile: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Dart'],
      algorithms: ['Python', 'C++', 'Java', 'C', 'JavaScript'],
    };

    const categorized = {
      frontend: [],
      backend: [],
      database: [],
      devops: [],
      mobile: [],
      algorithms: [],
    };

    languages.forEach(lang => {
      Object.keys(skillMap).forEach(category => {
        if (skillMap[category].includes(lang)) {
          categorized[category].push(lang);
        }
      });
    });

    return categorized;
  }

  private extractProjectInsights(repos: any[]) {
    const topProjects = repos.slice(0, 3).map(repo => ({
      name: repo.name,
      insight: `${repo.stargazers_count} stars - ${repo.description || 'Innovative project showcasing technical skills'}`,
      technologies: [repo.language || 'Mixed'].filter(Boolean),
    }));

    return { topProjects };
  }

  private analyzeLeetCodeInsights(leetcodeData?: any) {
    if (!leetcodeData || !leetcodeData.problemsSolved.solvedProblem) {
      return {
        strongAreas: ['Starting competitive programming journey'],
        improvementAreas: ['Problem solving practice', 'Algorithm implementation'],
        overallAssessment: 'Beginning algorithmic problem solving journey',
      };
    }

    const { problemsSolved } = leetcodeData;
    const strongAreas = [];
    const improvementAreas = [];

    if (problemsSolved.easySolved > problemsSolved.mediumSolved) {
      strongAreas.push('Basic algorithms and data structures');
    }
    if (problemsSolved.mediumSolved > 0) {
      strongAreas.push('Intermediate problem solving');
    }
    if (problemsSolved.hardSolved > 0) {
      strongAreas.push('Advanced algorithmic thinking');
    }

    if (problemsSolved.mediumSolved < problemsSolved.easySolved / 2) {
      improvementAreas.push('Medium complexity problems');
    }
    if (problemsSolved.hardSolved === 0) {
      improvementAreas.push('Advanced algorithm design');
    }

    const totalSolved = problemsSolved.solvedProblem;
    let assessment = 'Growing problem solver';
    if (totalSolved > 100) assessment = 'Strong algorithmic foundation';
    if (totalSolved > 300) assessment = 'Advanced competitive programmer';

    return {
      strongAreas: strongAreas.length ? strongAreas : ['Developing algorithmic skills'],
      improvementAreas: improvementAreas.length ? improvementAreas : ['Continue problem solving practice'],
      overallAssessment: assessment,
    };
  }
}

export const aiService = new AIService();
