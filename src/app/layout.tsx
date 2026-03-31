import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MIT Agents — AI Agent Platform",
  description:
    "Create, deploy, and manage trigger-based AI agents powered by Artemis. No code required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
