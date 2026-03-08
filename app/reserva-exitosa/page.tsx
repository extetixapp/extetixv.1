'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ReservaExitosa() {
  const searchParams = useSearchParams();
  const [reservaData, setReservaData] = useState<any>(null);

  useEffect(() => {
    // Calendly agrega parámetros en la URL al redirigir
    // Ejemplo: ?event_type_uuid=xxx&event_uuid=xxx&invitee_uuid=xxx
    const eventUuid = searchParams.get('event_uuid');
    const inviteeUuid = searchParams.get('invitee_uuid');
    
    if (eventUuid) {
      // Aquí guardaríamos en base de datos (próximo paso)
      setReservaData({
        eventUuid,
        inviteeUuid,
        fecha: new Date().toLocaleDateString('es-AR'),
        hora: searchParams.get('event_start_time') || 'Pendiente'
      });
      
      // TODO: Enviar datos a Supabase/webhook
      console.log('Reserva confirmada:', { eventUuid, inviteeUuid });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm p-12 max-w-lg w-full text-center">
        
        {/* Icono de éxito */}
        <div className="w-20 h-20 bg-[#C9A962]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C9A962" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </div>

        <h1 className="font-serif text-3xl text-[#1A1A1A] mb-4">
          ¡Reserva confirmada!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Tu tratamiento ha sido agendado exitosamente. 
          Recibirás un email con todos los detalles.
        </p>

        {reservaData && (
          <div className="bg-[#F5F5F5] rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-gray-500 mb-1">Fecha de reserva</p>
            <p className="font-medium text-[#1A1A1A]">{reservaData.fecha}</p>
            <p className="text-xs text-gray-400 mt-2">ID: {reservaData.eventUuid?.slice(0, 8)}...</p>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            href="/" 
            className="block w-full bg-[#1A1A1A] text-white py-4 rounded-full font-medium transition-all duration-300 hover:bg-[#C9A962] hover:text-[#1A1A1A]"
          >
            Volver al inicio
          </Link>
          
          <button 
            onClick={() => window.print()}
            className="block w-full border-2 border-gray-200 text-gray-700 py-4 rounded-full font-medium transition-all duration-300 hover:border-[#C9A962] hover:text-[#C9A962]"
          >
            Imprimir comprobante
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          ¿Necesitas modificar tu turno? Contactanos por WhatsApp
        </p>
      </div>
    </div>
  );
}