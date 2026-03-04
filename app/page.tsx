import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground max-w-md">
          Auth, profile CRUD, and admin dashboard.
        </p>
        <div className="flex gap-4">
          {session ?
            <>
              <Button asChild>
                <Link href="/profile">Profile</Link>
              </Button>
              {session.user.role === "ADMIN" && (
                <Button
                  asChild
                  variant="secondary"
                >
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button
                  type="submit"
                  variant="ghost"
                >
                  Sign out
                </Button>
              </form>
            </>
          : <>
              <Button asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button
                asChild
                variant="outline"
              >
                <Link href="/register">Register</Link>
              </Button>
            </>
          }
        </div>
      </div>
    </main>
  );
}
