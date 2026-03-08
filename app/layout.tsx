import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Extetix | Medicina Estética a Domicilio',
  description:
    'Tratamientos premium de medicina estética en la comodidad de tu hogar. Zona Oeste de Buenos Aires.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-[#FAFAFA] text-[#1A1A1A]">
        {children}
      </body>
    </html>
  );
}
