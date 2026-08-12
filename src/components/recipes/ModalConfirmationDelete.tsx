'use client';

import { Loader2, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface ModalConfirmationDeleteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeTitle: string;
  isDeleting: boolean;
  onConfirm: () => void;
}

export function ModalConfirmationDelete({
  open,
  onOpenChange,
  recipeTitle,
  isDeleting,
  onConfirm,
}: ModalConfirmationDeleteProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="border-red-500/20 bg-zinc-900 text-white sm:max-w-md"
        showCloseButton={false}
      >
        {/* Animated danger icon */}
        <div className="flex justify-center">
          <div className="relative flex h-16 w-16 items-center justify-center">
            {/* Pulsing ring */}
            <div className="absolute inset-0 animate-ping rounded-full bg-red-500/10" style={{ animationDuration: '2s' }} />
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full border border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-600/5" />
            {/* Icon */}
            <Trash2 className="relative h-7 w-7 text-red-400" />
          </div>
        </div>

        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-lg font-semibold text-white">
            Excluir receita
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-zinc-400">
            Tem certeza que deseja excluir{' '}
            <span className="font-medium text-red-400">&ldquo;{recipeTitle}&rdquo;</span>?
            <br />
            <span className="mt-1 inline-block text-xs text-zinc-500">
              Essa ação não pode ser desfeita.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2 flex gap-3 sm:flex-row">
          <DialogClose
            render={
              <Button
                variant="outline"
                className="flex-1 cursor-pointer rounded-xl border-zinc-700/50 bg-zinc-800/60 py-2.5 text-zinc-300 transition-all duration-300 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
              />
            }
            disabled={isDeleting}
          >
            Cancelar
          </DialogClose>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/15 py-2.5 text-red-400 transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/25 hover:text-red-300 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Sim, excluir
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
