'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// ============================================
// DATOS INCLUIDOS ADENTRO
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
    bio: 'Especialista en medicina estética con 8 años de experiencia. Formación en Brasil y España.',
    specialties: ['Botox', 'Rellenos', 'Bioestimulación'],
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
    bio: 'Cirujano plástico recertificado en medicina estética mínimamente invasiva.',
    specialties: ['Ácido Hialurónico', 'Bioestimuladores', 'Rinomodelación'],
    rating: 4.8,
    reviewCount: 89,
    latCenter: -34.6552,
    lngCenter: -58.6200,
    radiusKm: 15,
    calendlyUrl: 'https://calendly.com/extetix/turno'
  },
  {
    id: 'dr-sanchez',
    name: 'Dra. Ana Sánchez',
    photoUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80',
    licenseNumber: 'MN 76891',
    bio: 'Médica estética con enfoque holístico. Técnicas avanzadas para resultados naturales.',
    specialties: ['Botox', 'Bioestimuladores', 'Rejuvenecimiento facial'],
    rating: 5.0,
    reviewCount: 64,
    latCenter: -34.6525,
    lngCenter: -58.6438,
    radiusKm: 12,
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
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(price);
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}

function getProfessionalsInRange(patientLat: number, patientLng: number) {
  return professionals
    .map(p => ({
      ...p,
      distance: calculateDistance(p.latCenter, p.lngCenter, patientLat, patientLng)
    }))
    .filter(p => p.distance <= p.radiusKm)
    .sort((a, b) => a.distance - b.distance);
}

// ============================================
// GUARDAR LEAD (interesado) - Simulado por ahora
// ============================================

async function guardarLead(data: any) {
  // TODO: Conectar con Supabase
  console.log('Guardando lead:', data);
  // Ejemplo: await supabase.from('leads').insert(data);
  return { id: 'lead-' + Date.now() };
}

async function actualizarLead(leadId: string, data: any) {
  console.log('Actualizando lead:', leadId, data);
  // TODO: await supabase.from('leads').update(data).eq('id', leadId);
}

