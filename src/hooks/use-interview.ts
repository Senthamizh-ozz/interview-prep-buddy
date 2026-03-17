import { useState, useCallback } from "react";
import { DomainId, SYSTEM_PROMPT } from "@/lib/interview-config";
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export function useInterview() {
  const [domain, setDomain] = useState<DomainId | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

    const systemMessage = `${SYSTEM_PROMPT}\n\nThe user selected domain: ${getDomainContext(selectedDomain)}\n\nStart now with your first interview question.`;

    try {
      const { data, error } = await supabase.functions.invoke("interview-chat", {
        body: {
          messages: [
            { role: "system", content: systemMessage },
          ],
        },
      });

      if (error) throw error;

      const aiMessage: Message = { role: "assistant", content: data.reply };
      setMessages([aiMessage]);
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

  const reset = useCallback(() => {
    setDomain(null);
    setMessages([]);
    setIsLoading(false);
  }, []);

  return { domain, messages, isLoading, startInterview, sendMessage, reset };
}
