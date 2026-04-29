import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import {
  Send,
  Bot,
  User,
  Loader2,
  Globe,
  Sparkles,
  Menu,
  X,
  Plus,
  MessageSquare,
  Trash2,
} from "lucide-react";
import Markdown from "react-markdown";
import { cn } from "../components/Layout";
import { Logo } from "../components/Logo";
import { taxKnowledgeBase } from "../data/taxKnowledge";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const TRANSLATIONS = {
  English: {
    welcome:
      "Hello! I am the **MyTaxGenius Assistant**. I can help you understand Nigerian tax, explain how to get a TIN, or guide you. How can I help you today?",
    prompts: [
      "What is a TIN?",
      "How do I pay Market Tax?",
      "Calculate my PAYE",
      "What is VAT?",
    ],
  },
  Pidgin: {
    welcome:
      "Howfa! I be **MyTaxGenius Assistant**. I fit help you understand tax, explain how to get TIN, or guide you. Wetin I fit do for you today?",
    prompts: [
      "Wetin be TIN?",
      "How I go pay Market Tax?",
      "Calculate my PAYE",
      "Wetin be VAT?",
    ],
  },
  Yoruba: {
    welcome:
      "Bawo ni! Emi ni **Oluranlowo MyTaxGenius**. Mo le ran e lowo lati ni oye ori (tax), bawo ni o se le gba TIN, tabi fun e ni itosona. Bawo ni mo se le ran e lowo loni?",
    prompts: [
      "Kini TIN?",
      "Bawo ni mo san owo ori oja?",
      "Se isiro PAYE mi",
      "Kini VAT?",
    ],
  },
  Hausa: {
    welcome:
      "Sannu! Ni ne **Mataimakin MyTaxGenius**. Zan iya taimaka muku gane haraji (tax), yadda za ku sami TIN, ko in yi muku jagora. Yaya zan iya taimaka muku a yau?",
    prompts: [
      "Menene TIN?",
      "Yaya zan biya harajin kasuwa?",
      "Yi lissafin PAYE na",
      "Menene VAT?",
    ],
  },
  Igbo: {
    welcome:
      "Nnoo! Abum **onye enyemaka MyTaxGenius**. Enwere m ike inyere gị aka ịghọta ụtụ isi (tax), kọwaa otu ị ga-esi nweta TIN, ma ọ bụ duzie gị. Kedu otu m ga-esi nyere gị aka taa?",
    prompts: [
      "Kedu ihe bụ TIN?",
      "Kedu ka m ga-esi kwụọ ụtụ ahịa?",
      "Gbakọọ PAYE m",
      "Kedu ihe bụ VAT?",
    ],
  },
};

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

const CHAT_SESSIONS_KEY = "mytaxgenius_chat_sessions";
const CHAT_TOKEN_USAGE_KEY = "mytaxgenius_token_usage";

const BotAvatar = ({ className }: { className?: string }) => (
  <Logo className={className} />
);

