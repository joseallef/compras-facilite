import { auth } from "@/core/auth/auth";
import { MarketEditPageSkeleton } from "@/shared/ui/skeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { EditPageClient } from "./edit-page-client";

export default async function EditPage() {
  const session = await auth();
  
  if (!session?.user?.id || !session?.user?.email) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<MarketEditPageSkeleton />}>
      <EditPageClient />
    </Suspense>
  );
}
