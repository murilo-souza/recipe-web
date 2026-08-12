'use client';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { User } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }
  return (
    <Button
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-zinc-700/50 bg-zinc-800 transition-colors duration-300 hover:border-indigo-500/40"
      onClick={handleLogout}
    >
      <User className="h-5 w-5 text-zinc-400" />
    </Button>
  );
}
