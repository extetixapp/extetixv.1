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
    description:
      'Tratamiento neuromodulador que suaviza líneas de expresión y arrugas dinámicas. Efecto natural y rejuvenecedor que dura entre 4-6 meses.',
    price: 45000,
    durationMin: 30,
    imageUrl:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    contraindications: [
      'Embarazo o lactancia',
      'Enfermedades neuromusculares',
      'Infecciones en zona de aplicación',
    ],
    preCare: [
      'Evitar alcohol 24h antes',
      'No tomar antiinflamatorios 3 días previos',
      'Venir sin maquillaje',
    ],
    postCare: [
      'No acostarse 4 horas post-tratamiento',
      'Evitar ejercicio 24h',
      'No masajear la zona',
    ],
  },
  {
    id: 'acido-hialuronico',
    name: 'Ácido Hialurónico',
    category: 'acido_hialuronico',
    description:
      'Rellenos dérmicos de última generación para restaurar volumen, definir contornos e hidratar profundamente. Resultados inmediatos y naturales.',
    price: 68000,
    durationMin: 45,
    imageUrl:
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
    contraindications: [
      'Embarazo o lactancia',
      'Antecedentes de ciclos de ácido hialurónico recientes',
      'Infecciones activas',
    ],
    preCare: [
      'Evitar aspirinas 7 días antes',
      'No consumir alcohol 48h previas',
      'Informar sobre antecedentes alérgicos',
    ],
    postCare: [
      'Aplicar hielo intermitente 24h',
      'Evitar exposición solar directa 72h',
      'No realizar tratamientos dentales 2 semanas',
    ],
  },
  {
    id: 'bioestimuladores',
    name: 'Bioestimuladores',
    category: 'bioestimuladores',
    description:
      'Activadores de colágeno propio que mejoran la calidad de la piel desde el interior. Ideal para flacidez, luminosidad y rejuvenecimiento global.',
    price: 55000,
    durationMin: 40,
    imageUrl:
      'https://images.unsplash.com/photo-1552693673-1bf958298935?w=800&q=80',
    contraindications: [
      'Embarazo o lactancia',
      'Enfermedades autoinmunes activas',
      'Cicatrización alterada',
    ],
    preCare: [
      'Suspender retinol 1 semana antes',
      'Hidratación intensa días previos',
      'Evitar depilación facial',
    ],
    postCare: [
      'Masajes específicos según indicación médica',
      'Hidratación constante',
      'Protector solar obligatorio',
    ],
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price);
}

export function getTreatmentById(id: string): Treatment | undefined {
  return treatments.find((t) => t.id === id);
}
