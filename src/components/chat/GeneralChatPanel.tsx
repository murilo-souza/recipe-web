'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { GeneralChatMessageResponse } from '@/lib/types/api';
import { Bot, User, SendHorizonal, Loader2, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface GeneralChatPanelProps {
  initialMessages: GeneralChatMessageResponse[];
}

const MAX_TEXTAREA_HEIGHT = 160;

export function GeneralChatPanel({ initialMessages }: GeneralChatPanelProps) {
  const [messages, setMessages] = useState<GeneralChatMessageResponse[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const adjustTextareaHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [draft, adjustTextareaHeight]);

  async function handleSend() {
    const content = draft.trim();
    if (!content || sending) return;

    setError(null);
    setSending(true);

    const optimisticMessage: GeneralChatMessageResponse = {
      id: Date.now(),
      role: 'User',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    setDraft('');

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    });

    const res = await fetch('/api/chat/general', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    setSending(false);

    if (!res.ok) {
      setError('Não foi possível enviar a mensagem.');
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      return;
    }

    const aiMessage: GeneralChatMessageResponse = await res.json();
    setMessages((prev) => [...prev, aiMessage]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-zinc-700/40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-purple-500/20">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-white text-sm font-semibold">Assistente Geral</h2>
            <p className="text-zinc-500 text-[11px]">Pergunte sobre todas as suas receitas</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-10 animate-fade-in">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-2xl scale-150" />
              <div className="relative w-14 h-14 rounded-2xl bg-zinc-700/40 border border-zinc-600/30 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-zinc-500" />
              </div>
            </div>
            <p className="text-zinc-400 text-sm font-medium mb-1">Nenhuma mensagem</p>
            <p className="text-zinc-600 text-[11px] text-center max-w-[200px] leading-relaxed">
              Pergunte coisas como &quot;quais receitas doces eu tenho?&quot;
            </p>
          </div>
        )}
        {messages.map((message) => {
          const isUser = message.role === 'User';
          return (
            <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              <div className={`flex items-end gap-2 max-w-[90%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-indigo-500/20'
                    : 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20'
                }`}>
                  {isUser ? (
                    <User className="w-3 h-3 text-indigo-400" />
                  ) : (
                    <Bot className="w-3 h-3 text-purple-400" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-br-md shadow-md shadow-indigo-500/10'
                      : 'bg-zinc-700/60 border border-zinc-600/30 text-zinc-200 rounded-bl-md'
                  }`}
                >
                  <div className="prose-sm prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {sending && (
          <div className="flex items-end gap-2 animate-fade-in">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center shrink-0">
              <Bot className="w-3 h-3 text-purple-400" />
            </div>
            <div className="rounded-2xl rounded-bl-md bg-zinc-700/60 border border-zinc-600/30 px-3.5 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input area */}
      <div className="px-4 py-3 border-t border-zinc-700/40 shrink-0">
        {error && (
          <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
            <p className="text-red-400 text-[11px]">{error}</p>
          </div>
        )}
        <div className="relative flex items-end gap-2 rounded-xl bg-zinc-800/60 border border-zinc-700/50 
                        focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 
                        transition-all duration-300 px-3 py-2">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            placeholder="Pergunte sobre suas receitas..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none resize-none 
                       disabled:opacity-50 py-1 leading-relaxed"
            style={{ maxHeight: `${MAX_TEXTAREA_HEIGHT}px` }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || !draft.trim()}
            className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 
                       flex items-center justify-center text-white mb-px
                       shadow-md shadow-indigo-500/15 hover:shadow-indigo-500/30 
                       hover:from-indigo-400 hover:to-purple-500
                       disabled:opacity-30 disabled:hover:shadow-indigo-500/15 disabled:hover:from-indigo-500 disabled:hover:to-purple-600
                       transition-all duration-300 cursor-pointer"
          >
            {sending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <SendHorizonal className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <p className="text-zinc-600 text-[9px] mt-1 px-1">
          <kbd className="text-zinc-500 font-mono">Enter</kbd> enviar · <kbd className="text-zinc-500 font-mono">Shift+Enter</kbd> nova linha
        </p>
      </div>
    </div>
  );
}
