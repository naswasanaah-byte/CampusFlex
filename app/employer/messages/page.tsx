'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { MessageSquare, Send, CheckCheck, User } from 'lucide-react';

export default function EmployerMessagesPage() {
  const { currentUser } = useAuthStore();
  const { messages, sendMessage, activeConversationId } = useChatStore();

  const [inputMessage, setInputMessage] = useState('');

  const currentChatMessages = messages.filter(
    (m) => m.conversationId === activeConversationId
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentUser) return;

    sendMessage(
      activeConversationId,
      currentUser.id,
      'user-student-1',
      currentUser.companyName || currentUser.name,
      currentUser.role,
      inputMessage
    );

    setInputMessage('');
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-6 min-w-0">

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Communication Hub
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Direct Student Messaging
            </h1>
          </div>
          <MessageSquare className="w-8 h-8 text-indigo-400" />
        </div>

        {/* Chat Interface Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-glass overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[550px]">

          {/* Conversation List */}
          <div className="md:col-span-1 border-r border-slate-100 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Conversations
            </h4>
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3 cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                alt="Alex Rivera"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/20"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    Alex Rivera
                  </h5>
                  <span className="text-[10px] text-slate-400">2:02 PM</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">Frontend Developer Applicant</p>
              </div>
            </div>
          </div>

          {/* Chat Message Window */}
          <div className="md:col-span-2 flex flex-col justify-between">

            {/* Chat Messages */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {currentChatMessages.map((msg) => {
                const isMe = msg.senderId === currentUser?.id || msg.senderRole === currentUser?.role;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] font-semibold text-slate-400 mb-1 px-1">
                      {msg.senderName}
                    </div>
                    <div
                      className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-br-none shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Box */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-950/50">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message to candidate..."
                className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-md transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

      </main>
    </div>
  );
}
