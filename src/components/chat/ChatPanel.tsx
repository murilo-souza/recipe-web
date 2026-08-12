'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatBubble } from './ChatBubble';
import type { ChatMessageResponse } from '@/lib/types/api';
import { Bot, SendHorizonal, Loader2, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';

interface ChatPanelProps {
  recipeId: number;
  initialMessages: ChatMessageResponse[];
}

export function ChatPanel({ recipeId, initialMessages }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessageResponse[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    const content = draft.trim();
    if (!content || sending) return;

    setError(null);
    setSending(true);

    // Optimistic UI: mostra a mensagem do usuário na hora, antes da resposta do servidor
    const optimisticMessage: ChatMessageResponse = {
      id: Date.now(), // id temporário, só pra key do React
      role: 'User',
      content,
      recipeId,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    setDraft('');

    const res = await fetch(`/api/recipes/${recipeId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    setSending(false);

    if (!res.ok) {
      setError('Não foi possível enviar a mensagem.');
      // remove a mensagem otimista, já que não foi confirmada pelo servidor
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      return;
    }

    const aiMessage: ChatMessageResponse = await res.json();
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
      <div className="px-6 pt-6 pb-4 border-b border-zinc-700/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-purple-500/20">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-white text-sm font-semibold">Assistente IA</h2>
            <p className="text-zinc-500 text-xs">Pergunte sobre a receita</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-12 animate-fade-in">
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-2xl scale-150" />
              <div className="relative w-16 h-16 rounded-2xl bg-zinc-700/40 border border-zinc-600/30 flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-zinc-500" />
              </div>
            </div>
            <p className="text-zinc-400 text-sm font-medium mb-1">Nenhuma mensagem</p>
            <p className="text-zinc-600 text-xs text-center max-w-[220px] leading-relaxed">
              Pergunte sobre substituições de ingredientes, tempo de preparo ou dicas.
            </p>
          </div>
        )}
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}

        {/* Typing indicator */}
        {sending && (
          <div className="flex items-end gap-2.5 animate-fade-in">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="rounded-2xl rounded-bl-md bg-zinc-700/60 border border-zinc-600/30 px-4 py-3">
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
      <div className="px-5 py-4 border-t border-zinc-700/40">
        {error && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            placeholder="Escreva sua pergunta..."
            className="flex-1 rounded-xl bg-zinc-800/60 border border-zinc-700/50 px-4 py-3 text-sm text-white 
                       placeholder:text-zinc-500 outline-none
                       focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 
                       disabled:opacity-50 transition-all duration-300"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || !draft.trim()}
            className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 
                       flex items-center justify-center text-white 
                       shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 
                       hover:from-indigo-400 hover:to-purple-500
                       disabled:opacity-40 disabled:hover:shadow-indigo-500/20 disabled:hover:from-indigo-500 disabled:hover:to-purple-600
                       transition-all duration-300 cursor-pointer"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <SendHorizonal className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}