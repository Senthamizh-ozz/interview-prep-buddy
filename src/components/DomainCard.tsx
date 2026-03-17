import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface DomainCardProps {
  label: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  index: number;
}

const DomainCard = ({ label, description, icon: Icon, onClick, index }: DomainCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="surface-glass rounded-xl p-6 text-left transition-colors hover:bg-surface-hover group cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-primary/10 p-2.5 text-primary group-hover:glow-gold transition-shadow">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-foreground text-lg">{label}</h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.button>
  );
};

export default DomainCard;
