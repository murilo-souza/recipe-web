'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';

export function DeleteRecipeButton({ recipeId }: { recipeId: number }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm('Tem certeza que deseja excluir esta receita?');
    if (!confirmed) return;

    setDeleting(true);

    const res = await fetch(`/api/recipes/${recipeId}`, { method: 'DELETE' });

    setDeleting(false);

    if (!res.ok) {
      alert('Erro ao excluir receita.');
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <Button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="flex h-auto w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-3.5 text-red-400 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
    >
      {deleting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Excluindo...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4" />
          Deletar receita
        </>
      )}
    </Button>
  );
}
