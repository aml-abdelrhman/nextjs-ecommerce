"use client";
import { getSession } from "next-auth/react";

export async function getUser() {
  const session = await getSession();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  return session;
}


