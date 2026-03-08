'use client';

import Link from 'next/link';

// ============================================
// DATOS DE TRATAMIENTOS (todo en uno)
// ============================================

interface Treatment {
  id: string;
  name: string;
  category: 'botox' | 'acido_hialuronico' | 'bioestimuladores';
  description: string;
  price: number;
  durationMin: number;
  imageUrl: string;
}

const treatments: Treatment[] = [
  {
    id: 'botox',
    name: 'Botox',
    category: 'botox',
    description: 'Tratamiento neuromodulador que suaviza líneas de expresión y arrugas dinámicas. Efecto natural y rejuvenecedor que dura entre 4-6 meses.',
    price: 45000,
    durationMin: 30,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
  },
  {
    id: 'acido-hialuronico',
    name: 'Ácido Hialurónico',
    category: 'acido_hialuronico',
    description: 'Rellenos dérmicos de última generación para restaurar volumen, definir contornos e hidratar profundamente. Resultados inmediatos y naturales.',
    price: 68000,
    durationMin: 45,
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
  },
  {
    id: 'bioestimuladores',
    name: 'Bioestimuladores',
    category: 'bioestimuladores',
    description: 'Activadores de colágeno propio que mejoran la calidad de la piel desde el interior. Ideal para flacidez, luminosidad y rejuvenecimiento global.',
    price: 55000,
    durationMin: 40,
    imageUrl: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=800&q=80',
  }
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(price);
}

// ============================================
// ICONOS SVG (inline, sin dependencias)
// ============================================

const SparklesIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C9A962]">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/>
    <path d="M19 17v4"/>
    <path d="M3 5h4"/>
    <path d="M17 19h4"/>
  </svg>
);

const MapPinIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C9A962]">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ShieldIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C9A962]">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const ChevronDownIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const ClockIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ArrowRightIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/>
    <path d="m12 5 7 7-7 7"/>
  </svg>
);

// ============================================
// COMPONENTE: CARD DE TRATAMIENTO
// ============================================

function TreatmentCard({ treatment, index }: { treatment: Treatment; index: number }) {
  return (
    <div className="group" style={{ animationDelay: `${index * 150}ms` }}>
      <Link href={`/reservar/${treatment.id}`}>
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-[#C9A962]/10 hover:-translate-y-2 cursor-pointer h-full flex flex-col">
          
          {/* Imagen */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={treatment.imageUrl}
              alt={treatment.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-[#C9A962]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Contenido */}
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-[#C9A962] font-medium">
                {treatment.category === 'botox' ? 'Neuromodulador' : 
                 treatment.category === 'acido_hialuronico' ? 'Relleno' : 'Bioestimulación'}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon />
                <span className="ml-1">{treatment.durationMin} min</span>
              </div>
            </div>

            <h3 className="text-2xl font-serif text-[#1A1A1A] mb-3 group-hover:text-[#C9A962] transition-colors duration-300">
              {treatment.name}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
              {treatment.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xl font-medium text-[#1A1A1A]">
                {formatPrice(treatment.price)}
              </span>
              <span className="flex items-center text-sm font-medium text-[#1A1A1A] group-hover:text-[#C9A962] transition-colors duration-300">
                Reservar
                <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300">
                  <ArrowRightIcon />
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ============================================
// PÁGINA PRINCIPAL (LANDING COMPLETA)
// ============================================

export default function Home() {
  return (
    <main className="min-h-screen">
      
      {/* NAVEGACIÓN FIJA */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon size={24} />
            <span className="font-serif text-2xl text-[#1A1A1A]">Extetix</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#tratamientos" className="hover:text-[#C9A962] transition-colors">Tratamientos</a>
            <a href="#como-funciona" className="hover:text-[#C9A962] transition-colors">Cómo funciona</a>
          </div>
          <button className="bg-[#1A1A1A] text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-[#C9A962] hover:text-[#1A1A1A] text-sm">
            Reservar ahora
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&q=80" 
            alt="Spa premium" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-2 bg-[#C9A962]/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-[#C9A962]/30">
            Zona Oeste de Buenos Aires
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
            Medicina estética<br />
            de <span className="text-[#C9A962]">precisión</span>,<br />
            en tu espacio
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
            Profesionales certificados que llevan tratamientos premium a la comodidad de tu hogar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#tratamientos" className="bg-[#C9A962] text-[#1A1A1A] px-8 py-4 rounded-full font-medium transition-all duration-300 hover:bg-white">
              Descubrir tratamientos
            </a>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full transition-all duration-300 hover:bg-white hover:text-[#1A1A1A]">
              Conocer profesionales
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 animate-bounce">
          <ChevronDownIcon size={32} />
        </div>
      </section>

      {/* FEATURES BAR */}
      <section className="bg-[#1A1A1A] text-white py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 justify-center">
            <MapPinIcon size={28} />
            <div>
              <p className="font-medium">A domicilio</p>
              <p className="text-sm text-white/70">Zona Oeste de Buenos Aires</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <ShieldIcon size={28} />
            <div>
              <p className="font-medium">Profesionales certificados</p>
              <p className="text-sm text-white/70">Matriculados y con experiencia</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <SparklesIcon size={28} />
            <div>
              <p className="font-medium">Experiencia premium</p>
              <p className="text-sm text-white/70">Insumos de máxima calidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRATAMIENTOS */}
      <section id="tratamientos" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#C9A962] text-sm uppercase tracking-widest font-medium">
            Nuestros servicios
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mt-4 mb-6">
            Tratamientos diseñados<br />para vos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tecnología de vanguardia en medicina estética, aplicada con precisión artesanal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {treatments.map((treatment, index) => (
            <TreatmentCard key={treatment.id} treatment={treatment} index={index} />
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="py-24 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#C9A962] text-sm uppercase tracking-widest font-medium">
              Proceso simple
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mt-4">
              Cómo funciona
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <span className="font-serif text-6xl text-[#C9A962]/30">01</span>
              <h3 className="font-serif text-2xl text-[#1A1A1A] mt-4 mb-3">Elegí tu tratamiento</h3>
              <p className="text-gray-600">Seleccioná entre Botox, Ácido Hialurónico o Bioestimuladores.</p>
            </div>
            <div className="text-center">
              <span className="font-serif text-6xl text-[#C9A962]/30">02</span>
              <h3 className="font-serif text-2xl text-[#1A1A1A] mt-4 mb-3">Indicá tu ubicación</h3>
              <p className="text-gray-600">Te mostramos los profesionales disponibles en tu zona.</p>
            </div>
            <div className="text-center">
              <span className="font-serif text-6xl text-[#C9A962]/30">03</span>
              <h3 className="font-serif text-2xl text-[#1A1A1A] mt-4 mb-3">Agendá y disfrutá</h3>
              <p className="text-gray-600">Reservá, pagá online y recibí el tratamiento en tu hogar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A1A1A] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <SparklesIcon size={24} />
              <span className="font-serif text-2xl">Extetix</span>
            </div>
            <p className="text-white/70 max-w-sm">
              Medicina estética de precisión en la comodidad de tu hogar. Zona Oeste de Buenos Aires.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Contacto</h4>
            <p className="text-white/70 text-sm">info@extetix.com</p>
            <p className="text-white/70 text-sm mt-2">+54 9 11 1234 5678</p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <p className="text-white/70 text-sm">Términos y condiciones</p>
            <p className="text-white/70 text-sm mt-2">Política de privacidad</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          © 2024 Extetix. Todos los derechos reservados.
        </div>
      </footer>
    </main>
  );
}