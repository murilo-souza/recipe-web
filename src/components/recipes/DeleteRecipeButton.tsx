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
      className="w-full h-auto py-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400
                 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-300
                 disabled:opacity-50 transition-all duration-300 cursor-pointer
                 flex items-center justify-center gap-2"
    >
      {deleting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Excluindo...
        </>
      ) : (
        <>
          <Trash2 className="w-4 h-4" />
          Deletar receita
        </>
      )}
    </Button>
  );
}