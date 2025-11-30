import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse, FunctionDeclaration, Type, Tool } from "@google/genai";
import { MessageCircle, X, Send, Loader2, Sparkles, Minimize2, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';
import { MOCK_JOBS } from '../constants';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text?: string;
  type: 'text' | 'form';
  formData?: {
    jobTitle: string;
    jobId?: string;
  };
  isFormSubmitted?: boolean;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      type: 'text',
      text: 'Hello! I am the Muhteşem Assistant. I can help you find open roles or provide information about our recruitment services. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Define the Tool
  const applicationFormTool: FunctionDeclaration = {
    name: "show_application_form",
    description: "Display an application form to the user when they explicitly express interest in applying for a specific job title.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        jobTitle: {
          type: Type.STRING,
          description: "The title of the job the user wants to apply for.",
        },
        jobId: {
          type: Type.STRING,
          description: "The ID of the job if available.",
        },
      },
      required: ["jobTitle"],
    },
  };

  useEffect(() => {
    const initChat = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const systemInstruction = `You are a professional and helpful AI recruitment assistant for Muhteşem Technology. 
        Your goal is to assist candidates in finding jobs and help clients hire talent.
        
        Company Context:
        - Muhteşem Technology is a worldwide leader in technical recruitment.
        - Sectors: Tech, Engineering, Life Sciences, Government.
        
        Current Live Jobs Data:
        ${JSON.stringify(MOCK_JOBS, null, 2)}
        
        Guidelines:
        - Be concise, professional, and friendly.
        - If a user asks about jobs, search the provided job data and summarize options.
        - You have access to Google Search and Google Maps. Use them to answer questions about industry trends, salary benchmarks, or location information if relevant.
        - CRITICAL: If a user explicitly says they want to "apply" for a specific job mentioned in the context or conversation, YOU MUST CALL the "show_application_form" tool with the job title. Do not just tell them to go to the contact page.
        - If the user just asks generally how to apply without a specific job, direct them to the contact page.
        `;

        chatSessionRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction,
            tools: [
                { functionDeclarations: [applicationFormTool] },
                { googleSearch: {} },
                { googleMaps: {} }
            ],
          },
        });
      } catch (error) {
        console.error("Failed to initialize chat session", error);
      }
    };

    if (!chatSessionRef.current) {
      initChat();
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      type: 'text',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response: GenerateContentResponse = await chatSessionRef.current.sendMessage({ 
        message: input 
      });
      
      // Handle Function Calls (The Form Trigger)
      const functionCalls = response.functionCalls;
      
      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        if (call.name === 'show_application_form') {
           const args = call.args as any;
           
           const formMessage: ChatMessage = {
             id: (Date.now() + 1).toString(),
             role: 'model',
             type: 'form',
             formData: {
               jobTitle: args.jobTitle,
               jobId: args.jobId
             }
           };
           setMessages(prev => [...prev, formMessage]);

           // Inform the model we showed the form (optional context update)
           // We don't strictly need to wait for this response to render the UI
           chatSessionRef.current.sendMessage({
             message: `[System] Form for ${args.jobTitle} displayed to user.`
           });
        }
      } else {
        // Handle Standard Text Response
        const text = response.text || "I'm sorry, I couldn't generate a response.";
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          type: 'text',
          text: text
        };
        setMessages(prev => [...prev, botMessage]);
      }

    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        type: 'text',
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- Sub-component for the Form ---
  const ApplicationFormBubble = ({ message, index }: { message: ChatMessage, index: number }) => {
    const [formData, setFormData] = useState({ name: '', email: '', linkedin: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      // Simulate API submission
      setTimeout(() => {
        setIsSubmitting(false);
        // Lock this specific message form
        setMessages(prev => prev.map((msg, i) => 
          i === index ? { ...msg, isFormSubmitted: true } : msg
        ));
        
        // Add a confirmation message from bot
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'model',
          type: 'text',
          text: `Thanks ${formData.name}! We've received your initial details for the ${message.formData?.jobTitle} role. A recruiter will be in touch via email shortly.`
        }]);
      }, 1500);
    };

    if (message.isFormSubmitted) {
      return (
        <div className="bg-gray-800 rounded-2xl rounded-bl-none border border-gray-700 p-5 w-[85%]">
            <div className="flex items-center gap-3 text-green-400 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold text-sm">Application Sent</span>
            </div>
            <p className="text-gray-300 text-sm">
                You applied for <span className="font-semibold text-white">{message.formData?.jobTitle}</span>.
            </p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl rounded-bl-none p-5 shadow-lg w-[90%] border border-gray-200">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
            <div className="w-8 h-8 bg-vivid-red/10 rounded-full flex items-center justify-center text-vivid-red">
                <Briefcase className="w-4 h-4" />
            </div>
            <div>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Quick Apply</p>
                <h4 className="font-bold text-gray-900 text-sm leading-tight">{message.formData?.jobTitle}</h4>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <input 
                    required
                    type="text" 
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-vivid-red focus:ring-1 focus:ring-vivid-red transition-all"
                />
            </div>
            <div>
                <input 
                    required
                    type="email" 
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-vivid-red focus:ring-1 focus:ring-vivid-red transition-all"
                />
            </div>
            <div>
                <input 
                    type="text" 
                    placeholder="LinkedIn URL (Optional)"
                    value={formData.linkedin}
                    onChange={e => setFormData({...formData, linkedin: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-vivid-red focus:ring-1 focus:ring-vivid-red transition-all"
                />
            </div>
            
            <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-vivid-red text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wide hover:bg-red-700 transition-colors shadow-md flex items-center justify-center gap-2 mt-2"
            >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Submit Application <ArrowRight className="w-3 h-3" /></>}
            </button>
        </form>
      </div>
    );
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[60] p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen ? 'bg-gray-800 rotate-90' : 'bg-vivid-red hover:bg-red-700'
        }`}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-[60] w-[90vw] md:w-96 bg-vivid-darker border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-90 translate-y-10 pointer-events-none'
        }`}
        style={{ height: '550px', maxHeight: 'calc(100vh - 140px)' }}
      >
        {/* Header */}
        <div className="bg-vivid-red p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white" />
            <div>
              <h3 className="font-bold text-white text-sm">Muhteşem Assistant</h3>
              <p className="text-white/80 text-xs">Powered by Gemini</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-vivid-darker scrollbar-thin">
          {messages.map((msg, index) => {
            // RENDER FORM
            if (msg.type === 'form') {
              return (
                <div key={msg.id} className="flex justify-start">
                   <ApplicationFormBubble message={msg} index={index} />
                </div>
              );
            }

            // RENDER TEXT
            return (
                <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                        ? 'bg-vivid-red text-white rounded-br-none'
                        : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                    }`}
                >
                    {msg.text}
                </div>
                </div>
            );
          })}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-none px-4 py-3">
                <Loader2 className="w-5 h-5 text-vivid-red animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-900 border-t border-gray-800">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about jobs..."
              className="w-full bg-gray-800 text-white rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-vivid-red placeholder-gray-500 border border-gray-700"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-1 top-1 p-2 bg-vivid-red rounded-full text-white hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-vivid-red transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;