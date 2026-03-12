'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/supabase'; // Asegúrate de tener tu cliente de Supabase importado

export default function PagoPage() {
  const searchParams = useSearchParams();
  const router = useRouter(); // MODIFICACIÓN: Importado useRouter para redirigir tras el pago
  const [reservaData, setReservaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // MODIFICACIÓN: Estado para deshabilitar botón mientras procesa

  useEffect(() => {
    // Datos que vienen de Calendly en la URL
    const eventUuid = searchParams.get('event_uuid');
    const inviteeUuid = searchParams.get('invitee_uuid');
    const professionalName = searchParams.get('a2'); // Médico
    const address = searchParams.get('a3'); // Domicilio
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const whatsapp = searchParams.get('a1');
    const leadId = searchParams.get('state'); // MODIFICACIÓN: Recuperamos el leadId pasado desde Calendly

    if (eventUuid) {
      setReservaData({
        eventUuid,
        leadId, // Guardamos el leadId para la actualización
        professionalName,
        address,
        name,
        email,
        whatsapp,
        fecha: new Date().toLocaleDateString('es-AR')
      });
      
      console.log('Reserva cargada, esperando pago:', { eventUuid, email });
    }
    
    setLoading(false);
  }, [searchParams]);

  // MODIFICACIÓN: Nueva función para simular el pago y actualizar la BD
  const handleSimularPago = async () => {
    setIsProcessing(true);
    
    if (reservaData?.leadId) {
      const { error } = await supabase
        .from('pacientes_interesados')
        .update({ 
          estado: 'pago_realizado',
          calendly_event_id: reservaData.eventUuid // Guardamos el ID del evento de Calendly en la nueva columna
        })
        .eq('id', reservaData.leadId);

      if (!error) {
        // Redirigimos a la página de éxito tras confirmar
        router.push('/reserva-exitosa');
      } else {
        console.error('Error al actualizar DB:', error);
        alert('Hubo un problema al confirmar el pago. Intentá nuevamente.');
      }
    }
    setIsProcessing(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!reservaData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl mb-4">No se encontró la reserva</h1>
          <Link href="/" className="text-[#C9A962]">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12">
      <div className="max-w-2xl mx-auto px-6">
        
        {/* Progress steps */}
        <div className="flex items-center justify-center mb-8">
          {['Datos', 'Médico', 'Turno', 'Pago'].map((step, i) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                i < 3 ? 'bg-[#C9A962] text-white' : 'bg-[#C9A962] text-white ring-4 ring-[#C9A962]/20'
              }`}>
                {i < 3 ? '✓' : '4'}
              </div>
              {i < 3 && <div className="w-12 h-1 bg-[#C9A962] mx-2" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="font-serif text-3xl text-[#1A1A1A] mb-2">Confirmar y pagar</h1>
          <p className="text-gray-600 mb-8">Último paso para confirmar tu tratamiento</p>

          {/* Resumen de reserva */}
          <div className="bg-[#F5F5F5] rounded-xl p-6 mb-8">
            <h3 className="font-medium text-[#1A1A1A] mb-4">Resumen</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Paciente</span>
                <span className="font-medium">{reservaData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Médico</span>
                <span className="font-medium">{reservaData.professionalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Domicilio</span>
                <span className="font-medium text-right max-w-[200px]">{reservaData.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">WhatsApp</span>
                <span className="font-medium">{reservaData.whatsapp}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span className="text-[#C9A962]">$45.000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de pago Mercado Pago */}
          <button 
            onClick={handleSimularPago}
            disabled={isProcessing}
            className="w-full bg-[#C9A962] text-[#1A1A1A] py-4 rounded-full font-medium text-lg transition-all duration-300 hover:bg-[#1A1A1A] hover:text-white mb-4 disabled:opacity-50"
          >
            {isProcessing ? 'Procesando...' : 'Pagar con Mercado Pago'}
          </button>

          <p className="text-xs text-center text-gray-500">
            Al pagar, aceptás los términos y condiciones. El pago se procesa de forma segura.
          </p>
        </div>
      </div>
    </div>
  );
}