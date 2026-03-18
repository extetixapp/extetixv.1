'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/supabase';
import { PopupModal, useCalendlyEventListener } from "react-calendly";
import Link from 'next/link'; // Importante para el nuevo botón

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

  const saveLeadAndOpenCalendly = async (profesional: any) => {
    if (isSubmitting) return;
    setSelectedProf(profesional);
    setIsSubmitting(true);
    const cleanEmail = lead.email.trim().toLowerCase();
    localStorage.setItem('extetix_selected_prof', profesional.name);
    localStorage.setItem('extetix_selected_address', lead.address);
    localStorage.setItem('extetix_user_email', cleanEmail);
    try {
      const { data, error } = await supabase
        .from('pacientes_interesados')
        .insert([{ 
            nombre: lead.name, 
            email: cleanEmail, 
            telefono: lead.phone, 
            direccion: lead.address, 
            tratamiento_interes: String(id), 
            estado: 'interesado',            
            mensaje_adicional: `Profesional seleccionado: ${profesional.name}`
          }])
        .select();
      if (error) throw error;
      if (data && data[0]) {
        localStorage.setItem('extetix_current_lead_id', data[0].id);
      }
      setIsOpen(true);
    } catch (err: any) {
      setIsOpen(true); 
    } finally {
      setIsSubmitting(false);
    }
  };

  useCalendlyEventListener({
    onEventScheduled: (e) => {
      const eventUri = e.data.payload.event.uri;
      const eventUuid = eventUri.split('/').pop();
      const leadId = localStorage.getItem('extetix_current_lead_id') || '';
      const params = new URLSearchParams({
        event_uuid: eventUuid || '',
        lead_id: leadId,
        name: lead.name,
        email: lead.email.trim().toLowerCase(),
        phone: lead.phone,
        prof: selectedProf?.name || '',
        address: lead.address
      });
      router.push(`/pago?${params.toString()}`);
    }
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 md:p-10 font-sans selection:bg-[#C9A962]/20">
      
      {/* --- BOTONES SUPERIORES (ACCESO PROFESIONAL) --- */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 px-4">
        <Link href="/" className="text-[9px] tracking-[0.3em] text-stone-400 uppercase font-bold hover:text-stone-900 transition-colors">
          ← Inicio
        </Link>
        <Link 
          href="/profesional/dashboard" 
          className="bg-white border border-[#C9A962]/30 text-[#C9A962] px-6 py-3 rounded-full text-[9px] tracking-[0.3em] font-bold uppercase hover:bg-[#C9A962] hover:text-white transition-all shadow-sm"
        >
          ¿Sos Profesional? Sumate al Staff
        </Link>
      </div>

      <div className="w-full max-w-4xl bg-white p-8 md:p-16 shadow-[0_10px_50px_rgba(0,0,0,0.02)] border border-stone-100 rounded-[3rem]">
        
        <header className="text-center mb-12">
          <div className="w-12 h-[1px] bg-[#C9A962] mx-auto mb-6"></div>
          <span className="text-[10px] tracking-[0.4em] uppercase text-stone-400 font-bold">Paso {step} de 2</span>
          <h1 className="text-4xl font-serif text-stone-900 mt-3 italic">
            {step === 1 ? 'Tus Datos de Contacto' : 'Elegí a tu Especialista'}
          </h1>
        </header>
        
        {step === 1 ? (
          <div className="max-w-md mx-auto space-y-10 animate-in fade-in duration-700">
            <div className="space-y-6">
              {[
                { id: 'name', label: 'Nombre Completo', type: 'text', value: lead.name },
                { id: 'email', label: 'Email Personal', type: 'email', value: lead.email },
                { id: 'phone', label: 'WhatsApp de Contacto', type: 'tel', value: lead.phone },
                { id: 'address', label: 'Dirección para Visita Médica', type: 'text', value: lead.address }
              ].map((f) => (
                <div key={f.id} className="relative group">
                  <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold ml-4 mb-2 block">{f.label}</label>
                  <input 
                    type={f.type}
                    required
                    value={f.value}
                    className="w-full bg-stone-50 border-b border-stone-100 rounded-2xl px-6 py-4 outline-none focus:border-[#C9A962] transition-all text-stone-800"
                    onChange={e => setLead({...lead, [f.id]: e.target.value})}
                  />
                </div>
              ))}
            </div>
            
            {/* BOTÓN CONTINUAR (OPTIMIZADO) */}
            <button 
              onClick={() => setStep(2)} 
              disabled={!lead.name || !lead.email || !lead.phone || !lead.address}
              className="w-full bg-stone-900 text-white py-6 rounded-full font-bold tracking-[0.4em] text-[10px] hover:bg-[#C9A962] transition-all duration-500 disabled:opacity-20 shadow-2xl shadow-stone-100 uppercase"
            >
              CONTINUAR A ESPECIALISTAS
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PROFESIONALES.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => saveLeadAndOpenCalendly(p)}
                  className={`group cursor-pointer bg-white border border-stone-100 rounded-[2.5rem] overflow-hidden hover:border-[#C9A962]/40 hover:shadow-2xl transition-all duration-700 ${isSubmitting ? 'opacity-50 grayscale' : ''}`}
                >
                  <div className="relative h-72 w-full overflow-hidden">
                    <img 
                      src={p.image} 
                      alt={p.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-8 left-8 text-white">
                       <p className="text-[9px] uppercase tracking-[0.3em] text-[#C9A962] font-black mb-2">Staff Médico</p>
                       <p className="font-serif text-2xl italic tracking-tight">{p.name}</p>
                    </div>
                  </div>
                  <div className="p-8 flex justify-between items-center bg-white">
                    <span className="text-stone-400 text-[10px] uppercase tracking-[0.2em] font-bold">{p.specialty}</span>
                    <span className="w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-[#C9A962] transition-all duration-500 text-stone-300">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => !isSubmitting && setStep(1)} 
              className="block mx-auto text-stone-400 text-[9px] uppercase tracking-[0.4em] hover:text-[#C9A962] transition-colors font-bold"
            >
              ← Modificar mis datos
            </button>
          </div>
        )}

        <PopupModal
          url={selectedProf?.calendlyUrl || ""}
          onModalClose={() => setIsOpen(false)}
          open={isOpen}
          rootElement={typeof window !== 'undefined' ? document.body : undefined!}
          prefill={{
            email: lead.email.trim().toLowerCase(),
            name: lead.name,
            customAnswers: { a1: lead.phone, a2: selectedProf?.name, a3: lead.address }
          }}
        />
      </div>
    </div>
  );
}