export default function Chat() {
  const [language, setLanguage] =
    useState<keyof typeof TRANSLATIONS>("English");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_SESSIONS_KEY);
      if (saved) return JSON.parse(saved);
      // Migrate old single history if it exists
      const oldHistory = localStorage.getItem("mytaxgenius_chat_history");
      if (oldHistory) {
        const parsed = JSON.parse(oldHistory);
        if (parsed && parsed.length > 0) {
          const newSession = {
            id: Date.now().toString(),
            title: parsed[1]?.content?.slice(0, 30) || "New Chat",
            messages: parsed,
            updatedAt: Date.now(),
          };
          return [newSession];
        }
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
    return [];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    () => {
      return sessions.length > 0 ? sessions[0].id : null;
    },
  );

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [tokenUsage, setTokenUsage] = useState(0);
  const TOKEN_LIMIT_PER_DAY = 20000;

  // Derive current messages
  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const messages = currentSession?.messages || [
    {
      id: "welcome",
      role: "model",
      content: TRANSLATIONS[language].welcome,
    },
  ];

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
    } else {
      localStorage.removeItem(CHAT_SESSIONS_KEY);
      setCurrentSessionId(null);
    }
  }, [sessions]);

  useEffect(() => {
    // Load today's token usage
    const today = new Date().toISOString().split("T")[0];
    const usageData = JSON.parse(
      localStorage.getItem(CHAT_TOKEN_USAGE_KEY) || "{}",
    );

    if (usageData.date !== today) {
      setTokenUsage(0);
      localStorage.setItem(
        CHAT_TOKEN_USAGE_KEY,
        JSON.stringify({ date: today, tokens: 0 }),
      );
    } else {
      setTokenUsage(usageData.tokens);
    }
  }, []);

  const updateTokens = (textLength: number) => {
    const estimatedTokens = Math.ceil(textLength / 4);
    setTokenUsage((prev) => {
      const newUsage = prev + estimatedTokens;
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem(
        CHAT_TOKEN_USAGE_KEY,
        JSON.stringify({ date: today, tokens: newUsage }),
      );
      return newUsage;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const updateCurrentSession = (
    newMessages: Message[],
    newTitle?: string,
    overrideSessionId?: string | null,
  ) => {
    const targetId =
      overrideSessionId !== undefined ? overrideSessionId : currentSessionId;

    if (!targetId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: newTitle || newMessages[1]?.content?.slice(0, 30) || "New Chat",
        messages: newMessages,
        updatedAt: Date.now(),
      };
      setSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      return newSession.id;
    } else {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetId
            ? {
                ...s,
                messages: newMessages,
                updatedAt: Date.now(),
                title: newTitle || s.title,
              }
            : s,
        ),
      );
      return targetId;
    }
  };

  const createNewChat = () => {
    setCurrentSessionId(null);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (currentSessionId === id) setCurrentSessionId(null);
  };

  const translateMessages = async (
    targetLang: keyof typeof TRANSLATIONS,
    historyToTranslate: Message[],
  ) => {
    try {
      setIsTranslating(true);
      const prompt = `Translate the 'content' of the following JSON array of chat messages into ${targetLang}. 
      Keep the JSON structure exactly the same, only change the value of the 'content' field in each object.
      If it's code, or a very specific tax term, keep it logically intact.
      Return ONLY valid JSON array. Do not wrap in markdown \`\`\`json.
      
      Messages:
      ${JSON.stringify(historyToTranslate)}`;

      const res = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = res.text || "[]";
      const parsed = JSON.parse(text);
      if (
        Array.isArray(parsed) &&
        parsed.length === historyToTranslate.length
      ) {
        updateCurrentSession(parsed);
      }
    } catch (err) {
      console.error("Translation failed", err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLanguageChange = (lang: keyof typeof TRANSLATIONS) => {
    if (lang === language) return;
    setLanguage(lang);

    if (messages.length <= 1) {
      // Just update the welcome string
      if (currentSessionId) {
        updateCurrentSession([
          { id: "welcome", role: "model", content: TRANSLATIONS[lang].welcome },
        ]);
      }
    } else {
      translateMessages(lang, messages);
    }
  };

  const handleSend = async (e?: React.FormEvent, presetInput?: string) => {
    if (e) e.preventDefault();
    const userMsg = presetInput || input.trim();
    if (!userMsg || isLoading || isTranslating) return;

    if (tokenUsage >= TOKEN_LIMIT_PER_DAY) {
      const newMessages: Message[] = [
        ...messages,
        {
          id: Date.now().toString(),
          role: "model" as const,
          content: `**Daily Limit Reached!** 🚨\n\nYou have exceeded your free limit of ${TOKEN_LIMIT_PER_DAY} tokens for today. Please **[Register / Upgrade to Premium](/signup)** to continue chatting or come back tomorrow!`,
        },
      ];
      updateCurrentSession(newMessages);
      setInput("");
      return;
    }

    setInput("");
    const tempMessages: Message[] = [
      ...messages,
      { id: Date.now().toString(), role: "user" as const, content: userMsg },
    ];
    const activeSessionId = updateCurrentSession(
      tempMessages,
      messages.length <= 1 ? userMsg.slice(0, 30) : undefined,
    );
    setIsLoading(true);

    try {
      const contents = tempMessages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        }));

      const systemInstruction = `You are MyTaxGenius, an independent, AI-powered tax assistant designed to help Nigerians.
IMPORTANT DISCLAIMER: You are independent but highly knowledgeable. 

CRITICAL FORMATTING RULES:
1. Format your responses beautifully and structurally like an expert professional AI.
2. Use **bold text** to highlight key financial terms, categories, and metrics.
3. Use clear bullet points (-) or numbered lists (1. 2.) to break down steps.
4. Keep paragraphs short and highly readable.
5. Use ### Headings when shifting to a new major point.
6. INCLUDE RELEVANT LINKS: Add relevant actionable links affiliated with the NRS (Nigeria Revenue Service) or FIRS (e.g., https://taxpromax.firs.gov.ng or https://www.firs.gov.ng) in your replies to make them very trustworthy and smart. Provide context on where to click.

CRITICAL REGIONAL ADAPTATION & AUTO-TRANSLATION:
1. The user's active UI interface language is currently set to ${language}, use ${language} to structure your response.
2. Be a fluent polyglot! If the user greets or asks a question in Pidgin, Yoruba, Hausa or Igbo, adjust your tone natively to their language.
3. Your audience includes market women and informal traders across Nigeria.
4. Never use complex accounting jargon. Break down concepts like TIN, PAYE, CIT, VAT, and Presumptive Tax as if explaining to a beginner. Give practical, step-by-step guidance.

=== CUSTOM KNOWLEDGE BASE (USE THIS FOR FACTS) ===
${taxKnowledgeBase}
==================================================`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
        config: {
          systemInstruction,
        },
      });

      const responseText =
        response.text || "I am sorry, I could not process that request.";
      updateTokens(userMsg.length + responseText.length);

      updateCurrentSession(
        [
          ...tempMessages,
          {
            id: Date.now().toString(),
            role: "model" as const,
            content: responseText,
          },
        ],
        undefined,
        activeSessionId,
      );
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage = error?.message || "Unknown connection error.";
      updateCurrentSession(
        [
          ...tempMessages,
          {
            id: Date.now().toString(),
            role: "model" as const,
            content: `**CRITICAL ERROR:** We hit a roadblock connecting to the Google AI servers. \n\n**Error details:** \`${errorMessage}\` \n\nPlease try again.`,
          },
        ],
        undefined,
        activeSessionId,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "absolute md:relative z-30 h-full w-[260px] bg-[#f9f9f9] dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out",
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-3 flex-shrink-0 flex items-center justify-between">
          <button
            onClick={createNewChat}
            className="flex-1 flex items-center space-x-2 hover:bg-gray-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 p-2.5 rounded-lg transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New chat</span>
          </button>
          <button
            className="md:hidden ml-2 p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-4">
          {sessions.length === 0 ? (
            <div className="text-sm text-gray-400 mt-4 px-2">
              No recent chats
            </div>
          ) : (
            <div className="text-xs font-semibold text-gray-500 mt-4 mb-2 px-2">
              Recents
            </div>
          )}
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => {
                setCurrentSessionId(session.id);
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className={cn(
                "group p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors text-sm",
                currentSessionId === session.id
                  ? "bg-gray-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  : "hover:bg-gray-200 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
              )}
            >
              <div className="flex items-center space-x-2 overflow-hidden">
                <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-70" />
                <span className="truncate">
                  {session.title}
                </span>
              </div>
              <button
                onClick={(e) => deleteSession(session.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Clear All Chats */}
        {sessions.length > 0 && (
          <div className="p-3 border-t border-gray-200 dark:border-slate-800">
             <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all chat history?')) {
                    setSessions([]);
                    setCurrentSessionId(null);
                  }
                }}
                className="flex items-center w-full space-x-2 hover:bg-gray-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 p-2.5 rounded-lg transition-colors font-medium text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear chat history</span>
             </button>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header Area / Controls */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <button
              className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Logo className="w-6 h-6" />
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 hidden sm:block">
              MyTaxGenius Intelligence
            </h1>
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-auto">
            <Globe className="w-4 h-4 text-gray-400 hidden sm:flex mr-1" />
            {Object.keys(TRANSLATIONS).map((lang) => (
              <button
                key={lang}
                disabled={isTranslating}
                onClick={() =>
                  handleLanguageChange(lang as keyof typeof TRANSLATIONS)
                }
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                  language === lang
                    ? "bg-slate-900 text-white dark:bg-emerald-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700",
                  isTranslating && "opacity-50 cursor-not-allowed",
                )}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth relative">
          {/* Main loader for language translation */}
          {isTranslating && (
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-6 flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
                <p className="font-semibold text-slate-800 dark:text-white">
                  Translating Chat to {language}...
                </p>
              </div>
            </div>
          )}

          <div className="max-w-4xl mx-auto pt-8 pb-32 px-4 sm:px-6">
            {/* Welcome / Suggestions block shown when chat is empty or fresh */}
            {messages.length <= 1 && (
              <div className="flex flex-col items-center justify-center text-center mt-10 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-6 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                  <BotAvatar className="w-10 h-10 object-contain drop-shadow-md" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  How can I help you today?
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mb-8">
                  I am your AI tax assistant specialized in Nigerian tax law.
                  Ask me about TIN, VAT, PAYE, or the new 2025 reforms.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                  {TRANSLATIONS[language].prompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(undefined, prompt)}
                      disabled={isLoading || isTranslating}
                      className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-colors flex items-center group"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {prompt}
                      </span>
                      <Sparkles className="w-4 h-4 ml-auto text-gray-300 dark:text-slate-700 group-hover:text-emerald-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actual Messages */}
            <div className="space-y-6 md:space-y-8">
              {messages.map((msg, index) => {
                // Skip the first welcome message if we're rendering normal chat UI
                if (index === 0 && messages.length <= 1) return null;

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex w-full animate-in fade-in slide-in-from-bottom-2",
                      msg.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    {msg.role === "model" && (
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center flex-shrink-0 mr-4 mt-1 overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
                        <BotAvatar className="w-5 h-5 object-contain" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[85%] md:max-w-[75%]",
                        msg.role === "user"
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-5 py-3.5 rounded-3xl rounded-tr-sm"
                          : "text-slate-800 dark:text-slate-200 py-2 leading-relaxed",
                      )}
                    >
                      {msg.role === "user" ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="markdown-body prose prose-slate dark:prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 focus:outline-none max-w-none">
                          <Markdown>{msg.content}</Markdown>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex w-full justify-start animate-pulse mt-4">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center flex-shrink-0 mr-4 mt-1 overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
                    <BotAvatar className="w-5 h-5 object-contain" />
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 py-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">
                      Drafting response...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Floating Input Area */}
        <div className="w-full bg-gradient-to-t from-white via-white to-transparent dark:from-slate-950 dark:via-slate-950 pt-6 pb-6 px-4 shrink-0 z-10 bottom-0 mt-auto">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={(e) => handleSend(e)}
              className="relative flex items-end shadow-[0_0_40px_rgba(0,0,0,0.05)] dark:shadow-[0_0_40px_rgba(0,0,0,0.3)] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/50 transition-shadow"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Ask anything in ${language}...`}
                className="w-full max-h-32 min-h-[56px] py-4 pl-6 pr-14 bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-slate-100 placeholder-slate-500"
                rows={1}
                disabled={isLoading || isTranslating}
              />
              <button
                type="submit"
                disabled={
                  isLoading ||
                  isTranslating ||
                  !input.trim() ||
                  tokenUsage >= TOKEN_LIMIT_PER_DAY
                }
                className="absolute right-2 bottom-2 p-2.5 bg-black hover:bg-gray-800 disabled:bg-gray-300 dark:bg-white dark:hover:bg-gray-200 dark:disabled:bg-slate-700 text-white dark:text-slate-900 dark:disabled:text-slate-500 rounded-full transition-colors flex items-center justify-center touch-manipulation"
              >
                <Send className="w-5 h-5 -ml-0.5" />
              </button>
            </form>
            <div className="text-center mt-3 text-xs text-slate-400 dark:text-slate-500">
              AI can make mistakes. Consider verifying important tax
              calculations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
