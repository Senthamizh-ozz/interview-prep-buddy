import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Crosshair, Volume2, VolumeX, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import PerformanceBoard from "@/components/PerformanceBoard";
import { Message } from "@/hooks/use-interview";
import { DOMAINS, DomainId } from "@/lib/interview-config";
import { PerformanceScores } from "@/hooks/use-performance";

interface InterviewChatProps {
  domain: DomainId;
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string) => void;
  onBack: () => void;
  onEndInterview: () => void;
  showPerformance: boolean;
  performanceScores: PerformanceScores | null;
  onClosePerformance: () => void;
  ttsEnabled: boolean;
  onToggleTts: () => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

const InterviewChat = ({
  domain, messages, isLoading, onSend, onBack,
  onEndInterview, showPerformance, performanceScores, onClosePerformance,
  ttsEnabled, onToggleTts, isSpeaking, onStopSpeaking,
}: InterviewChatProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const domainInfo = DOMAINS.find((d) => d.id === domain);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (showPerformance && performanceScores) {
    return (
      <div className="h-full flex flex-col">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-glass border-b border-border px-4 py-3 flex items-center gap-3 shrink-0"
        >
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-display font-semibold text-sm text-foreground">Performance Report</h2>
        </motion.header>
        <div className="flex-1 overflow-y-auto">
          <PerformanceBoard scores={performanceScores} onClose={onClosePerformance} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-glass border-b border-border px-4 py-3 flex items-center gap-3 shrink-0"
      >
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Crosshair className="h-5 w-5 text-primary" />
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-semibold text-sm text-foreground">InterviewLens</h2>
          <p className="text-xs text-muted-foreground truncate">{domainInfo?.label} Interview</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={isSpeaking ? onStopSpeaking : onToggleTts}
            className={`h-8 w-8 ${ttsEnabled ? "text-primary" : "text-muted-foreground"}`}
            title={ttsEnabled ? "Voice ON" : "Voice OFF"}
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <div className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            {messages.filter((m) => m.role === "user").length} responses
          </div>
          {messages.filter((m) => m.role === "user").length >= 3 && (
            <Button
              size="sm"
              variant="outline"
              onClick={onEndInterview}
              disabled={isLoading}
              className="text-xs h-7 gap-1 border-primary text-primary hover:bg-primary/10"
            >
              <Square className="h-3 w-3" />
              End
            </Button>
          )}
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
