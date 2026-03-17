import { useState, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import { motion } from "framer-motion";
import { Play, Loader2, Code2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

const LANGUAGES = [
  { id: "javascript", label: "JavaScript", ext: javascript },
  { id: "python", label: "Python", ext: python },
  { id: "java", label: "Java", ext: java },
  { id: "cpp", label: "C++", ext: cpp },
] as const;

type LangId = (typeof LANGUAGES)[number]["id"];

const DEFAULT_CODE: Record<LangId, string> = {
  javascript: `// Write your solution here\nfunction solution(arr) {\n  // Your code\n  return arr;\n}\n\nconsole.log(solution([1, 2, 3]));`,
  python: `# Write your solution here\ndef solution(arr):\n    # Your code\n    return arr\n\nprint(solution([1, 2, 3]))`,
  java: `// Write your solution here\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}`,
  cpp: `// Write your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World" << endl;\n    return 0;\n}`,
};

const CodingPlatform = () => {
  const [language, setLanguage] = useState<LangId>("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const langConfig = LANGUAGES.find((l) => l.id === language)!;

  const handleLanguageChange = (lang: LangId) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang]);
    setFeedback(null);
  };

  const getFeedback = useCallback(async () => {
    setIsLoading(true);
    setFeedback(null);

    try {
      const { data, error } = await supabase.functions.invoke("interview-chat", {
        body: {
          messages: [
            {
              role: "system",
              content: `You are a code reviewer. Analyze the following ${language} code and provide structured feedback:
1. **Correctness**: Does the code work as intended?
2. **Time Complexity**: What is the time complexity?
3. **Space Complexity**: What is the space complexity?
4. **Code Quality**: Is it clean, readable, well-structured?
5. **Improvements**: Suggest specific improvements
6. **Score**: Rate the code /10

Be concise but thorough. Use markdown formatting.`,
            },
            {
              role: "user",
              content: `Review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
            },
          ],
        },
      });

      if (error) throw error;
      setFeedback(data.reply);
    } catch (err) {
      console.error("Code review failed:", err);
      setFeedback("Failed to get feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [code, language]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="surface-glass border-b border-border px-4 py-2 flex items-center gap-2 shrink-0">
        <Code2 className="h-4 w-4 text-primary" />
        <span className="font-display font-semibold text-sm text-foreground">Live Coding</span>
        <div className="flex-1" />
        <div className="flex gap-1">
          {LANGUAGES.map((lang) => (
            <Button
              key={lang.id}
              variant={language === lang.id ? "default" : "ghost"}
              size="sm"
              onClick={() => handleLanguageChange(lang.id)}
              className={`text-xs h-7 ${
                language === lang.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {lang.label}
            </Button>
          ))}
        </div>
        <Button
          size="sm"
          onClick={getFeedback}
          disabled={isLoading || !code.trim()}
          className="gap-1.5 ml-2"
        >
          {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          Get Feedback
        </Button>
      </div>

      {/* Editor + Feedback */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 overflow-hidden">
          <CodeMirror
            value={code}
            height="100%"
            theme={oneDark}
            extensions={[langConfig.ext()]}
            onChange={setCode}
            className="h-full text-sm"
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              autocompletion: true,
            }}
          />
        </div>

        {/* Feedback Panel */}
        {(feedback || isLoading) && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-[40%] w-full border-t lg:border-t-0 lg:border-l border-border overflow-y-auto bg-card"
          >
            <Card className="border-0 rounded-none h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  AI Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing your code...
                  </div>
                ) : feedback ? (
                  <div className="prose prose-sm prose-invert max-w-none text-sm [&_p]:mb-2 [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-primary">
                    <ReactMarkdown>{feedback}</ReactMarkdown>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CodingPlatform;
