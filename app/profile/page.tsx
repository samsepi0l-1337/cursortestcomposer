import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      role: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <main className="container max-w-2xl py-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Profile</h1>
          <Button
            asChild
            variant="outline"
            size="sm"
          >
            <Link href="/profile/edit">Edit</Link>
          </Button>
        </div>
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="flex items-center gap-4">
            {user.image ?
              <Image
                src={user.image}
                alt={user.name ?? "Avatar"}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            : <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-2xl font-medium text-muted-foreground">
                {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
              </div>
            }
            <div>
              <p className="font-medium">{user.name ?? "No name"}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.role === "ADMIN" && (
                <span className="inline-block mt-1 text-xs font-medium text-primary">
                  Admin
                </span>
              )}
            </div>
          </div>
          {user.bio && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Bio
              </p>
              <p className="text-sm">{user.bio}</p>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
          >
            <Link href="/">Back to home</Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button
              type="submit"
              variant="ghost"
              size="sm"
            >
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
