'use client';

import Link from 'next/link';
import { Treatment, formatPrice } from '@/lib/data';

// Iconos SVG inline
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300">
    <path d="M5 12h14"/>
    <path d="m12 5 7 7-7 7"/>
  </svg>
);

interface TreatmentCardProps {
  treatment: Treatment;
  index: number;
}

export default function TreatmentCard({ treatment, index }: TreatmentCardProps) {
  return (
    <div className="group" style={{ animationDelay: `${index * 150}ms` }}>
      <Link href={`/reservar/${treatment.id}`}>
        <div className="card-treatment group h-full flex flex-col">
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
                <ArrowRightIcon />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}