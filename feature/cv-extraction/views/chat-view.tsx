"use client";

import { useState, useEffect, useRef } from "react";
import {
  Container,
  Paper,
  TextInput,
  Button,
  Text,
  Group,
  ScrollArea,
  Loader,
  Badge,
  Select,
  ActionIcon,
  Divider,
} from "@mantine/core";
import {
  IconSend,
  IconRobot,
  IconUser,
  IconRefresh,
  IconSearch,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

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
  cvId?: string;
  cvName?: string;
};

type ChatHistory = {
  message: string;
  response: string;
  cvId?: {
    _id: string;
    fileName: string;
    personalInfo: {
      name: string;
    };
  };
  functionCalls?: Array<{
    name: string;
    arguments: any;
    result: any;
  }>;
  createdAt: string;
};

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCV, setSelectedCV] = useState<string | null>(null);
  const [cvOptions, setCvOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load CV options
  useEffect(() => {
    loadCVOptions();
  }, []);

  // Load chat history
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

  const loadCVOptions = async () => {
    try {
      const response = await fetch("https://cvextractor.soljum.com/api/cv/ids");
      const data = await response.json();
      
      if (data.success) {
        const options = await Promise.all(
          data.data.ids.map(async (id: string) => {
            const details = await fetch(`https://cvextractor.soljum.com/api/cv/${id}`);
            const cvData = await details.json();
            return {
              value: id,
              label: cvData.success ? cvData.data.personalInfo.name : id,
            };
          })
        );
        setCvOptions(options);
      }
    } catch (error) {
      console.error("Failed to load CV options:", error);
    }
  };

  const loadChatHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch("https://cvextractor.soljum.com/api/cv/chat/history");
      const data = await response.json();
      
      if (data.success) {
        setChatHistory(data.data.history);
        // Convert history to messages
        const historyMessages = data.data.history.flatMap((item: ChatHistory) => [
          {
            role: "user" as const,
            content: item.message,
            timestamp: item.createdAt,
            cvId: item.cvId?._id,
            cvName: item.cvId?.personalInfo.name,
          },
          {
            role: "assistant" as const,
            content: item.response,
            timestamp: item.createdAt,
            cvId: item.cvId?._id,
            cvName: item.cvId?.personalInfo.name,
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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
      cvId: selectedCV || undefined,
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
          cvId: selectedCV,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.data.response,
          timestamp: new Date().toISOString(),
          cvId: selectedCV || undefined,
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
        <div className="mb-6">
          <Text size="xl" fw={700} className="text-gray-800 mb-2">
            AI Assistant
          </Text>
          <Text className="text-gray-600">
            Chat with our AI to analyze CVs and find job matches
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1">
          {/* Chat Interface */}
          <div className="md:col-span-3 flex flex-col h-full">
            <Paper shadow="sm" p="md" radius="md" withBorder className="flex flex-col h-full relative bg-white">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-2" style={{ minHeight: 0, maxHeight: 'calc(100vh - 220px)' }}>
                <div className="flex flex-col gap-4 max-w-2xl mx-auto py-2">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`inline-flex items-start gap-2 max-w-[90%] w-fit ${
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
                          <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                            {convertToEmoji(message.content)}
                          </Text>
                          {message.cvName && (
                            <Badge size="sm" color="blue" className="mt-2">
                              {message.cvName}
                            </Badge>
                          )}
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
                <Select
                  placeholder="Select CV (optional)"
                  data={cvOptions}
                  value={selectedCV}
                  onChange={setSelectedCV}
                  className="flex-1"
                  clearable
                />
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

          {/* History Panel */}
          <div className="md:col-span-1">
            <Paper shadow="sm" p="md" radius="md" withBorder className="h-full">
              <div className="flex justify-between items-center mb-4">
                <Text fw={600}>Chat History</Text>
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={loadChatHistory}
                  loading={loadingHistory}
                >
                  <IconRefresh size={16} />
                </ActionIcon>
              </div>
              <ScrollArea className="h-[calc(100%-40px)]">
                {chatHistory.map((item, index) => (
                  <div key={index} className="mb-4">
                    <Text size="sm" fw={500} className="text-gray-700">
                      {item.cvId?.personalInfo.name || "General Query"}
                    </Text>
                    <Text size="xs" className="text-gray-500 mb-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>
                    <Text size="sm" lineClamp={2}>
                      {convertToEmoji(item.message)}
                    </Text>
                    {index < chatHistory.length - 1 && (
                      <Divider my="sm" />
                    )}
                  </div>
                ))}
              </ScrollArea>
            </Paper>
          </div>
        </div>
      </Container>
    </div>
  );
} 