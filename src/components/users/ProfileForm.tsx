'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { userFormSchema, type UserFormValues } from '@/lib/validations/user';
import type { UserResponse } from '@/lib/types/api';

export function ProfileForm({ user }: { user: UserResponse }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user.name,
      profileImage: user.profileImage,
    },
  });

  async function onSubmit(values: UserFormValues) {
    setSubmitError(null);

    const res = await fetch('/api/users/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setSubmitError(data.error ?? 'Erro ao salvar perfil.');
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-6">
      <Controller
        name="profileImage"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col items-center gap-3">
            <div className="h-24 w-24 overflow-hidden rounded-full bg-zinc-700">
              {field.value && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={field.value}
                  alt="Foto de perfil"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result) => {
                if (typeof result.info === 'object' && result.info?.secure_url) {
                  field.onChange(result.info.secure_url);
                }
              }}
            >
              {({ open }) => (
                <Button type="button" variant="outline" onClick={() => open()}>
                  {field.value ? 'Trocar foto' : 'Adicionar foto'}
                </Button>
              )}
            </CldUploadWidget>
          </div>
        )}
      />

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-100">Nome</label>
        <Input {...register('name')} className="border-indigo-400 bg-zinc-700" />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-100">Email</label>
        <Input value={user.email} disabled className="border-zinc-700 bg-zinc-800 opacity-60" />
        <p className="text-xs text-zinc-500">O email não pode ser alterado.</p>
      </div>

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 hover:bg-indigo-700"
      >
        {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
      </Button>
    </form>
  );
}
