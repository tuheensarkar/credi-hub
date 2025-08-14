
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, TrendingUp, Award } from "lucide-react";
import { LeetCodeStats } from "@/services/leetcodeService";

interface LeetCodeSectionProps {
  data: LeetCodeStats;
}

export const LeetCodeSection = ({ data }: LeetCodeSectionProps) => {
  const { problemsSolved } = data;
  const totalSolved = problemsSolved.solvedProblem;
  const easyPercentage = problemsSolved.totalEasy > 0 ? (problemsSolved.easySolved / problemsSolved.totalEasy) * 100 : 0;
  const mediumPercentage = problemsSolved.totalMedium > 0 ? (problemsSolved.mediumSolved / problemsSolved.totalMedium) * 100 : 0;
  const hardPercentage = problemsSolved.totalHard > 0 ? (problemsSolved.hardSolved / problemsSolved.totalHard) * 100 : 0;

  return (
    <Card className="p-6 bg-gradient-card shadow-professional-md">
      <div className="flex items-center gap-3 mb-6">
        <Target className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">LeetCode Performance</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div className="text-2xl font-bold">{totalSolved}</div>
          <div className="text-sm text-muted-foreground">Problems Solved</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mx-auto mb-2">
            <TrendingUp className="h-6 w-6 text-success" />
          </div>
          <div className="text-2xl font-bold">{data.contestRating}</div>
          <div className="text-sm text-muted-foreground">Contest Rating</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-full mx-auto mb-2">
            <Award className="h-6 w-6 text-warning" />
          </div>
          <div className="text-2xl font-bold">{data.contestRanking || 'N/A'}</div>
          <div className="text-sm text-muted-foreground">Global Rank</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mx-auto mb-2">
            <Target className="h-6 w-6 text-accent" />
          </div>
          <div className="text-2xl font-bold">{data.badges.length}</div>
          <div className="text-sm text-muted-foreground">Badges</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Easy Problems</span>
            <span className="text-sm text-muted-foreground">
              {problemsSolved.easySolved}/{problemsSolved.totalEasy}
            </span>
          </div>
          <Progress value={easyPercentage} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Medium Problems</span>
            <span className="text-sm text-muted-foreground">
              {problemsSolved.mediumSolved}/{problemsSolved.totalMedium}
            </span>
          </div>
          <Progress value={mediumPercentage} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Hard Problems</span>
            <span className="text-sm text-muted-foreground">
              {problemsSolved.hardSolved}/{problemsSolved.totalHard}
            </span>
          </div>
          <Progress value={hardPercentage} className="h-2" />
        </div>
      </div>

      {data.badges.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {data.badges.slice(0, 6).map((badge) => (
              <Badge key={badge.id} variant="secondary" className="text-xs">
                {badge.displayName}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
