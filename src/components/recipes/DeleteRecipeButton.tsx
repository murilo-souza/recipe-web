'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { ModalConfirmationDelete } from './ModalConfirmationDelete';

export function DeleteRecipeButton({
  recipeId,
  recipeTitle,
}: {
  recipeId: number;
  recipeTitle: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setDeleting(true);

    const res = await fetch(`/api/recipes/${recipeId}`, { method: 'DELETE' });

    setDeleting(false);

    if (!res.ok) {
      alert('Erro ao excluir receita.');
      return;
    }

    setOpen(false);
    router.push('/');
    router.refresh();
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
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

      <ModalConfirmationDelete
        open={open}
        onOpenChange={setOpen}
        recipeTitle={recipeTitle}
        isDeleting={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
