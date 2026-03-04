import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const users = await prisma.user.findMany({
    orderBy: { id: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Users</h2>
      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b last:border-0"
              >
                <td className="px-4 py-3">{user.name ?? "—"}</td>
                <td className="px-4 py-3">{user.email ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      user.role === "ADMIN" ?
                        "font-medium text-primary"
                      : "text-muted-foreground"
                    }
                  >
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
