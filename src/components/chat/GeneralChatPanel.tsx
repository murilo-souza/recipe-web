'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { GeneralChatMessageResponse } from '@/lib/types/api';
import {
  Bot,
  User,
  SendHorizonal,
  Loader2,
  MessageSquare,
  AlertCircle,
  Sparkles,
  Trash,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';

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

  async function handleDeleteAll() {
    if (sending) return;

    try {
      await fetch('/api/chat/general', { method: 'DELETE' });
      setMessages([]);
    } catch (error) {
      setError('Não foi possível deletar as mensagens.');
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-700/40 px-6 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Assistente Geral</h2>
            <p className="text-[11px] text-zinc-500">Pergunte sobre todas as suas receitas</p>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                className="cursor-pointer hover:ring-1 hover:ring-purple-500/20"
                onClick={handleDeleteAll}
              >
                <Trash className="h-4 w-4 text-red-400" />
              </Button>
            }
          />

          <TooltipContent>
            <p>Deletar todas as mensagens</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Messages area */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="animate-fade-in flex h-full flex-col items-center justify-center py-10">
            <div className="relative mb-4">
              <div className="absolute inset-0 scale-150 rounded-full bg-purple-500/10 blur-2xl" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-600/30 bg-zinc-700/40">
                <MessageSquare className="h-6 w-6 text-zinc-500" />
              </div>
            </div>
            <p className="mb-1 text-sm font-medium text-zinc-400">Nenhuma mensagem</p>
            <p className="max-w-[200px] text-center text-[11px] leading-relaxed text-zinc-600">
              Pergunte coisas como &quot;quais receitas doces eu tenho?&quot;
            </p>
          </div>
        )}
        {messages.map((message) => {
          const isUser = message.role === 'User';
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            >
              <div
                className={`flex max-w-[90%] items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                    isUser
                      ? 'bg-indigo-500/20'
                      : 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20'
                  }`}
                >
                  {isUser ? (
                    <User className="h-3 w-3 text-indigo-400" />
                  ) : (
                    <Bot className="h-3 w-3 text-purple-400" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    isUser
                      ? 'rounded-br-md bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/10'
                      : 'rounded-bl-md border border-zinc-600/30 bg-zinc-700/60 text-zinc-200'
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
          <div className="animate-fade-in flex items-end gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
              <Bot className="h-3 w-3 text-purple-400" />
            </div>
            <div className="rounded-2xl rounded-bl-md border border-zinc-600/30 bg-zinc-700/60 px-3.5 py-2.5">
              <div className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-zinc-700/40 px-4 py-3">
        {error && (
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
            <AlertCircle className="h-3 w-3 shrink-0 text-red-400" />
            <p className="text-[11px] text-red-400">{error}</p>
          </div>
        )}
        <div className="relative flex items-end gap-2 rounded-xl border border-zinc-700/50 bg-zinc-800/60 px-3 py-2 transition-all duration-300 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/50">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            placeholder="Pergunte sobre suas receitas..."
            rows={1}
            className="flex-1 resize-none bg-transparent py-1 text-sm leading-relaxed text-white outline-none placeholder:text-zinc-500 disabled:opacity-50"
            style={{ maxHeight: `${MAX_TEXTAREA_HEIGHT}px` }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || !draft.trim()}
            className="mb-px flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/15 transition-all duration-300 hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/30 disabled:opacity-30 disabled:hover:from-indigo-500 disabled:hover:to-purple-600 disabled:hover:shadow-indigo-500/15"
          >
            {sending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <SendHorizonal className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        <p className="mt-1 px-1 text-[9px] text-zinc-600">
          <kbd className="font-mono text-zinc-500">Enter</kbd> enviar ·{' '}
          <kbd className="font-mono text-zinc-500">Shift+Enter</kbd> nova linha
        </p>
      </div>
    </div>
  );
}
