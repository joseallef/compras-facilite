import { auth } from "@/core/auth/auth";
import { getDashboardTransactionsAction } from "@/features/dashboard/actions/dashboard-actions";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id || !session?.user?.email) {
    redirect("/login");
  }

  const currentDate = new Date();
  const initialMonth = currentDate.getMonth();
  const initialYear = currentDate.getFullYear();

  const initialTransactions = await getDashboardTransactionsAction(initialMonth, initialYear);

  return (
    <DashboardClient
      initialTransactions={initialTransactions}
      initialMonth={initialMonth}
      initialYear={initialYear}
    />
  );
}
