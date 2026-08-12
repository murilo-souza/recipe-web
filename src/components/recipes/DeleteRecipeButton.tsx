'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

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
      className="bg-red-600 hover:bg-red-700 flex-1 h-auto py-3.5"
    >
      {deleting ? 'Excluindo...' : 'Deletar receita'}
    </Button>
  );
}