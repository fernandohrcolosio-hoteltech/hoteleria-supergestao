import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hub de Melhoria Contínua",
  description: "Ferramentas de gestão com IA integrada",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://secure.mlstatic.com",
        "https://checkout.mercadopago.com",
        "https://www.mercadopago.com",
        "https://*.mercadopago.com",
      ],
      frameSrc: [
        "'self'",
        "https://checkout.mercadopago.com",
        "https://www.mercadopago.com",
        "https://*.mercadopago.com",
      ],
      connectSrc: [
        "'self'",
        "https://api.mercadopago.com",
        "https://checkout.mercadopago.com",
        "https://www.mercadopago.com",
        "https://*.mercadopago.com",
        "https://trwsrekqqpvqmdgzjxjx.supabase.co",
      ],
      imgSrc: ["'self'", "data:", "https:"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://secure.mlstatic.com",
        "https://checkout.mercadopago.com",
      ],
      fontSrc: ["'self'", "data:"],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${dmSans.variable} ${dmSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream" style={{ color: "var(--text-main)" }}>
        {children}
      </body>
    </html>
  );
}
