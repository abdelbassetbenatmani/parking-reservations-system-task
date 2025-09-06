import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/providers/react-query-provider";

const open_sans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Parking Reservations System",
  description: "Manage your parking reservations efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${open_sans.className} ${open_sans.variable} antialiased`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
