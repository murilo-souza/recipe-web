'use client';

import { useState } from 'react';
import { ChatPanel } from './ChatPanel';
import type { ChatMessageResponse } from '@/lib/types/api';
import { MessageSquareText, X } from 'lucide-react';

interface MobileChatDrawerProps {
  recipeId: number;
  initialMessages: ChatMessageResponse[];
}

export function MobileChatDrawer({ recipeId, initialMessages }: MobileChatDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button — only visible on mobile (<lg) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/45 active:scale-95 lg:hidden"
        aria-label="Abrir assistente IA"
      >
        <MessageSquareText className="h-6 w-6" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="animate-fade-in fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-up drawer */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-zinc-700/40 bg-zinc-900 transition-transform duration-500 ease-out lg:hidden ${open ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ height: '85dvh' }}
      >
        {/* Drawer handle + close */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          <div className="mx-auto h-1 w-10 rounded-full bg-zinc-700" />
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-2 right-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-800/60 text-zinc-400 transition-colors duration-200 hover:text-white"
          aria-label="Fechar chat"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Chat panel fills the drawer */}
        <div className="h-[calc(85dvh-40px)]">
          <ChatPanel recipeId={recipeId} initialMessages={initialMessages} />
        </div>
      </div>
    </>
  );
}
