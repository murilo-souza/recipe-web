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
import { User, Mail, Camera, Upload, AlertCircle, ArrowRight, Loader2, Lock } from 'lucide-react';

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Avatar section */}
      <Controller
        name="profileImage"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col items-center gap-4">
            {/* Avatar circle */}
            <div className="group relative">
              <div className="absolute -inset-1 rounded-full bg-linear-to-br from-indigo-500/30 to-purple-500/30 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-zinc-600/50 bg-zinc-700/60 transition-colors duration-300 group-hover:border-indigo-500/40">
                {field.value ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={field.value}
                    alt="Foto de perfil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-zinc-700 to-zinc-800">
                    <User className="h-10 w-10 text-zinc-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Upload button */}
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result) => {
                if (typeof result.info === 'object' && result.info?.secure_url) {
                  field.onChange(result.info.secure_url);
                }
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-700/50 bg-zinc-800/60 px-4 py-2 text-sm font-medium text-zinc-300 transition-all duration-300 hover:border-indigo-500/40 hover:bg-zinc-800 hover:text-white"
                >
                  {field.value ? (
                    <>
                      <Camera className="h-3.5 w-3.5" />
                      Trocar foto
                    </>
                  ) : (
                    <>
                      <Upload className="h-3.5 w-3.5" />
                      Adicionar foto
                    </>
                  )}
                </button>
              )}
            </CldUploadWidget>
          </div>
        )}
      />

      {/* Separator */}
      <div className="h-px bg-linear-to-r from-transparent via-zinc-700/50 to-transparent" />

      {/* Fields */}
      <div className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor="profile-name"
            className="flex items-center gap-1 text-sm font-medium text-zinc-300"
          >
            Nome{' '}
            <span aria-hidden="true" className="text-indigo-400">
              *
            </span>
          </label>
          <div className="relative">
            <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              id="profile-name"
              {...register('name')}
              className="h-12 rounded-xl border border-zinc-700/50 bg-zinc-800/60 pl-10 text-white transition-all duration-300 placeholder:text-zinc-500 focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
            />
          </div>
          {errors.name && (
            <p className="flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email (read-only) */}
        <div className="space-y-2">
          <label
            htmlFor="profile-email"
            className="flex items-center gap-2 text-sm font-medium text-zinc-300"
          >
            <Lock className="h-3 w-3 text-zinc-600" />
            Email
          </label>
          <div className="relative">
            <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-600" />
            <Input
              id="profile-email"
              value={user.email}
              disabled
              className="h-12 cursor-not-allowed rounded-xl border border-zinc-700/30 bg-zinc-800/30 pl-10 text-zinc-500"
            />
          </div>
          <p className="flex items-center gap-1 text-xs text-zinc-600">
            O email não pode ser alterado.
          </p>
        </div>
      </div>

      {/* Error banner */}
      {submitError && (
        <div className="animate-fade-in-up flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <p className="text-sm text-red-400">{submitError}</p>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.01] hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/35 active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-indigo-500/20"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            Salvar alterações
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
