// app/layout.tsx
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css"; // Ensure this import is there

const montserrat = Montserrat({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-montserrat', // THIS IS KEY for CSS variable
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  preload: true,
  fallback: ['system-ui', 'sans-serif']
});

export const metadata: Metadata = {
  title: "Liya's React task",
  description: "React task",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}> 
        {children}
      </body>
    </html>
  );
}