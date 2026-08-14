import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/api/user';
import { ProfileForm } from '@/components/users/ProfileForm';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  return (
    <div className="noise-overlay relative min-h-screen bg-zinc-900">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl" />
        <div className="absolute bottom-1/3 -left-32 h-80 w-80 rounded-full bg-purple-500/6 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-10 sm:px-10">
        {/* Header */}
        <div className="animate-fade-in-up mb-10 flex items-center gap-4">
          <Link
            href="/"
            aria-label="Voltar para a home"
            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-800/60 text-zinc-400 transition-all duration-300 hover:border-indigo-500/40 hover:bg-zinc-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          </Link>
          <div>
            <div className="mb-0.5 flex items-center gap-2">
              <Sparkles className="animate-pulse-soft h-3.5 w-3.5 text-indigo-400" />
              <span className="text-xs font-medium tracking-wider text-indigo-400 uppercase">
                Conta
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Seu perfil</h1>
          </div>
        </div>

        {/* Profile card */}
        <div className="glass-strong animate-fade-in-up rounded-2xl p-8 delay-200">
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}