// ============================================
// ICONOS SVG
// ============================================

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C9A962]">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/>
    <path d="M19 12H5"/>
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#C9A962" stroke="#C9A962" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ReservarPage() {
  const params = useParams();
  const treatmentId = params.id as string;
  
  const [step, setStep] = useState(1);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [patientData, setPatientData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [availableProfessionals, setAvailableProfessionals] = useState<any[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const treatment = getTreatmentById(treatmentId);

  // ============================================
  // TRACKING: Guardar interesado al entrar
  // ============================================
  useEffect(() => {
    if (treatment) {
      guardarLead({
        estado: 'interesado',
        tratamiento_id: treatmentId,
        tratamiento_nombre: treatment.name,
        tratamiento_precio: treatment.price,
        source: 'web',
        fecha_entrada: new Date().toISOString()
      }).then(lead => {
        setLeadId(lead.id);
      });
    }
  }, [treatmentId, treatment]);

  // Mock geocodificación
  const geocodeAddress = async (address: string) => {
    const mockCoordinates: Record<string, {lat: number; lng: number}> = {
      'ramos mejia': { lat: -34.6538, lng: -58.5644 },
      'moron': { lat: -34.6552, lng: -58.6200 },
      'castelar': { lat: -34.6525, lng: -58.6438 },
      'haedo': { lat: -34.6490, lng: -58.6000 },
      'san justo': { lat: -34.6815, lng: -58.5623 },
    };

    const lowerAddress = address.toLowerCase();
    for (const [key, coords] of Object.entries(mockCoordinates)) {
      if (lowerAddress.includes(key)) return coords;
    }
    return { lat: -34.6538, lng: -58.5644 };
  };

  // ============================================
  // PASO 1 → 2: Completar datos
  // ============================================
  const handleContinue = async () => {
    if (step === 1 && patientData.name && patientData.email && patientData.phone && patientData.address) {
      setLoading(true);
      
      // Actualizar lead a "datos_completos"
      if (leadId) {
        await actualizarLead(leadId, {
          estado: 'datos_completos',
          nombre: patientData.name,
          email: patientData.email,
          telefono: patientData.phone,
          direccion: patientData.address
        });
      }
      
      // Buscar profesionales
      const coords = await geocodeAddress(patientData.address);
      const prosInRange = getProfessionalsInRange(coords.lat, coords.lng);
      setAvailableProfessionals(prosInRange);
      
      setLoading(false);
      setStep(2);
    }
  };

  // ============================================
  // PASO 2 → 3: Seleccionar médico
  // ============================================
  const handleSelectProfessional = async (proId: string) => {
    const pro = professionals.find(p => p.id === proId);
    
    // Actualizar lead a "medico_seleccionado"
    if (leadId && pro) {
      await actualizarLead(leadId, {
        estado: 'medico_seleccionado',
        medico_id: proId,
        medico_nombre: pro.name
      });
    }
    
    setSelectedProfessional(proId);
    setStep(3);
  };

  // ============================================
  // GENERAR URL DE CALENDLY CON DATOS PRE-CARGADOS
  // ============================================
  const getCalendlyUrl = () => {
    if (!selectedProfessional || !patientData.name) return '#';
    
    const pro = professionals.find(p => p.id === selectedProfessional);
    if (!pro) return '#';
    
    // URL con parámetros pre-llenados para tus 3 preguntas de Calendly
    const baseUrl = 'https://calendly.com/extetix/turno';
    const params = new URLSearchParams({
      // Datos estándar de Calendly
      name: patientData.name,
      email: patientData.email,
      // Tus 3 preguntas personalizadas
      a1: patientData.phone,           // WhatsApp (pregunta 1)
      a2: pro.name,                      // Médico (pregunta 2)
      a3: patientData.address,           // Domicilio (pregunta 3)
      // Redirección después de agendar
      redirect_uri: `${window.location.origin}/pago`
    });
    
    return `${baseUrl}?${params.toString()}`;
  };

  if (!treatment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-[#1A1A1A] mb-4">Tratamiento no encontrado</h1>
          <Link href="/" className="text-[#C9A962] hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">
          <Link href="/" className="flex items-center text-gray-600 hover:text-[#C9A962] transition-colors">
            <ArrowLeftIcon />
            <span className="ml-2">Volver</span>
          </Link>
          <span className="ml-auto font-serif text-xl">Extetix</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                step >= s ? 'bg-[#C9A962] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-20 h-1 mx-2 ${step > s ? 'bg-[#C9A962]' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* ============================================
            PASO 1: Datos del paciente
            ============================================ */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h1 className="font-serif text-3xl text-[#1A1A1A] mb-2">Reservar {treatment.name}</h1>
            <p className="text-gray-600 mb-8">{formatPrice(treatment.price)} · {treatment.durationMin} minutos</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                <input
                  type="text"
                  value={patientData.name}
                  onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#C9A962] focus:ring-1 focus:ring-[#C9A962] outline-none transition-all"
                  placeholder="María González"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={patientData.email}
                  onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#C9A962] focus:ring-1 focus:ring-[#C9A962] outline-none transition-all"
                  placeholder="maria@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  value={patientData.phone}
                  onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#C9A962] focus:ring-1 focus:ring-[#C9A962] outline-none transition-all"
                  placeholder="+54 9 11 1234 5678"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección completa</label>
                <input
                  type="text"
                  value={patientData.address}
                  onChange={(e) => setPatientData({...patientData, address: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#C9A962] focus:ring-1 focus:ring-[#C9A962] outline-none transition-all"
                  placeholder="Av. Rivadavia 1234, Ramos Mejía"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Incluí localidad (Ramos Mejía, Morón, Castelar, Haedo, San Justo)
                </p>
              </div>

              <button
                onClick={handleContinue}
                disabled={!patientData.name || !patientData.email || !patientData.phone || !patientData.address || loading}
                className="w-full bg-[#1A1A1A] text-white py-4 rounded-full font-medium transition-all duration-300 hover:bg-[#C9A962] hover:text-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Buscando profesionales...' : 'Continuar'}
              </button>
            </div>
          </div>
        )}

        {/* ============================================
            PASO 2: Selección de profesional
            ============================================ */}
        {step === 2 && (
          <div>
            <h1 className="font-serif text-3xl text-[#1A1A1A] mb-2">Profesionales disponibles</h1>
            <p className="text-gray-600 mb-8 flex items-center gap-2">
              <MapPinIcon />
              Cerca de: {patientData.address}
            </p>

            {availableProfessionals.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <p className="text-gray-600 mb-4">No hay profesionales disponibles en tu zona.</p>
                <button 
                  onClick={() => setStep(1)}
                  className="text-[#C9A962] hover:underline"
                >
                  Modificar dirección
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {availableProfessionals.map((pro) => (
                  <div
                    key={pro.id}
                    onClick={() => handleSelectProfessional(pro.id)}
                    className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-[#C9A962] border-2 border-transparent"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={pro.photoUrl}
                        alt={pro.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-serif text-xl text-[#1A1A1A]">{pro.name}</h3>
                          <span className="text-xs bg-[#C9A962]/10 text-[#C9A962] px-2 py-1 rounded-full">
                            A {pro.distance} km
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">Mat. {pro.licenseNumber}</p>
                        <div className="flex items-center gap-1 mb-2">
                          <StarIcon />
                          <span className="text-sm font-medium">{pro.rating}</span>
                          <span className="text-sm text-gray-500">({pro.reviewCount} reseñas)</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{pro.bio}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {pro.specialties.map((spec: string) => (
                            <span key={spec} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-[#C9A962]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m9 18 6-6-6-6"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================
            PASO 3: Ir a Calendly
            ============================================ */}
        {step === 3 && selectedProfessional && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <h1 className="font-serif text-3xl text-[#1A1A1A] mb-4">¡Casi listo!</h1>
            <p className="text-gray-600 mb-8">
              Te llevaremos a Calendly para que elijas fecha y hora. 
              <br/>Tus datos ya están pre-cargados.
            </p>
            
            {(() => {
              const pro = professionals.find(p => p.id === selectedProfessional);
              return pro ? (
                <div className="mb-8 p-4 bg-[#F5F5F5] rounded-lg text-left max-w-md mx-auto">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={pro.photoUrl} alt={pro.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-[#1A1A1A]">{pro.name}</p>
                      <p className="text-sm text-gray-600">{formatPrice(treatment.price)}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Paciente:</span> {patientData.name}</p>
                    <p><span className="font-medium">Dirección:</span> {patientData.address}</p>
                    <p><span className="font-medium">WhatsApp:</span> {patientData.phone}</p>
                  </div>
                </div>
              ) : null;
            })()}

            <a
              href={getCalendlyUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                // Actualizar estado antes de ir a Calendly
                if (leadId) {
                  actualizarLead(leadId, { estado: 'turno_agendado_iniciado' });
                }
              }}
              className="inline-block bg-[#C9A962] text-[#1A1A1A] px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:bg-[#1A1A1A] hover:text-white"
            >
              Elegir fecha y hora en Calendly →
            </a>
            
            <p className="text-sm text-gray-500 mt-6">
              Después de agendar, volverás para confirmar el pago
            </p>
          </div>
        )}
      </div>
    </div>
  );
}