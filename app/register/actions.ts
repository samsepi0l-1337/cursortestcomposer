"use server";

import { signIn } from "@/auth";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional().nullable(),
});

export async function registerAction(
  _prevState: { error?: string } | null,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = (formData.get("name") as string) || null;

  const parsed = registerSchema.safeParse({ email, password, name });
  if (!parsed.success) {
    const msg =
      parsed.error.flatten().fieldErrors.password?.[0] ??
      parsed.error.flatten().fieldErrors.email?.[0] ??
      "Validation failed";
    return { error: msg };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) return { error: "Email already registered" };

  const hashedPassword = await hash(parsed.data.password, 12);
  await prisma.user.create({
    data: {
      email: parsed.data.email,
      password: hashedPassword,
      name: parsed.data.name ?? null,
    },
  });

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/profile",
    });
  } catch {
    return { error: "Account created. Please sign in." };
  }
  return null;
}
