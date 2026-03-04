import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="font-semibold">Admin</h1>
          <Button
            asChild
            variant="ghost"
            size="sm"
          >
            <Link href="/">Home</Link>
          </Button>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
