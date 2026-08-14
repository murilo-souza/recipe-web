import type { ChatMessageResponse } from '@/lib/types/api';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ChatBubble({ message }: { message: ChatMessageResponse }) {
  const isUser = message.role === 'User';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
      <div
        className={`flex max-w-[85%] items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Avatar */}
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
            isUser ? 'bg-indigo-500/20' : 'bg-linear-to-br from-purple-500/20 to-indigo-500/20'
          }`}
        >
          {isUser ? (
            <User className="h-3.5 w-3.5 text-indigo-400" />
          ) : (
            <Bot className="h-3.5 w-3.5 text-purple-400" />
          )}
        </div>

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'rounded-br-md bg-linear-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/15'
              : 'rounded-bl-md border border-zinc-600/30 bg-zinc-700/60 text-zinc-200'
          }`}
        >
          <div>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
