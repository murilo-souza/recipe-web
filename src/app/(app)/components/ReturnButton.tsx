import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ReturnButtonProps {
  href: string;
  tooltip: string;
}

export function ReturnButton({ href, tooltip }: ReturnButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            href={href}
            aria-label={tooltip}
            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-800/60 text-zinc-400 transition-all duration-300 hover:border-indigo-500/40 hover:bg-zinc-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          </Link>
        }
      />
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
