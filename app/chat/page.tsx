import { ChatView } from "@/feature/cv-extraction/views/chat-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Chat | CV Extractor",
  description: "Chat with our AI to analyze CVs and find job matches",
};

export default function ChatPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <ChatView />
    </div>
  );
} 