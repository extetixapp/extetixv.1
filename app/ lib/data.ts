// ============================================
// TRATAMIENTOS
// ============================================

export interface Treatment {
  id: string;
  name: string;
  category: 'botox' | 'acido_hialuronico' | 'bioestimuladores';
  description: string;
  price: number;
  durationMin: number;
  imageUrl: string;
  contraindications: string[];
  preCare: string[];
  postCare: string[];
}

export const treatments: Treatment[] = [
  {
    id: 'botox',
    name: 'Botox',
    category: 'botox',
    description: 'Tratamiento neuromodulador que suaviza líneas de expresión y arrugas dinámicas. Efecto natural y rejuvenecedor que dura entre 4-6 meses.',
    price: 45000,
    durationMin: 30,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    contraindications: ['Embarazo o lactancia', 'Enfermedades neuromusculares', 'Infecciones en zona de aplicación'],
    preCare: ['Evitar alcohol 24h antes', 'No tomar antiinflamatorios 3 días previos', 'Venir sin maquillaje'],
    postCare: ['No acostarse 4 horas post-tratamiento', 'Evitar ejercicio 24h', 'No masajear la zona']
  },
  {
    id: 'acido-hialuronico',
    name: 'Ácido Hialurónico',
    category: 'acido_hialuronico',
    description: 'Rellenos dérmicos de última generación para restaurar volumen, definir contornos e hidratar profundamente. Resultados inmediatos y naturales.',
    price: 68000,
    durationMin: 45,
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
    contraindications: ['Embarazo o lactancia', 'Antecedentes de ciclos de ácido hialurónico recientes', 'Infecciones activas'],
    preCare: ['Evitar aspirinas 7 días antes', 'No consumir alcohol 48h previas', 'Informar sobre antecedentes alérgicos'],
    postCare: ['Aplicar hielo intermitente 24h', 'Evitar exposición solar directa 72h', 'No realizar tratamientos dentales 2 semanas']
  },
  {
    id: 'bioestimuladores',
    name: 'Bioestimuladores',
    category: 'bioestimuladores',
    description: 'Activadores de colágeno propio que mejoran la calidad de la piel desde el interior. Ideal para flacidez, luminosidad y rejuvenecimiento global.',
    price: 55000,
    durationMin: 40,
    imageUrl: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=800&q=80',
    contraindications: ['Embarazo o lactancia', 'Enfermedades autoinmunes activas', 'Cicatrización alterada'],
    preCare: ['Suspender retinol 1 semana antes', 'Hidratación intensa días previos', 'Evitar depilación facial'],
    postCare: ['Masajes específicos según indicación médica', 'Hidratación constante', 'Protector solar obligatorio']
  }
];

// ============================================
// PROFESIONALES (Mock data para testing)
// ============================================

export interface Professional {
  id: string;
  name: string;
  photoUrl: string;
  licenseNumber: string;
  bio: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  // Centro de cobertura (donde inicia sus recorridos)
  addressCenter: string;
  latCenter: number;
  lngCenter: number;
  radiusKm: number; // Radio máximo de cobertura
  isAvailable: boolean;
  isActive: boolean; // Aprobado por admin
  calendlyUrl: string;
  commissionRate: number; // 0.70 = 70% para médico
}

export const professionals: Professional[] = [
  {
    id: 'dr-lopez',
    name: 'Dra. María López',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
    licenseNumber: 'MN 85432',
    bio: 'Especialista en medicina estética con 8 años de experiencia. Formación en Brasil y España. Enfoque natural y personalizado.',
    specialties: ['Botox', 'Rellenos', 'Bioestimulación'],
    rating: 4.9,
    reviewCount: 127,
    addressCenter: 'Ramos Mejía, Buenos Aires',
    latCenter: -34.6538,
    lngCenter: -58.5644,
    radiusKm: 10,
    isAvailable: true,
    isActive: true,
    calendlyUrl: 'https://calendly.com/dra-lopez-extetix',
    commissionRate: 0.70
  },
  {
    id: 'dr-martinez',
    name: 'Dr. Carlos Martínez',
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
    licenseNumber: 'MN 91245',
    bio: 'Cirujano plástico recertificado en medicina estética mínimamente invasiva. Precisión técnica y resultados sutiles.',
    specialties: ['Ácido Hialurónico', 'Bioestimuladores', 'Rinomodelación'],
    rating: 4.8,
    reviewCount: 89,
    addressCenter: 'Morón, Buenos Aires',
    latCenter: -34.6552,
    lngCenter: -58.6200,
    radiusKm: 15,
    isAvailable: true,
    isActive: true,
    calendlyUrl: 'https://calendly.com/dr-martinez-extetix',
    commissionRate: 0.70
  },
  {
    id: 'dr-sanchez',
    name: 'Dra. Ana Sánchez',
    photoUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80',
    licenseNumber: 'MN 76891',
    bio: 'Médica estética con enfoque holístico. Combinación de técnicas avanzadas para resultados armónicos y naturales.',
    specialties: ['Botox', 'Bioestimuladores', 'Rejuvenecimiento facial'],
    rating: 5.0,
    reviewCount: 64,
    addressCenter: 'Castelar, Buenos Aires',
    latCenter: -34.6525,
    lngCenter: -58.6438,
    radiusKm: 12,
    isAvailable: true,
    isActive: true,
    calendlyUrl: 'https://calendly.com/dra-sanchez-extetix',
    commissionRate: 0.70
  }
];

// ============================================
// FUNCIONES UTILITARIAS
// ============================================

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(price);
}

export function getTreatmentById(id: string): Treatment | undefined {
  return treatments.find(t => t.id === id);
}

export function getProfessionalById(id: string): Professional | undefined {
  return professionals.find(p => p.id === id);
}

// ============================================
// CÁLCULO DE DISTANCIA (Fórmula de Haversine)
// ============================================

export function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10; // Redondeado a 1 decimal
}

// Filtrar profesionales por distancia desde punto del paciente
export function getProfessionalsInRange(
  patientLat: number,
  patientLng: number,
  professionalsList: Professional[] = professionals
): (Professional & { distance: number })[] {
  return professionalsList
    .filter(p => p.isActive && p.isAvailable)
    .map(p => ({
      ...p,
      distance: calculateDistance(p.latCenter, p.lngCenter, patientLat, patientLng)
    }))
    .filter(p => p.distance <= p.radiusKm)
    .sort((a, b) => a.distance - b.distance);
}