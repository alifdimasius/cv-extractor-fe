"use client";

import { useState, useEffect, useRef } from "react";
import {
  Container,
  Paper,
  TextInput,
  Button,
  Text,
  Group,
  ActionIcon,
} from "@mantine/core";
import {
  IconSend,
  IconRobot,
  IconUser,
  IconTrash,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import ReactMarkdown from "react-markdown";

// Emoji mapping
const emojiMap: { [key: string]: string } = {
  "[CV]": "📄",
  "[Email]": "📧",
  "[Briefcase]": "💼",
  "[Target]": "🎯",
  "[Star]": "⭐",
  "[Chart]": "📊",
  "[Person]": "👤",
  "[Memo]": "📝",
  "[Graduation Cap]": "🎓",
  "[Tools]": "🛠️",
  "[Trophy]": "🏆",
  "[Chart Up]": "📈",
  "[Light Bulb]": "💡",
};

// Function to convert text to emoji
const convertToEmoji = (text: string): string => {
  let result = text;
  Object.entries(emojiMap).forEach(([key, emoji]) => {
    // Escape special regex characters in the key
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(escapedKey, 'g'), emoji);
  });
  return result;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingHistory, setDeletingHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch("https://cvextractor.soljum.com/api/cv/chat/history");
      const data = await response.json();
      
      if (data.success) {
        // Reverse the history since BE returns latest first, but we want chronological order
        const reversedHistory = [...data.data.history].reverse();
        
        // Convert history to messages
        const historyMessages = reversedHistory.flatMap((item: any) => [
          {
            role: "user" as const,
            content: item.message,
            timestamp: item.createdAt,
          },
          {
            role: "assistant" as const,
            content: item.response,
            timestamp: item.createdAt,
          },
        ]);
        setMessages(historyMessages);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      notifications.show({
        title: "Error",
        message: "Failed to load chat history",
        color: "red",
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const deleteChatHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all chat messages? This action cannot be undone.")) {
      return;
    }

    setDeletingHistory(true);
    try {
      const response = await fetch("https://cvextractor.soljum.com/api/cv/chat/history", {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success || response.ok) {
        setMessages([]);
        notifications.show({
          title: "Success",
          message: "Chat cleared successfully",
          color: "green",
        });
      } else {
        throw new Error(data.message || "Failed to clear chat");
      }
    } catch (error) {
      console.error("Failed to clear chat:", error);
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to clear chat",
        color: "red",
      });
    } finally {
      setDeletingHistory(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://cvextractor.soljum.com/api/cv/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.data.response,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Chat error:", error);
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to send message",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col">
      <Container size="xl" className="flex-1 flex flex-col py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <Text size="xl" fw={700} className="text-gray-800 mb-2">
              AI Assistant
            </Text>
            <Text className="text-gray-600">
              Chat with our AI to analyze CVs and find job matches
            </Text>
          </div>
          <ActionIcon
            variant="light"
            color="red"
            onClick={deleteChatHistory}
            loading={deletingHistory}
            title="Clear all chat messages"
            size="lg"
          >
            <IconTrash size={20} />
          </ActionIcon>
        </div>

        {/* Chat Interface - Full Width */}
        <div className="flex flex-col h-full flex-1">
          <Paper shadow="sm" p="md" radius="md" withBorder className="flex flex-col h-full relative bg-white">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-2" style={{ minHeight: 0, maxHeight: 'calc(100vh - 220px)' }}>
              <div className="flex flex-col gap-4 max-w-4xl mx-auto py-2">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <IconRobot size={48} className="text-blue-400 mb-4" />
                    <Text size="lg" fw={500} color="dimmed">
                      Start a conversation
                    </Text>
                    <Text size="sm" color="dimmed" className="max-w-md mt-2">
                      Ask me anything about CVs, job matching, or career advice!
                    </Text>
                  </div>
                )}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`inline-flex items-start gap-2 max-w-[80%] w-fit ${
                        message.role === "user"
                          ? "bg-blue-50"
                          : "bg-gray-50"
                      } p-3 rounded-lg shadow-sm`}
                      style={{ wordBreak: 'break-word' }}
                    >
                      {message.role === "assistant" && (
                        <IconRobot size={20} className="text-blue-500 mt-1" />
                      )}
                      <div>
                        <Text size="sm" fw={500}>
                          {message.role === "user" ? "You" : "AI Assistant"}
                        </Text>
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => <p {...props} className="prose prose-sm max-w-none whitespace-pre-wrap" />,
                          }}
                        >
                          {convertToEmoji(message.content)}
                        </ReactMarkdown>
                      </div>
                      {message.role === "user" && (
                        <IconUser size={20} className="text-gray-500 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </Paper>
          {/* Input Area - sticky at bottom of viewport */}
          <div className="w-full bg-white border-t px-4 py-3 sticky bottom-0 left-0 z-20" style={{ boxShadow: '0 -2px 8px rgba(0,0,0,0.03)' }}>
            <Group>
              <TextInput
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                loading={loading}
                className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md px-6 py-2 text-lg font-semibold flex items-center gap-2 transition-all duration-200"
                style={{ minWidth: 56 }}
                leftSection={<IconSend size={22} className="-ml-1" />}
              >
                Send
              </Button>
            </Group>
          </div>
        </div>
      </Container>
    </div>
  );
} 