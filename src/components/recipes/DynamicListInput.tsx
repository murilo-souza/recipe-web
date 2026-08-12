'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';

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
      <label className="text-sm font-semibold text-slate-100">{label}</label>

      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="rounded bg-zinc-700 border-indigo-400"
          aria-label={`Novo item em ${label}`}
        />
        <Button
          type="button"
          onClick={handleAdd}
          className="rounded bg-indigo-600 hover:bg-indigo-700 shrink-0"
        >
          <Plus className="w-4 h-4 mr-1" aria-hidden="true" /> Adicionar
        </Button>
      </div>

      {items.length > 0 ? (
        <ul
          className="space-y-1.5 max-h-60 overflow-y-auto pr-0.5"
          role="list"
          aria-label={`Lista de ${label.toLowerCase()}`}
        >
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-3 rounded-sm bg-zinc-800 px-3 py-2.5"
            >
              <span
                aria-hidden="true"
                className="flex shrink-0 items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold"
              >
                {index + 1}
              </span>
              <span className="flex-1 text-white text-sm">{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="shrink-0 rounded-sm bg-red-500/15 p-1.5 hover:bg-red-500/25 transition-colors"
                aria-label={`Remover ${item}`}
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-3 text-center text-xs text-zinc-500">
          Nenhum item adicionado ainda
        </p>
      )}
    </div>
  );
}