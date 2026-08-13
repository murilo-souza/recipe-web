import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/api/user';
import { ProfileForm } from '@/components/users/ProfileForm';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-900 px-8 py-10 sm:px-16">
      <h1 className="mb-8 text-2xl font-semibold text-white">Seu perfil</h1>
      <ProfileForm user={user} />
    </div>
  );
}
