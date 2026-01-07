import type { Metadata } from "next";
import { Gloock, Poppins } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

const montserrat = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Descubra se sua clínica está preparada para crescer em 2026",
  description:
    "Responda às 5 perguntas dando uma nota de 0 a 10, sendo 0 muito ruim e 10 excelente.",
  icons: {
    icon: "/icons/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>{children}</body>
    </html>
  );
}
