'use client';

import { useState } from 'react';
import { GeneralChatPanel } from './GeneralChatPanel';
import type { GeneralChatMessageResponse } from '@/lib/types/api';
import { MessageSquareText, X, PanelRightOpen, PanelRightClose } from 'lucide-react';

interface GeneralChatSidebarProps {
  initialMessages: GeneralChatMessageResponse[];
}

export function GeneralChatSidebar({ initialMessages }: GeneralChatSidebarProps) {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed top-1/2 z-30 hidden h-14 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-l-xl border border-r-0 border-zinc-700/50 bg-zinc-800/80 text-zinc-400 shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/40 hover:bg-zinc-800 hover:text-white lg:flex"
        style={{
          right: open ? '680px' : '0px',
          transition: 'right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        aria-label={open ? 'Fechar assistente' : 'Abrir assistente'}
      >
        {open ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
      </button>

      {/* Sidebar panel — slides from right */}
      <div
        className="fixed top-0 right-0 z-20 hidden h-screen w-[680px] border-l border-zinc-700/40 bg-zinc-800/60 shadow-2xl shadow-black/30 backdrop-blur-md lg:flex"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <GeneralChatPanel initialMessages={initialMessages} />
      </div>

      {/* ── Mobile FAB + Drawer (<lg) ── */}

      {/* FAB */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed right-6 bottom-6 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/45 active:scale-95 lg:hidden"
        aria-label="Abrir assistente geral"
      >
        <MessageSquareText className="h-6 w-6" />
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-zinc-700/40 bg-zinc-900 transition-transform duration-500 ease-out lg:hidden ${mobileOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ height: '85dvh' }}
      >
        {/* Handle + close */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          <div className="mx-auto h-1 w-10 rounded-full bg-zinc-700" />
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-800/60 text-zinc-400 transition-colors duration-200 hover:text-white"
          aria-label="Fechar chat"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="h-[calc(85dvh-40px)]">
          <GeneralChatPanel initialMessages={initialMessages} />
        </div>
      </div>
    </>
  );
}
