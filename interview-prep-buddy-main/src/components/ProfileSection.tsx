import { motion } from "framer-motion";
import { Trophy, Award, Download, Trash2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { InterviewSession, PerformanceScores } from "@/hooks/use-performance";
import { generateRecommendationPDF } from "@/lib/generate-pdf";

interface ProfileSectionProps {
  sessions: InterviewSession[];
  averageScores: PerformanceScores | null;
  totalPoints: number;
  onClear: () => void;
}

const getLevelInfo = (points: number) => {
  if (points >= 500) return { level: "Expert", color: "text-primary", next: null };
  if (points >= 300) return { level: "Advanced", color: "text-purple-400", next: 500 };
  if (points >= 150) return { level: "Intermediate", color: "text-blue-400", next: 300 };
  if (points >= 50) return { level: "Beginner", color: "text-green-400", next: 150 };
  return { level: "Novice", color: "text-muted-foreground", next: 50 };
};

const ProfileSection = ({ sessions, averageScores, totalPoints, onClear }: ProfileSectionProps) => {
  const levelInfo = getLevelInfo(totalPoints);
  const canGetRecommendation = totalPoints >= 150;

  const handleDownloadPDF = () => {
    if (!averageScores) return;
    generateRecommendationPDF(averageScores, totalPoints, sessions.length);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4 overflow-y-auto h-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="h-20 w-20 mx-auto rounded-full bg-primary/15 flex items-center justify-center mb-3">
          <Trophy className="h-10 w-10 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground">Your Profile</h2>
        <p className={`text-lg font-semibold ${levelInfo.color}`}>{levelInfo.level}</p>
      </motion.div>

      {/* Points Card */}
      <Card className="bg-card border-border glow-gold">
        <CardContent className="p-6 text-center">
          <p className="text-4xl font-display font-bold text-gradient-gold">{totalPoints}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Points</p>
          {levelInfo.next && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1">
                {levelInfo.next - totalPoints} pts to next level
              </p>
              <Progress value={(totalPoints / levelInfo.next) * 100} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{sessions.length}</p>
            <p className="text-xs text-muted-foreground">Interviews</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Award className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">
              {averageScores ? averageScores.overallScore : "—"}
            </p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Average Scores Breakdown */}
      {averageScores && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Problem Solving", value: averageScores.problemSolving },
              { label: "Pressure Handling", value: averageScores.pressureHandling },
              { label: "Creative Thinking", value: averageScores.creativeThinking },
              { label: "Time Management", value: averageScores.timeManagement },
              { label: "Communication", value: averageScores.communication },
              { label: "Technical Skills", value: averageScores.technicalSkills },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-foreground font-medium">{item.value}/10</span>
                </div>
                <Progress value={item.value * 10} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommendation Letter */}
      <Card className={`border-border ${canGetRecommendation ? "bg-card" : "bg-card/50 opacity-60"}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-primary shrink-0" />
            <div className="flex-1">
              <h3 className="font-display font-semibold text-sm text-foreground">Letter of Recommendation</h3>
              <p className="text-xs text-muted-foreground">
                {canGetRecommendation
                  ? "You've earned enough points! Download your AI-generated recommendation letter."
                  : `Earn ${150 - totalPoints} more points to unlock (need 150 pts)`}
              </p>
            </div>
            <Button
              size="sm"
              disabled={!canGetRecommendation}
              onClick={handleDownloadPDF}
              className="gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Recent Sessions</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClear} className="text-destructive text-xs h-7 gap-1">
              <Trash2 className="h-3 w-3" />
              Clear
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {sessions.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center justify-between text-xs py-1.5 border-b border-border last:border-0">
                <div>
                  <span className="text-foreground font-medium">{s.domain.toUpperCase()}</span>
                  <span className="text-muted-foreground ml-2">{s.date}</span>
                </div>
                <span className="text-primary font-semibold">{s.scores.overallScore}/10</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileSection;
