import { Crosshair, MessageSquare, Code2, User, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AppTab = "interview" | "coding" | "profile";

interface AppNavbarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  totalPoints: number;
}

const tabs = [
  { id: "interview" as AppTab, label: "Interview", icon: MessageSquare },
  { id: "coding" as AppTab, label: "Live Code", icon: Code2 },
  { id: "profile" as AppTab, label: "Profile", icon: User },
];

const AppNavbar = ({ activeTab, onTabChange, totalPoints }: AppNavbarProps) => {
  return (
    <nav className="surface-glass border-b border-border px-4 py-2 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        <Crosshair className="h-5 w-5 text-primary" />
        <span className="font-display font-bold text-sm text-gradient-gold">InterviewLens</span>
      </div>

      <div className="flex items-center gap-1">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange(tab.id)}
            className={`gap-1.5 text-xs ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-primary font-semibold bg-primary/10 px-2.5 py-1 rounded-full">
        <Trophy className="h-3.5 w-3.5" />
        {totalPoints} pts
      </div>
    </nav>
  );
};

export default AppNavbar;
