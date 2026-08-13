import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/api/user';
import { ProfileForm } from '@/components/users/ProfileForm';
import { ArrowLeft, UserCircle, Sparkles } from 'lucide-react';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-900 relative noise-overlay">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-32 w-80 h-80 bg-purple-500/6 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 sm:px-10 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 animate-fade-in-up">
          <Link
            href="/"
            aria-label="Voltar para a home"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800/60 border border-zinc-700/50 
                       text-zinc-400 hover:text-white hover:border-indigo-500/40 hover:bg-zinc-800 
                       transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse-soft" />
              <span className="text-xs text-indigo-400 font-medium uppercase tracking-wider">Conta</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Seu perfil</h1>
          </div>
        </div>

        {/* Profile card */}
        <div className="glass-strong rounded-2xl p-8 animate-fade-in-up delay-200">
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}
