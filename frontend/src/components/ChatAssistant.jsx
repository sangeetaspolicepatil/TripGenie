import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Activity } from 'lucide-react';
import { io } from 'socket.io-client';
import API_BASE_URL from '../config';

const socket = io(API_BASE_URL);

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "I'm your AI Trip Agent. How can I help you adjust your plan?" }
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on("chat_response", (data) => {
      if (data.content === "[DONE]") return;
      setMessages((prev) => {
        let newMessages = [...prev];
        let lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg && lastMsg.role === "assistant") {
          lastMsg.content += data.content;
        } else {
          newMessages.push({ role: "assistant", content: data.content });
        }
        return newMessages;
      });
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => socket.off("chat_response");
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    socket.emit("chat_message", { message: input });
    setInput("");
  };

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.div 
            initial={{ y: 50, opacity: 0, scale: 0.9 }} 
            animate={{ y: 0, opacity: 1, scale: 1 }} 
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-96 h-[80vh] sm:h-[500px] flex flex-col z-[1000] glass-panel overflow-hidden shadow-2xl rounded-t-3xl sm:rounded-xl"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20 backdrop-blur-lg">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent-purple" />
                <span className="font-bold">Trip Agent</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${
                    m.role === 'user' ? 'bg-accent text-white rounded-br-none' : 'bg-white/5 text-gray-200 border border-white/5 rounded-bl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="flex gap-2">
                <input 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  onKeyPress={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm outline-none focus:border-accent/50 transition-colors"
                />
                <button onClick={sendMessage} className="p-2 bg-accent hover:bg-accent/80 text-white rounded-full transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-accent to-accent-purple text-white rounded-full flex items-center justify-center shadow-lg shadow-accent/20 z-[1000]"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
