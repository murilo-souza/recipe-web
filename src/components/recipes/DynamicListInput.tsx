'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface DynamicListInputProps {
  label: string;
  placeholder: string;
  items: string[];
  onChange: (items: string[]) => void;
}

export function DynamicListInput({ label, placeholder, items, onChange }: DynamicListInputProps) {
  const [draft, setDraft] = useState('');

  function handleAdd() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setDraft('');
  }

  function handleRemove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
        {label}
        {items.length > 0 && (
          <span className="rounded-full bg-zinc-800/60 px-2 py-0.5 text-xs font-normal text-zinc-500">
            {items.length}
          </span>
        )}
      </label>

      {/* Input row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="h-11 rounded-xl border border-zinc-700/50 bg-zinc-800/60 text-white transition-all duration-300 placeholder:text-zinc-500 focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
            aria-label={`Novo item em ${label}`}
          />
        </div>
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!draft.trim()}
          className="flex h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-500 px-4 text-sm font-medium text-white shadow-md shadow-indigo-500/15 transition-all duration-300 hover:bg-indigo-400 hover:shadow-indigo-500/25 disabled:opacity-40 disabled:hover:bg-indigo-500 disabled:hover:shadow-indigo-500/15"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Adicionar</span>
        </Button>
      </div>

      {/* Items list */}
      {items.length > 0 ? (
        <ul
          className="max-h-72 space-y-2 overflow-y-auto pr-1"
          role="list"
          aria-label={`Lista de ${label.toLowerCase()}`}
        >
          {items.map((item, index) => (
            <li
              key={index}
              className="group animate-fade-in-up flex items-center gap-3 rounded-xl border border-zinc-700/30 bg-zinc-800/50 px-3 py-2.5 transition-all duration-200 hover:border-zinc-600/50 hover:bg-zinc-800/70"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {/* Grip handle (visual only) */}
              <GripVertical className="h-3.5 w-3.5 shrink-0 text-zinc-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

              {/* Number badge */}
              <span
                aria-hidden="true"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-linear-to-br from-indigo-500/20 to-purple-500/20 text-xs font-bold text-indigo-400"
              >
                {index + 1}
              </span>

              {/* Content */}
              <span className="flex-1 text-sm leading-snug text-zinc-200">{item}</span>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                aria-label={`Remover ${item}`}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700/40 py-8">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/60">
            <Plus className="h-4 w-4 text-zinc-600" />
          </div>
          <p className="text-center text-xs text-zinc-500">
            Nenhum item adicionado.
            <br />
            <span className="text-zinc-600">Digite e pressione Enter ou clique em Adicionar.</span>
          </p>
        </div>
      )}
    </div>
  );
}
