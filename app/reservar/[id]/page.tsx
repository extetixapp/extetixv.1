'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/supabase';
import { PopupModal, useCalendlyEventListener } from "react-calendly";
import Image from 'next/image';

// Data de profesionales (Estética Clínica Premium)
const PROFESIONALES = [
  {
    id: 'maria-lopez',
    name: 'Dra. María López',
    specialty: 'Dermatóloga Estética',
    image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400',
    calendlyUrl: 'https://calendly.com/extetixapp/estetica-premium'
  },
  {
    id: 'carlos-martinez',
    name: 'Dr. Carlos Martínez',
    specialty: 'Especialista en Inyectables',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    calendlyUrl: 'https://calendly.com/extetixapp/estetica-premium'
  }
];

export default function ReservarPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProf, setSelectedProf] = useState<any>(null);
  
  const [lead, setLead] = useState({ 
    name: '', email: '', phone: '', address: ''
  });

  // EXTETIX Guardian: Persistencia y Blindaje de Datos
  const saveLeadAndOpenCalendly = async (profesional: any) => {
    if (isSubmitting) return;
    
    setSelectedProf(profesional);
    setIsSubmitting(true);

    // Guardamos localmente (como plan B)
    localStorage.setItem('extetix_selected_prof', profesional.name);
    localStorage.setItem('extetix_selected_address', lead.address);
    
    try {
      const { data, error } = await supabase
        .from('pacientes_interesados')
        .insert([{ 
            nombre: lead.name, 
            email: lead.email.trim().toLowerCase(), 
            telefono: lead.phone, 
            direccion: lead.address, 
            tratamiento_interes: String(id), 
            estado: 'interesado',            
            mensaje_adicional: `Profesional seleccionado: ${profesional.name}`
          }])
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        // Guardamos el ID en memoria local (Plan B)
        localStorage.setItem('extetix_current_lead_id', data[0].id);
      }
      
      setIsOpen(true);
    } catch (err: any) {
      console.error("EXTETIX_GUARDIAN_SYNC_ERROR:", err.message);
      setIsOpen(true); // Abrimos igual para no perder la venta
    } finally {
      setIsSubmitting(false);
    }
  };

  useCalendlyEventListener({
    onEventScheduled: (e) => {
      const eventUuid = e.data.payload.event.uri.split('/').pop();
      // Recuperamos el ID que acabamos de guardar
      const leadId = localStorage.getItem('extetix_current_lead_id') || '';
      
      // EL PUENTE: Pasamos todo por URL para saltar el bloqueo de storage del navegador
      const params = new URLSearchParams({
        event_uuid: eventUuid || '',
        lead_id: leadId,
        name: lead.name,
        email: lead.email.trim().toLowerCase(), // Vital para encontrarlo en la BD luego
        phone: lead.phone,
        prof: selectedProf?.name || '',
        address: lead.address
      });
      
      router.push(`/pago?${params.toString()}`);
    }
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 md:p-10 font-sans selection:bg-[#C9A962]/20">
      <div className="w-full max-w-4xl bg-white p-8 md:p-16 shadow-[0_10px_50px_rgba(0,0,0,0.03)] border border-stone-100 rounded-[3rem]">
        
        <header className="text-center mb-12">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A962] font-bold">Paso {step} de 2</span>
          <h1 className="text-4xl font-serif text-stone-900 mt-2 capitalize italic">
            {step === 1 ? 'Tus Datos' : 'Tu Especialista'}
          </h1>
        </header>
        
        {step === 1 ? (
          <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-6">
              {[
                { id: 'name', label: 'Nombre Completo', type: 'text', value: lead.name },
                { id: 'email', label: 'Email', type: 'email', value: lead.email },
                { id: 'phone', label: 'WhatsApp', type: 'tel', value: lead.phone },
                { id: 'address', label: 'Dirección de atención', type: 'text', value: lead.address }
              ].map((f) => (
                <div key={f.id} className="relative">
                  <input 
                    type={f.type}
                    required
                    value={f.value}
                    placeholder={f.label}
                    className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-1 focus:ring-[#C9A962] transition-all text-stone-800 placeholder:text-stone-300"
                    onChange={e => setLead({...lead, [f.id]: e.target.value})}
                  />
                </div>
              ))}
            </div>
            <button 
              onClick={() => setStep(2)} 
              disabled={!lead.name || !lead.email || !lead.phone || !lead.address}
              className="w-full bg-stone-900 text-white py-5 rounded-full font-bold tracking-widest text-[10px] hover:bg-[#C9A962] transition-all disabled:opacity-20 shadow-xl shadow-stone-200 uppercase"
            >
              CONTINUAR A SELECCIÓN
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROFESIONALES.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => saveLeadAndOpenCalendly(p)}
                  className={`group cursor-pointer bg-white border border-stone-100 rounded-[2rem] overflow-hidden hover:border-[#C9A962] hover:shadow-2xl hover:shadow-[#C9A962]/10 transition-all duration-500 ${isSubmitting ? 'opacity-50 grayscale' : ''}`}
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <img 
                      src={p.image} 
                      alt={p.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent opacity-60"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                       <p className="text-[10px] uppercase tracking-widest opacity-80 mb-1">Especialista</p>
                       <p className="font-serif text-2xl italic">{p.name}</p>
                    </div>
                    {isSubmitting && selectedProf?.id === p.id && (
                      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex justify-between items-center">
                    <span className="text-stone-400 text-xs uppercase tracking-widest font-medium">{p.specialty}</span>
                    <span className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all text-stone-300">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => !isSubmitting && setStep(1)} 
              className="block mx-auto text-stone-400 text-[10px] uppercase tracking-[0.3em] hover:text-stone-900 transition-colors"
            >
              ← Volver a mis datos
            </button>
          </div>
        )}

        <PopupModal
          url={selectedProf?.calendlyUrl || ""}
          onModalClose={() => setIsOpen(false)}
          open={isOpen}
          rootElement={typeof window !== 'undefined' ? document.body : undefined!}
          prefill={{
            email: lead.email,
            name: lead.name,
            customAnswers: { a1: lead.phone, a2: selectedProf?.name, a3: lead.address }
          }}
        />
      </div>
    </div>
  );
}