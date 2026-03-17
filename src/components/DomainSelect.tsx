import { motion } from "framer-motion";
import { DOMAINS, DomainId } from "@/lib/interview-config";
import DomainCard from "@/components/DomainCard";
import { Crosshair } from "lucide-react";

interface DomainSelectProps {
  onSelect: (domain: DomainId) => void;
}

const DomainSelect = ({ onSelect }: DomainSelectProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <Crosshair className="h-8 w-8 text-primary" />
          <h1 className="font-display text-4xl font-bold text-gradient-gold">InterviewLens</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Select your interview domain to begin a realistic mock interview.
        </p>
      </motion.div>

      <div className="w-full max-w-2xl grid gap-3">
        {DOMAINS.map((domain, i) => (
          <DomainCard
            key={domain.id}
            label={domain.label}
            description={domain.description}
            icon={domain.icon}
            index={i}
            onClick={() => onSelect(domain.id)}
          />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-xs text-muted-foreground"
      >
        AI-powered • Adaptive difficulty • Real interview pressure
      </motion.p>
    </div>
  );
};

export default DomainSelect;
