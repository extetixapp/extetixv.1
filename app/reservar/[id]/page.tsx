'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/supabase';

// ============================================
// INTERFACES Y DATOS
// ============================================

interface Treatment {
  id: string;
  name: string;
  price: number;
  durationMin: number;
}

interface Professional {
  id: string;
  name: string;
  photoUrl: string;
  licenseNumber: string;
  bio: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  latCenter: number;
  lngCenter: number;
  radiusKm: number;
  calendlyUrl: string;
}

const treatments: Treatment[] = [
  { id: 'botox', name: 'Botox', price: 45000, durationMin: 30 },
  { id: 'acido-hialuronico', name: 'Ácido Hialurónico', price: 68000, durationMin: 45 },
  { id: 'bioestimuladores', name: 'Bioestimuladores', price: 55000, durationMin: 40 }
];

const professionals: Professional[] = [
  {
    id: 'dr-lopez',
    name: 'Dra. María López',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
    licenseNumber: 'MN 85432',
    bio: 'Especialista en medicina estética con 8 años de experiencia.',
    specialties: ['Botox', 'Rellenos'],
    rating: 4.9,
    reviewCount: 127,
    latCenter: -34.6538,
    lngCenter: -58.5644,
    radiusKm: 10,
    calendlyUrl: 'https://calendly.com/extetix/turno'
  },
  {
    id: 'dr-martinez',
    name: 'Dr. Carlos Martínez',
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
    licenseNumber: 'MN 91245',
    bio: 'Cirujano plástico recertificado.',
    specialties: ['Ácido Hialurónico', 'Bioestimuladores'],
    rating: 4.8,
    reviewCount: 89,
    latCenter: -34.6552,
    lngCenter: -58.6200,
    radiusKm: 15,
    calendlyUrl: 'https://calendly.com/extetix/turno'
  }
];

// ============================================
// FUNCIONES UTILITARIAS
// ============================================

function getTreatmentById(id: string): Treatment | undefined {
  return treatments.find(t => t.id === id);
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(price);
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}

function getProfessionalsInRange(patientLat: number, patientLng: number): (Professional & { distance: number })[] {
  return professionals
    .map(p => ({ ...p, distance: calculateDistance(p.latCenter, p.lngCenter, patientLat, patientLng) }))
    .filter(p => p.distance <= p.radiusKm)
    .sort((a, b) => a.distance - b.distance);
}

// ============================================
// FUNCIONES SUPABASE
// ============================================

async function guardarLead(data: any) {
  const { data: lead, error } = await supabase.from('pacientes_interesados').insert([data]).select().single();
  if (error) { console.error('Error DB:', error); return null; }
  return lead;
}

async function actualizarLead(leadId: string, data: any) {
  const { data: lead, error } = await supabase.from('pacientes_interesados').update(data).eq('id', leadId).select().single();
  if (error) { console.error('Error DB:', error); return null; }
  return lead;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ReservarPage() {
  const params = useParams();
  const treatmentId = params.id as string;
  const treatment = getTreatmentById(treatmentId);

  const [step, setStep] = useState(1);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [patientData, setPatientData] = useState({ name: '', email: '', phone: '', address: '' });
  const [availableProfessionals, setAvailableProfessionals] = useState<any[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (treatment && !leadId) {
      guardarLead({
        estado: 'interesado',
        tratamiento_interes: treatment.name,
        nombre: 'Pendiente',
        telefono: '0'
      }).then(lead => lead && setLeadId(lead.id));
    }
  }, [treatmentId, treatment, leadId]);

  const handleContinue = async () => {
    setLoading(true);
    if (leadId) {
      await actualizarLead(leadId, {
        estado: 'datos_completos',
        nombre: patientData.name,
        email: patientData.email,
        telefono: patientData.phone,
        direccion: patientData.address
      });
    }
    setAvailableProfessionals(getProfessionalsInRange(-34.6538, -58.5644)); // Mock coords
    setLoading(false);
    setStep(2);
  };

  // MODIFICACIÓN: Nueva función para manejar la redirección a Calendly con datos precargados
  const handleProfessionalSelect = (prof: Professional) => {
    setSelectedProfessional(prof.id);
    const baseUrl = prof.calendlyUrl;
    const queryParams = new URLSearchParams({
      name: patientData.name,
      email: patientData.email,
      a1: patientData.phone,
      a2: patientData.address,
      state: leadId || "" // Enviamos leadId para que Calendly lo devuelva al redirigir al pago
    });
    window.location.href = `${baseUrl}?${queryParams.toString()}`;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-2xl">
        
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Reservar</p>
          <h1 className="text-4xl font-serif text-gray-900">{treatment?.name}</h1>
          <p className="text-gray-500 mt-2">{treatment ? formatPrice(treatment.price) : ''} • {treatment?.durationMin} minutos</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-400 mb-2 uppercase">Nombre Completo</label>
              <input className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors" placeholder="María González" onChange={e => setPatientData({...patientData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-400 mb-2 uppercase">Email</label>
              <input className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors" placeholder="maria@email.com" onChange={e => setPatientData({...patientData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-400 mb-2 uppercase">Teléfono / Whatsapp</label>
              <input className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors" placeholder="+54 9 11 1234 5678" onChange={e => setPatientData({...patientData, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-400 mb-2 uppercase">Dirección Completa</label>
              <input className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors" placeholder="Calle, Número, Localidad" onChange={e => setPatientData({...patientData, address: e.target.value})} />
            </div>
            
            <button onClick={handleContinue} className="w-full bg-black text-white py-4 mt-8 rounded-full hover:bg-gray-800 transition-all font-medium tracking-wide">
              {loading ? 'Procesando...' : 'CONTINUAR'}
            </button>
          </div>
        )}

        {/* MODIFICACIÓN: Agregado el step 2 para mostrar lista de profesionales */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-serif text-center mb-6">Selecciona un profesional</h2>
            {availableProfessionals.map((prof) => (
              <div 
                key={prof.id} 
                className="border p-4 rounded-xl flex items-center gap-4 hover:border-black transition-all cursor-pointer" 
                onClick={() => handleProfessionalSelect(prof)}
              >
                <img src={prof.photoUrl} alt={prof.name} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold">{prof.name}</h3>
                  <p className="text-xs text-gray-500">{prof.bio}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
