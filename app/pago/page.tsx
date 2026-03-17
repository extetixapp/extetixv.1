'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/supabase'; 

export default function PagoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [reservaData, setReservaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // CAPTURA INMUNE: Leemos de la URL
    const data = {
      leadId: searchParams.get('lead_id'),
      email: searchParams.get('email')?.toLowerCase().trim(),
      name: searchParams.get('name') || 'Paciente',
      prof: searchParams.get('prof') || 'Especialista asignado',
      address: searchParams.get('address') || 'Dirección a confirmar',
    };

    if (data.email) {
      setReservaData(data);
    }
    setLoading(false);
  }, [searchParams]);

  const handleSimularPago = async () => {
    if (!reservaData?.email) return;
    setIsProcessing(true);
    
    console.log("--- EXTETIX GUARDIAN: Actualizando estado ---");

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2. ACTUALIZACIÓN SIMPLIFICADA (Sin columnas inexistentes)
      const { data, error } = await supabase
        .from('pacientes_interesados')
        .update({ 
          estado: 'pago_confirmado', 
          direccion: reservaData.address
          // Eliminamos updated_at porque no existe en tu tabla
        })
        .ilike('email', reservaData.email) 
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        console.log("✅ Actualización exitosa en Supabase");
      } else {
        console.warn("⚠️ No se encontró la fila con email:", reservaData.email);
      }

      // Redirección con parámetros para la página de éxito
      const successParams = new URLSearchParams(searchParams.toString());
      router.push(`/reserva-exitosa?${successParams.toString()}`);
      
    } catch (error: any) {
      console.error('Error Crítico:', error.message);
      router.push('/reserva-exitosa'); 
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif italic">Validando sesión...</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-16 font-sans">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-[3rem] shadow-sm border border-stone-100 p-8 md:p-14">
          <header className="text-center mb-12">
            <h1 className="font-serif text-4xl text-stone-900 mb-3 italic">Finalizar Reserva</h1>
            <p className="text-[#C9A962] text-[10px] uppercase tracking-[0.4em] font-bold">Atención Médica Estética</p>
          </header>

          <div className="bg-stone-50 rounded-[2.5rem] p-8 mb-10 space-y-6 border border-stone-100/50">
            <div className="flex justify-between items-start">
              <span className="text-stone-400 uppercase tracking-widest text-[9px] font-extrabold">Paciente</span>
              <span className="font-medium text-stone-800 text-sm">{reservaData?.name}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-stone-400 uppercase tracking-widest text-[9px] font-extrabold">Especialista</span>
              <span className="font-medium text-stone-800 text-sm">{reservaData?.prof}</span>
            </div>
            <div className="flex justify-between items-start border-t border-stone-200/40 pt-6">
              <span className="text-stone-400 uppercase tracking-widest text-[9px] font-extrabold text-stone-900">Total</span>
              <span className="font-serif text-3xl text-stone-900 tracking-tighter">$45.000</span>
            </div>
          </div>

          <button 
            onClick={handleSimularPago}
            disabled={isProcessing}
            className="w-full bg-stone-900 text-white py-6 rounded-full font-bold tracking-[0.3em] text-[10px] hover:bg-[#C9A962] transition-all duration-500 uppercase shadow-lg shadow-stone-100"
          >
            {isProcessing ? 'PROCESANDO...' : 'CONFIRMAR Y PAGAR'}
          </button>
        </div>
      </div>
    </div>
  );
}