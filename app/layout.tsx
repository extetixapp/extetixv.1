import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

// Configuración de Fuente Serif (Elegancia Médica)
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif', // Variable CSS para usar en Tailwind como font-serif
  display: 'swap',
});

// Configuración de Fuente Sans (Claridad y Lectura)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans', // Variable CSS para usar en Tailwind como font-sans
  display: 'swap',
});

// Configuración de Viewport para evitar saltos visuales en móviles
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, 
  userScalable: false, // Mantiene la interfaz fija y profesional
};

export const metadata: Metadata = {
  title: 'EXTETIX | Medicina Estética a Domicilio',
  description:
    'Tratamientos premium de medicina estética en la comodidad de tu hogar. Zona Oeste de Buenos Aires.',
  icons: {
    icon: '/favicon.ico', // Asegura que el favicon que veo en tu captura se cargue
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Inyectamos las variables de fuente y activamos el scroll suave
    <html lang="es" className={`${cormorant.variable} ${inter.variable} scroll-smooth`}>
      <body className={`
        font-sans           /* Fuente por defecto */
        antialiased         /* Renderizado de tipografía más fino */
        bg-[#FAFAFA]        /* Fondo "Off-White" clínico */
        text-[#1A1A1A]      /* Texto casi negro para alto contraste suave */
        selection:bg-stone-200 /* Color de resaltado de texto elegante */
        min-h-screen        /* Asegura que el fondo cubra toda la pantalla */
      `}>
        {/* Main wrapper para control de estructura */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}