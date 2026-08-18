import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session?.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      company: true,
      taxId: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
});

export const requireUser = cache(async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");
  return user;
});

export const requireAdmin = cache(async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");
  if (user.role !== "ADMIN") redirect("/");
  return user;
});
