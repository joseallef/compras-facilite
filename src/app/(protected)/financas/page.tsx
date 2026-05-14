import { auth } from "@/core/auth/auth";
import { getRecurringsAction, getTransactionsAction } from "@/features/recurring-transactions/actions/recurring-actions";
import { redirect } from "next/navigation";
import { FinancasClient } from "./financas-client";

export default async function FinancasPage() {
  const session = await auth();
  
  if (!session?.user?.id || !session?.user?.email) {
    redirect("/login");
  }

  const userId = session.user.id;
  const userEmail = session.user.email;

  const currentDate = new Date();
  const initialMonth = currentDate.getMonth();
  const initialYear = currentDate.getFullYear();

  const [initialRecurrings, initialTransactions] = await Promise.all([
    getRecurringsAction(),
    getTransactionsAction(initialMonth, initialYear),
  ]);

  return (
    <FinancasClient
      initialRecurrings={initialRecurrings}
      initialTransactions={initialTransactions}
      initialMonth={initialMonth}
      initialYear={initialYear}
    />
  );
}
