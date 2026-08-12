import type { ChatMessageResponse } from '@/lib/types/api';
import { Bot, User } from 'lucide-react';

export function ChatBubble({ message }: { message: ChatMessageResponse }) {
  const isUser = message.role === 'User';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
      <div className={`flex items-end gap-2.5 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
          isUser
            ? 'bg-indigo-500/20'
            : 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20'
        }`}>
          {isUser ? (
            <User className="w-3.5 h-3.5 text-indigo-400" />
          ) : (
            <Bot className="w-3.5 h-3.5 text-purple-400" />
          )}
        </div>

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-br-md shadow-lg shadow-indigo-500/15'
              : 'bg-zinc-700/60 border border-zinc-600/30 text-zinc-200 rounded-bl-md'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
}