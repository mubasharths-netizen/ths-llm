import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "THS LAB LMS",
    template: "%s · THS LAB LMS",
  },
  description:
    "A professional IT learning platform where students learn technology, practice skills, receive AI guidance and improve academic performance.",
  icons: {
    icon: "/ths-logo.png",
    apple: "/ths-logo.png",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  if (process.env.VERCEL) {
    const { restoreLmsDatabase } = await import("@/lib/db-cloud");
    await restoreLmsDatabase();
  }
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-canvas text-text font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
