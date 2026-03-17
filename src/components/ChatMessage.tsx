import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isAI = role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isAI ? "" : "flex-row-reverse"}`}
    >
      <div
        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
          isAI ? "bg-primary/15 text-primary" : "bg-secondary text-secondary-foreground"
        }`}
      >
        {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAI
            ? "bg-chat-ai text-foreground border border-border"
            : "bg-chat-user text-foreground"
        }`}
      >
        <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0 [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-primary [&_pre]:bg-secondary [&_pre]:p-3 [&_pre]:rounded-lg">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
