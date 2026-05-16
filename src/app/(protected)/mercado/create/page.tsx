import { auth } from "@/core/auth/auth";
import { redirect } from "next/navigation";
import { CreatePageClient } from "./create-page-client";

export default async function CreatePage() {
  const session = await auth();
  
  if (!session?.user?.id || !session?.user?.email) {
    redirect("/login");
  }

  return <CreatePageClient />;
}
