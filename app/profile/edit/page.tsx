import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileEditForm } from "./profile-edit-form";
import { Button } from "@/components/ui/button";

export default async function ProfileEditPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, bio: true },
  });

  if (!user) redirect("/login");

  return (
    <main className="container max-w-2xl py-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit profile</h1>
          <Button
            asChild
            variant="ghost"
            size="sm"
          >
            <Link href="/profile">Cancel</Link>
          </Button>
        </div>
        <ProfileEditForm
          defaultValues={{
            name: user.name ?? "",
            bio: user.bio ?? "",
            image: user.image ?? "",
          }}
        />
      </div>
    </main>
  );
}
