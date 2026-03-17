'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ReservaExitosaPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // EXTETIX Guardian: Leemos de la URL porque el localStorage está bloqueado
    const reservaData = {
      name: searchParams.get('name') || 'Paciente',
      prof: searchParams.get('prof') || 'Especialista asignado',
      address: searchParams.get('address') || 'Dirección a confirmar',
      fecha: new Date().toLocaleDateString('es-AR'),
    };

    setData(reservaData);
  }, [searchParams]);

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-stone-100 p-10 md:p-16 text-center animate-in fade-in zoom-in duration-700">
        
        <div className="w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-stone-200">
          <svg className="w-8 h-8 text-[#C9A962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <header className="mb-10">
          <span className="text-[10px] tracking-[0.5em] uppercase text-[#C9A962] font-bold mb-4 block">Reserva Confirmada</span>
          <h1 className="text-4xl font-serif italic text-stone-900 mb-2">¡Todo listo, {data.name}!</h1>
          <p className="text-stone-400 text-sm italic">Tu especialista ya tiene agendada la visita.</p>
        </header>

        <div className="bg-stone-50 rounded-[2.5rem] p-8 mb-10 text-left border border-stone-100/50 space-y-4">
          <div className="flex justify-between items-center border-b border-stone-200/40 pb-4">
            <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Profesional</span>
            <span className="text-sm font-medium text-stone-800">{data.prof}</span>
          </div>
          <div className="flex justify-between items-center border-b border-stone-200/40 pb-4">
            <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Dirección</span>
            <span className="text-sm font-medium text-stone-800 text-right max-w-[180px]">{data.address}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Fecha de Reserva</span>
            <span className="text-sm font-medium text-stone-800">{data.fecha}</span>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest leading-relaxed">
            Recibirás los detalles de la preparación previa <br /> vía WhatsApp en las próximas horas.
          </p>
          
          <Link 
            href="/"
            className="inline-block bg-stone-900 text-white px-12 py-5 rounded-full font-bold tracking-[0.3em] text-[10px] hover:bg-[#C9A962] transition-all uppercase shadow-lg shadow-stone-200"
          >
            Volver al Inicio
          </Link>
        </div>

        <footer className="mt-12 pt-8 border-t border-stone-100">
           <p className="font-serif italic text-stone-300 text-sm">Extetix App — Experiencia Premium</p>
        </footer>
      </div>
    </div>
  );
}