import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: "POS - Next.js",
  description: "POS - Next.js",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${outfit.className} bg-gray-200`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
