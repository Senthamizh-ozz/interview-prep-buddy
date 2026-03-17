import { useState, useCallback } from "react";

export interface PerformanceScores {
  problemSolving: number;
  pressureHandling: number;
  creativeThinking: number;
  timeManagement: number;
  communication: number;
  technicalSkills: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  overallScore: number;
}

export interface InterviewSession {
  id: string;
  domain: string;
  date: string;
  scores: PerformanceScores;
  questionCount: number;
}

const STORAGE_KEY = "interviewlens_sessions";

export function usePerformance() {
  const [sessions, setSessions] = useState<InterviewSession[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addSession = useCallback((session: InterviewSession) => {
    setSessions((prev) => {
      const updated = [session, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getAverageScores = useCallback((): PerformanceScores | null => {
    if (sessions.length === 0) return null;
    const avg = (key: keyof PerformanceScores) => {
      const nums = sessions.map((s) => s.scores[key] as number).filter((n) => typeof n === "number");
      return nums.length ? Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10 : 0;
    };
    return {
      problemSolving: avg("problemSolving"),
      pressureHandling: avg("pressureHandling"),
      creativeThinking: avg("creativeThinking"),
      timeManagement: avg("timeManagement"),
      communication: avg("communication"),
      technicalSkills: avg("technicalSkills"),
      strengths: sessions[0]?.scores.strengths || [],
      weaknesses: sessions[0]?.scores.weaknesses || [],
      suggestions: sessions[0]?.scores.suggestions || [],
      overallScore: avg("overallScore"),
    };
  }, [sessions]);

  const getTotalPoints = useCallback(() => {
    return sessions.reduce((total, s) => total + Math.round(s.scores.overallScore * 10), 0);
  }, [sessions]);

  const clearSessions = useCallback(() => {
    setSessions([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { sessions, addSession, getAverageScores, getTotalPoints, clearSessions };
}
