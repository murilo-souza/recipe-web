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
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl
                   bg-gradient-to-br from-indigo-500 to-purple-600 text-white
                   flex items-center justify-center
                   shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/45
                   hover:scale-105 active:scale-95
                   transition-all duration-300 cursor-pointer"
        aria-label="Abrir assistente IA"
      >
        <MessageSquareText className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-up drawer */}
      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 z-50 
                    bg-zinc-900 border-t border-zinc-700/40 rounded-t-3xl
                    transition-transform duration-500 ease-out
                    ${open ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ height: '85dvh' }}
      >
        {/* Drawer handle + close */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-zinc-700 mx-auto" />
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-zinc-800/60 border border-zinc-700/50
                     flex items-center justify-center text-zinc-400 hover:text-white
                     transition-colors duration-200 cursor-pointer z-10"
          aria-label="Fechar chat"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Chat panel fills the drawer */}
        <div className="h-[calc(85dvh-40px)]">
          <ChatPanel recipeId={recipeId} initialMessages={initialMessages} />
        </div>
      </div>
    </>
  );
}
