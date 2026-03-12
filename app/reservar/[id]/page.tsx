'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/supabase';
import { PopupModal, useCalendlyEventListener } from "react-calendly";

export default function ReservarPage() {
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [lead, setLead] = useState({ name: '', email: '', phone: '', address: '', prof: '' });
  const [isOpen, setIsOpen] = useState(false);

  // Hook oficial para capturar el turno y redirigir
  useCalendlyEventListener({
    onEventScheduled: (e: any) => {
      const { event } = e?.data?.payload || {};
      const params = new URLSearchParams({ 
        event_uuid: event?.uri?.split('/').pop() || '', 
        name: lead.name, email: lead.email, a1: lead.phone, a2: lead.prof, a3: lead.address 
      });
      window.location.href = `/pago?${params.toString()}`;
    }
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white p-12 shadow-sm border border-gray-100 rounded-2xl">
        <h1 className="text-4xl font-serif text-center mb-10 text-gray-900">Reservar {id}</h1>
        
        {step === 1 ? (
          <div className="space-y-6">
            {['name', 'email', 'phone', 'address'].map(f => (
              <div key={f}>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{f}</label>
                <input className="w-full border-b border-gray-200 py-2 outline-none focus:border-black" 
                  onChange={e => setLead({...lead, [f]: e.target.value})} />
              </div>
            ))}
            <button onClick={() => setStep(2)} className="w-full bg-black text-white py-4 mt-8 rounded-full">CONTINUAR</button>
          </div>
        ) : (
          <div className="space-y-4">
            {['Dra. María López', 'Dr. Carlos Martínez'].map(p => (
              <div key={p} className="border p-4 rounded-xl cursor-pointer hover:border-black transition-all" 
                onClick={() => { setLead({...lead, prof: p}); setIsOpen(true); }}>
                <p className="font-bold">{p}</p>
              </div>
            ))}
          </div>
        )}

        <PopupModal
          url="https://calendly.com/extetixapp/estetica-premium"
          onModalClose={() => setIsOpen(false)}
          open={isOpen}
          rootElement={typeof window !== 'undefined' ? document.body : undefined!}
          prefill={{
            email: lead.email,
            name: lead.name,
            customAnswers: { a1: lead.phone, a2: lead.prof, a3: lead.address }
          }}
        />
      </div>
    </div>
  );
}