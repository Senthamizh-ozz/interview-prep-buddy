import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const TypingIndicator = () => (
  <div className="flex gap-3">
    <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-primary/15 text-primary">
      <Bot className="h-4 w-4" />
    </div>
    <div className="bg-chat-ai border border-border rounded-2xl px-4 py-3 flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-2 w-2 rounded-full bg-muted-foreground"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  </div>
);

export default TypingIndicator;
