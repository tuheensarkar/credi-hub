const GROQ_API_KEY = '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';

export interface ProfileSummary {
  headline: string;
  summary: string;
  keySkills: string[];
  highlights: string[];
  professionalLevel: 'Junior' | 'Mid-Level' | 'Senior' | 'Lead' | 'Principal';
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
        max_tokens: 1000,
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
    You are a professional recruiter and technical writer. Based on the following developer data, create a comprehensive professional summary.

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
    - Top Repositories: ${githubData.repos.slice(0, 3).map((r: any) => `${r.name} (${r.stargazers_count} stars)`).join(', ')}

    ${linkedinData ? `LinkedIn Data: ${JSON.stringify(linkedinData, null, 2)}` : ''}
    ${leetcodeData ? `LeetCode Data: ${JSON.stringify(leetcodeData, null, 2)}` : ''}

    Please provide a JSON response with the following structure:
    {
      "headline": "A compelling 1-2 line professional headline",
      "summary": "A 3-4 sentence professional summary highlighting key achievements and expertise",
      "keySkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
      "highlights": ["achievement1", "achievement2", "achievement3"],
      "professionalLevel": "Junior|Mid-Level|Senior|Lead|Principal"
    }

    Base the professional level on:
    - Junior: 0-2 years, few repos, basic projects
    - Mid-Level: 2-5 years, moderate activity, some notable projects
    - Senior: 5+ years, high activity, significant contributions, mentoring
    - Lead: Senior + leadership, architectural decisions, team influence
    - Principal: Lead + industry recognition, open source leadership, technical vision

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
      
      // Fallback summary based on GitHub data
      return {
        headline: `${githubData.user.name || githubData.user.login} - Software Developer`,
        summary: `Experienced developer with ${githubData.contributionYears} years of contribution history and ${githubData.user.public_repos} public repositories. Specializes in ${Object.keys(githubData.languages)[0] || 'multiple programming languages'} with ${githubData.totalStars} total stars across projects.`,
        keySkills: Object.keys(githubData.languages).slice(0, 5),
        highlights: [
          `${githubData.totalStars} total GitHub stars`,
          `${githubData.user.public_repos} public repositories`,
          `${githubData.user.followers} GitHub followers`
        ],
        professionalLevel: this.determineProfessionalLevel(githubData),
      };
    }
  }

  private determineProfessionalLevel(githubData: any): 'Junior' | 'Mid-Level' | 'Senior' | 'Lead' | 'Principal' {
    const { contributionYears, totalStars, user } = githubData;
    
    if (contributionYears >= 8 && totalStars > 500 && user.followers > 100) return 'Principal';
    if (contributionYears >= 6 && totalStars > 200 && user.followers > 50) return 'Lead';
    if (contributionYears >= 4 && totalStars > 50 && user.public_repos > 20) return 'Senior';
    if (contributionYears >= 2 && user.public_repos > 10) return 'Mid-Level';
    return 'Junior';
  }
}

export const aiService = new AIService();