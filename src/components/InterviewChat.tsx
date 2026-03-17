import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import { Message } from "@/hooks/use-interview";
import { DOMAINS, DomainId } from "@/lib/interview-config";

interface InterviewChatProps {
  domain: DomainId;
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string) => void;
  onBack: () => void;
}

const InterviewChat = ({ domain, messages, isLoading, onSend, onBack }: InterviewChatProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const domainInfo = DOMAINS.find((d) => d.id === domain);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-glass border-b border-border px-4 py-3 flex items-center gap-3 shrink-0"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Crosshair className="h-5 w-5 text-primary" />
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-semibold text-sm text-foreground">InterviewLens</h2>
          <p className="text-xs text-muted-foreground truncate">
            {domainInfo?.label} Interview
          </p>
        </div>
        <div className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
          {messages.filter((m) => m.role === "user").length} responses
        </div>
      </motion.header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 shrink-0">
        <ChatInput onSend={onSend} disabled={isLoading} />
      </div>
    </div>
  );
};

export default InterviewChat;
