import { auth } from "@/core/auth/auth";
import { ListsPageContent } from "@/features/mercado/components/lists-page-content";
import { redirect } from "next/navigation";

export default async function ListsPage() {
  const session = await auth();
  
  if (!session?.user?.id || !session?.user?.email) {
    redirect("/login");
  }

  return <ListsPageContent />;
}
