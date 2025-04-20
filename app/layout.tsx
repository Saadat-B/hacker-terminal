import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Type Like a Hacker",
  description: "Simulate hacking terminal with keyboard input",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 