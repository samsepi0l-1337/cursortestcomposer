"use server";

import { signIn } from "@/auth";

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/profile",
    });
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Invalid email or password",
    };
  }
  return null;
}
