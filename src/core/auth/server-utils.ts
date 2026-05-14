"use server";

import { auth } from "@/core/auth/auth";

export async function requireValidSession() {
  const session = await auth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;
  
  if (!userId || !userEmail) {
    throw new Error("Unauthorized");
  }
  
  return userId;
}
