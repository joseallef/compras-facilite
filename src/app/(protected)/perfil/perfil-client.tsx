"use client";

import { updateProfileSchema } from "@/features/auth/schemas/profile-schemas";
import { updateProfileAction } from "@/features/auth/services/auth-server-service";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PerfilClientProps {
  initialName: string;
  initialEmail: string;
}

export function PerfilClient({ initialName, initialEmail }: PerfilClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: initialName,
      email: initialEmail,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const result = await updateProfileAction(data);
      if (result.ok) {
        toast.success("Perfil atualizado com sucesso!");
        reset({
          name: data.name,
          email: data.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Ocorreu um erro ao atualizar o perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto w-full p-4 md:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Meu Perfil
        </h1>
        <p className="text-muted mt-1 text-base md:text-lg">
          Atualize suas informações pessoais
        </p>
      </div>

      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <Input
                id="name"
                label="Nome"
                placeholder="Seu nome completo"
                disabled={isLoading}
                leftIcon={<User className="h-5 w-5" />}
                error={errors.name?.message as string}
                {...register("name")}
              />

              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="seu@email.com"
                disabled={isLoading}
                readOnly
                leftIcon={<Mail className="h-5 w-5" />}
                error={errors.email?.message as string}
                {...register("email")}
              />
            </div>

            <div className="border-t border-border/50 pt-8 mt-8">
              <h2 className="text-xl font-bold mb-2">Alterar Senha</h2>
              <p className="text-sm text-muted mb-8">
                Preencha os campos abaixo se quiser alterar sua senha.
              </p>
              
              <div className="space-y-6">
                <Input
                  id="currentPassword"
                  type={isCurrentPasswordVisible ? "text" : "password"}
                  label="Senha Atual"
                  placeholder="••••••••"
                  disabled={isLoading}
                  leftIcon={<Lock className="h-5 w-5" />}
                  error={errors.currentPassword?.message as string}
                  autoComplete="off"
                  rightSlot={
                    <Button
                      type="button"
                      onClick={() => setIsCurrentPasswordVisible((prev) => !prev)}
                      className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-muted/10 transition-all"
                      aria-label={isCurrentPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                      disabled={isLoading}
                    >
                      {isCurrentPasswordVisible ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                  }
                  {...register("currentPassword")}
                />

                <Input
                  id="newPassword"
                  type={isNewPasswordVisible ? "text" : "password"}
                  label="Nova Senha"
                  placeholder="••••••••"
                  disabled={isLoading}
                  leftIcon={<Lock className="h-5 w-5" />}
                  error={errors.newPassword?.message as string}
                  autoComplete="new-password"
                  rightSlot={
                    <Button
                      type="button"
                      onClick={() => setIsNewPasswordVisible((prev) => !prev)}
                      className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-muted/10 transition-all"
                      aria-label={isNewPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                      disabled={isLoading}
                    >
                      {isNewPasswordVisible ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                  }
                  {...register("newPassword")}
                />

                <Input
                  id="confirmPassword"
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  label="Confirmar Nova Senha"
                  placeholder="••••••••"
                  disabled={isLoading}
                  leftIcon={<Lock className="h-5 w-5" />}
                  error={errors.confirmPassword?.message as string}
                  autoComplete="new-password"
                  rightSlot={
                    <Button
                      type="button"
                      onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                      className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-muted/10 transition-all"
                      aria-label={isConfirmPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                      disabled={isLoading}
                    >
                      {isConfirmPasswordVisible ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                  }
                  {...register("confirmPassword")}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
