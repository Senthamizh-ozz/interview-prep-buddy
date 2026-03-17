import { useState, useCallback, useEffect } from "react";
import { DomainId, SYSTEM_PROMPT } from "@/lib/interview-config";
import { supabase } from "@/integrations/supabase/client";
import { PerformanceScores } from "@/hooks/use-performance";
import { useSpeech } from "@/hooks/use-speech";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export function useInterview() {
  const [domain, setDomain] = useState<DomainId | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [performanceScores, setPerformanceScores] = useState<PerformanceScores | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const { speak, stop, isSpeaking } = useSpeech();

  // Speak new assistant messages
  useEffect(() => {
    if (!ttsEnabled || messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role === "assistant") {
      speak(last.content);
    }
  }, [messages, ttsEnabled, speak]);

  const getDomainContext = (d: DomainId) => {
    const map: Record<DomainId, string> = {
      dsa: "DSA (Data Structures & Algorithms). Ask coding problems, focus on logic, approach, time/space complexity, optimizations and edge cases.",
      webdev: "Web Development. Ask real-world practical questions covering APIs, frontend/backend, architecture.",
      corecs: "Core CS (DBMS, OS, CN). Ask concepts, definitions, follow-ups, and real-world use cases.",
      hr: "HR/Behavioral. Ask situational questions, evaluate clarity, confidence, storytelling.",
      resume: "Resume-Based. Ask questions about the user's projects and tech stack. Start by asking them to briefly describe their most recent project.",
    };
    return map[d];
  };

  const startInterview = useCallback(async (selectedDomain: DomainId) => {
    setDomain(selectedDomain);
    setIsLoading(true);
    setShowPerformance(false);
    setPerformanceScores(null);

    const systemMessage = `${SYSTEM_PROMPT}\n\nThe user selected domain: ${getDomainContext(selectedDomain)}\n\nStart now with your first interview question.`;

    try {
      const { data, error } = await supabase.functions.invoke("interview-chat", {
        body: {
          messages: [{ role: "system", content: systemMessage }],
        },
      });
      if (error) throw error;
      setMessages([{ role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error("Failed to start interview:", err);
      setMessages([{ role: "assistant", content: "Let's begin. Tell me about yourself and your background briefly, then we'll dive into questions." }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!domain) return;

    const userMessage: Message = { role: "user", content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    const systemMessage = `${SYSTEM_PROMPT}\n\nThe user selected domain: ${getDomainContext(domain)}`;

    try {
      const { data, error } = await supabase.functions.invoke("interview-chat", {
        body: {
          messages: [
            { role: "system", content: systemMessage },
            ...updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
        },
      });
      if (error) throw error;
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I encountered an issue. Could you repeat your answer?" },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [domain, messages]);

  const endInterview = useCallback(async () => {
    if (!domain || messages.length < 2) return;
    setIsLoading(true);
    stop();

    try {
      const { data, error } = await supabase.functions.invoke("interview-chat", {
        body: {
          messages: [
            {
              role: "system",
              content: `You are evaluating an interview. Based on the conversation below, provide a JSON object (no markdown, just raw JSON) with these exact fields:
{
  "problemSolving": <number 1-10>,
  "pressureHandling": <number 1-10>,
  "creativeThinking": <number 1-10>,
  "timeManagement": <number 1-10>,
  "communication": <number 1-10>,
  "technicalSkills": <number 1-10>,
  "strengths": [<string>, ...],
  "weaknesses": [<string>, ...],
  "suggestions": [<string>, ...],
  "overallScore": <number 1-10>
}
Evaluate fairly based on the candidate's responses.`,
            },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
          ],
        },
      });

      if (error) throw error;

      // Parse the JSON from the reply
      const jsonStr = data.reply.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      const scores: PerformanceScores = JSON.parse(jsonStr);
      setPerformanceScores(scores);
      setShowPerformance(true);
      return scores;
    } catch (err) {
      console.error("Failed to evaluate:", err);
      // Fallback scores
      const fallback: PerformanceScores = {
        problemSolving: 5, pressureHandling: 5, creativeThinking: 5,
        timeManagement: 5, communication: 5, technicalSkills: 5,
        strengths: ["Participated in the interview"],
        weaknesses: ["Could not evaluate fully"],
        suggestions: ["Try answering more questions"],
        overallScore: 5,
      };
      setPerformanceScores(fallback);
      setShowPerformance(true);
      return fallback;
    } finally {
      setIsLoading(false);
    }
  }, [domain, messages, stop]);

  const reset = useCallback(() => {
    stop();
    setDomain(null);
    setMessages([]);
    setIsLoading(false);
    setShowPerformance(false);
    setPerformanceScores(null);
  }, [stop]);

  const toggleTts = useCallback(() => {
    setTtsEnabled((prev) => {
      if (prev) stop();
      return !prev;
    });
  }, [stop]);

  return {
    domain, messages, isLoading, startInterview, sendMessage, reset,
    endInterview, showPerformance, performanceScores, setShowPerformance,
    ttsEnabled, toggleTts, isSpeaking, stopSpeaking: stop,
  };
}
