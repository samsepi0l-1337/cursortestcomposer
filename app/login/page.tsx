import Link from "next/link";
import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { Button } from "@/components/ui/button";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/profile");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">Sign in</h1>
        <LoginForm />
        {(process.env.GOOGLE_CLIENT_ID || process.env.GITHUB_ID) && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {process.env.GOOGLE_CLIENT_ID && (
                <form
                  action={async () => {
                    "use server";
                    await signIn("google", { redirectTo: "/profile" });
                  }}
                >
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full"
                  >
                    Google
                  </Button>
                </form>
              )}
              {process.env.GITHUB_ID && (
                <form
                  action={async () => {
                    "use server";
                    await signIn("github", { redirectTo: "/profile" });
                  }}
                >
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full"
                  >
                    GitHub
                  </Button>
                </form>
              )}
            </div>
          </>
        )}
        <p className="text-center text-sm text-muted-foreground">
          No account?{" "}
          <Link
            href="/register"
            className="underline hover:text-foreground"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
