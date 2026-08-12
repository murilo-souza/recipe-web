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
    <Button className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center 
                                hover:border-indigo-500/40 transition-colors duration-300 cursor-pointer"
      onClick={handleLogout}
    >
      <User className="h-5 w-5 text-zinc-400" />
    </Button>
  )
}