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
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-28 w-28 overflow-hidden rounded-full bg-zinc-700/60 border-2 border-zinc-600/50 
                              group-hover:border-indigo-500/40 transition-colors duration-300">
                {field.value ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={field.value}
                    alt="Foto de perfil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800">
                    <User className="w-10 h-10 text-zinc-500" />
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                             bg-zinc-800/60 border border-zinc-700/50 text-zinc-300
                             hover:bg-zinc-800 hover:text-white hover:border-indigo-500/40
                             transition-all duration-300 cursor-pointer"
                >
                  {field.value ? (
                    <>
                      <Camera className="w-3.5 h-3.5" />
                      Trocar foto
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
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
      <div className="h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />

      {/* Fields */}
      <div className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="profile-name" className="text-sm font-medium text-zinc-300 flex items-center gap-1">
            Nome <span aria-hidden="true" className="text-indigo-400">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              id="profile-name"
              {...register('name')}
              className="bg-zinc-800/60 border border-zinc-700/50 text-white placeholder:text-zinc-500 h-12 rounded-xl pl-10
                         focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all duration-300"
            />
          </div>
          {errors.name && (
            <p className="text-red-400 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email (read-only) */}
        <div className="space-y-2">
          <label htmlFor="profile-email" className="text-sm font-medium text-zinc-300 flex items-center gap-2">
            <Lock className="w-3 h-3 text-zinc-600" />
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <Input
              id="profile-email"
              value={user.email}
              disabled
              className="bg-zinc-800/30 border border-zinc-700/30 text-zinc-500 h-12 rounded-xl pl-10 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-zinc-600 flex items-center gap-1">
            O email não pode ser alterado.
          </p>
        </div>
      </div>

      {/* Error banner */}
      {submitError && (
        <div className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 animate-fade-in-up">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-red-400 text-sm">{submitError}</p>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 
                   text-white text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer
                   shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.01] active:scale-[0.99]
                   disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-indigo-500/20
                   flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            Salvar alterações
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </form>
  );
}
