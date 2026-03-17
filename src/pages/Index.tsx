import DomainSelect from "@/components/DomainSelect";
import InterviewChat from "@/components/InterviewChat";
import { useInterview } from "@/hooks/use-interview";

const Index = () => {
  const { domain, messages, isLoading, startInterview, sendMessage, reset } = useInterview();

  if (!domain) {
    return <DomainSelect onSelect={startInterview} />;
  }

  return (
    <InterviewChat
      domain={domain}
      messages={messages}
      isLoading={isLoading}
      onSend={sendMessage}
      onBack={reset}
    />
  );
};

export default Index;
