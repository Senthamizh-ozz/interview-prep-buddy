import { motion } from "framer-motion";
import { PerformanceScores } from "@/hooks/use-performance";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Clock, Lightbulb, Shield, MessageCircle, Wrench, Star } from "lucide-react";

interface PerformanceBoardProps {
  scores: PerformanceScores;
  onClose: () => void;
}

const metrics = [
  { key: "problemSolving" as const, label: "Problem Solving", icon: Brain, color: "text-blue-400" },
  { key: "pressureHandling" as const, label: "Pressure Handling", icon: Shield, color: "text-red-400" },
  { key: "creativeThinking" as const, label: "Creative Thinking", icon: Lightbulb, color: "text-yellow-400" },
  { key: "timeManagement" as const, label: "Time Management", icon: Clock, color: "text-green-400" },
  { key: "communication" as const, label: "Communication", icon: MessageCircle, color: "text-purple-400" },
  { key: "technicalSkills" as const, label: "Technical Skills", icon: Wrench, color: "text-cyan-400" },
];

const PerformanceBoard = ({ scores, onClose }: PerformanceBoardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 max-w-2xl mx-auto space-y-4 overflow-y-auto max-h-[80vh]"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <Star className="h-6 w-6 text-primary" />
          <h2 className="font-display text-2xl font-bold text-gradient-gold">Performance Report</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Overall Score: <span className="text-primary font-bold text-lg">{scores.overallScore}/10</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {metrics.map((m, i) => (
          <motion.div
            key={m.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <m.icon className={`h-4 w-4 ${m.color}`} />
                  <span className="text-sm font-medium text-foreground">{m.label}</span>
                  <span className="ml-auto text-sm font-bold text-primary">{scores[m.key]}/10</span>
                </div>
                <Progress value={scores[m.key] * 10} className="h-2" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {scores.strengths.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-400">💪 Strengths</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm text-muted-foreground space-y-1">
              {scores.strengths.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {scores.weaknesses.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-400">⚠️ Areas to Improve</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm text-muted-foreground space-y-1">
              {scores.weaknesses.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {scores.suggestions.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary">📌 Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm text-muted-foreground space-y-1">
              {scores.suggestions.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default PerformanceBoard;
