import { auth } from "@/core/auth/auth";
import { redirect } from "next/navigation";
import { PerfilClient } from "./perfil-client";

export default async function PerfilPage() {
  const session = await auth();

  if (!session?.user?.id || !session?.user?.email) {
    redirect("/login");
  }

  return (
    <PerfilClient
      initialName={session.user.name || ""}
      initialEmail={session.user.email}
    />
  );
}
