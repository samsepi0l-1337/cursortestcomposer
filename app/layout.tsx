import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "User Management",
  description: "Auth, profile, and admin dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
