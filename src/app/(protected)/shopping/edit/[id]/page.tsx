import { auth } from "@/core/auth/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ShoppingListEditPageSkeleton } from "@/shared/ui/skeleton";
import { EditPageClient } from "./edit-page-client";

export default async function EditPage() {
  const session = await auth();
  
  if (!session?.user?.id || !session?.user?.email) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<ShoppingListEditPageSkeleton />}>
      <EditPageClient />
    </Suspense>
  );
}
