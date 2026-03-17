import { useState } from "react";
import DomainSelect from "@/components/DomainSelect";
import InterviewChat from "@/components/InterviewChat";
import CodingPlatform from "@/components/CodingPlatform";
import ProfileSection from "@/components/ProfileSection";
import AppNavbar, { AppTab } from "@/components/AppNavbar";
import { useInterview } from "@/hooks/use-interview";
import { usePerformance, InterviewSession } from "@/hooks/use-performance";

const Index = () => {
  const [activeTab, setActiveTab] = useState<AppTab>("interview");
  const interview = useInterview();
  const performance = usePerformance();

  const handleEndInterview = async () => {
    const scores = await interview.endInterview();
    if (scores && interview.domain) {
      const session: InterviewSession = {
        id: Date.now().toString(),
        domain: interview.domain,
        date: new Date().toLocaleDateString(),
        scores,
        questionCount: interview.messages.filter((m) => m.role === "user").length,
      };
      performance.addSession(session);
    }
  };

  const handleBack = () => {
    interview.reset();
  };

  return (
    <div className="h-screen flex flex-col">
      <AppNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalPoints={performance.getTotalPoints()}
      />

      <div className="flex-1 overflow-hidden">
        {activeTab === "interview" && (
          <>
            {!interview.domain ? (
              <div className="h-full overflow-y-auto">
                <DomainSelect onSelect={interview.startInterview} />
              </div>
            ) : (
              <InterviewChat
                domain={interview.domain}
                messages={interview.messages}
                isLoading={interview.isLoading}
                onSend={interview.sendMessage}
                onBack={handleBack}
                onEndInterview={handleEndInterview}
                showPerformance={interview.showPerformance}
                performanceScores={interview.performanceScores}
                onClosePerformance={() => interview.setShowPerformance(false)}
                ttsEnabled={interview.ttsEnabled}
                onToggleTts={interview.toggleTts}
                isSpeaking={interview.isSpeaking}
                onStopSpeaking={interview.stopSpeaking}
              />
            )}
          </>
        )}

        {activeTab === "coding" && <CodingPlatform />}

        {activeTab === "profile" && (
          <div className="h-full overflow-y-auto">
            <ProfileSection
              sessions={performance.sessions}
              averageScores={performance.getAverageScores()}
              totalPoints={performance.getTotalPoints()}
              onClear={performance.clearSessions}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
