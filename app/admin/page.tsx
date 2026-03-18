'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/supabase';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'staff' | 'pagados' | 'recupero'>('staff');
  const [profesionales, setProfesionales] = useState<any[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    try {
      if (activeTab === 'staff') {
        const { data, error } = await supabase
          .from('profesionales_aspirantes')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setProfesionales(data || []);
      } else {
        const { data, error } = await supabase
          .from('pacientes_interesados')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setPacientes(data || []);
      }
    } catch (error) {
      console.error("Error en la carga de datos:", error);
    } finally {
      setLoading(false);
    }
  }

  const toggleStatus = async (id: string, currentStatus: boolean, canActivate: boolean) => {
    if (!currentStatus && !canActivate) {
      alert("No se puede activar: Faltan documentos en el legajo digital.");
      return;
    }
    const { error } = await supabase
      .from('profesionales_aspirantes')
      .update({ activo: !currentStatus })
      .eq('id', id);
    
    if (error) alert("Error al actualizar estado");
    fetchData();
  };

  const openWhatsApp = (phone: string, name: string, isRecovery: boolean) => {
    if (!phone) return alert("No hay teléfono registrado");
    const cleanPhone = phone.replace(/\D/g, '');
    const message = isRecovery 
      ? `Hola ${name}, vimos que te interesaste en un tratamiento de Extetix. ¿Tenés alguna duda para concretar tu reserva?`
      : `Hola ${name}, ¡recibimos tu pago en Extetix! Nos ponemos en contacto para coordinar los detalles de tu visita.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Función auxiliar para generar la URL del documento
  const getDocUrl = (fileName: string) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documentos_profesionales/${fileName}`;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 md:p-10 font-sans text-stone-900">
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-[10px] tracking-[0.4em] text-[#C9A962] font-bold uppercase">Panel de Control</span>
          <h1 className="text-4xl font-serif italic mt-2 text-center md:text-left">Administración Extetix</h1>
        </div>
        <div className="flex bg-white border border-stone-100 rounded-full p-1 shadow-sm overflow-x-auto">
          {['staff', 'pagados', 'recupero'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-stone-900 text-white' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              {tab === 'staff' ? 'Médicos' : tab === 'pagados' ? 'Ventas' : 'Recupero'}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#C9A962] border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-stone-400">Nombre / Info</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-stone-400">Contacto</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-stone-400">
                    {activeTab === 'staff' ? 'Legajo Digital' : 'Tratamiento'}
                  </th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-stone-400">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {activeTab === 'staff' ? (
                  profesionales.map((p) => {
                    const docs = p.documentos_urls || {};
                    const hasDocs = docs.dni && docs.titulo; // Validación mínima para activar

                    return (
                      <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <p className="font-serif text-lg italic">{p.nombre_completo || 'Sin nombre'}</p>
                          <p className="text-[10px] text-[#C9A962] font-bold uppercase tracking-widest">Mat. Nac: {p.matricula_nacional || 'N/A'}</p>
                        </td>
                        <td className="px-8 py-6 text-sm">
                          <p className="font-medium text-stone-700">{p.telefono || 'Sin Teléfono'}</p>
                          <p className="text-[10px] text-stone-400 uppercase tracking-widest">DNI: {p.dni}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                               {docs.dni ? (
                                 <a href={getDocUrl(docs.dni)} target="_blank" className="text-[9px] bg-stone-100 px-2 py-1 rounded text-stone-600 hover:bg-stone-900 hover:text-white transition-all uppercase font-bold tracking-tighter">DNI ✓</a>
                               ) : (
                                 <span className="text-[9px] bg-red-50 px-2 py-1 rounded text-red-400 uppercase font-bold tracking-tighter italic">Falta DNI</span>
                               )}
                               {docs.titulo ? (
                                 <a href={getDocUrl(docs.titulo)} target="_blank" className="text-[9px] bg-stone-100 px-2 py-1 rounded text-stone-600 hover:bg-stone-900 hover:text-white transition-all uppercase font-bold tracking-tighter">Matrícula ✓</a>
                               ) : (
                                 <span className="text-[9px] bg-red-50 px-2 py-1 rounded text-red-400 uppercase font-bold tracking-tighter italic">Falta Mat.</span>
                               )}
                               {docs.seguro && (
                                 <a href={getDocUrl(docs.seguro)} target="_blank" className="text-[9px] bg-stone-100 px-2 py-1 rounded text-stone-600 hover:bg-stone-900 hover:text-white transition-all uppercase font-bold tracking-tighter">Seguro ✓</a>
                               )}
                            </div>
                            <span className={`w-fit px-3 py-1 rounded-full text-[9px] font-bold tracking-tighter uppercase ${p.activo ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {p.activo ? 'Visible en Web' : 'Pausado / En Revisión'}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex gap-3">
                            <button 
                              onClick={() => toggleStatus(p.id, p.activo, !!hasDocs)}
                              className={`text-[10px] font-bold border px-4 py-2 rounded-full transition-all uppercase tracking-widest ${
                                p.activo 
                                  ? 'border-stone-200 hover:bg-stone-900 hover:text-white' 
                                  : 'border-[#C9A962] text-[#C9A962] hover:bg-[#C9A962] hover:text-white'
                              }`}
                            >
                              {p.activo ? 'Pausar' : 'Activar'}
                            </button>
                            <button 
                              onClick={() => openWhatsApp(p.telefono, p.nombre_completo, false)}
                              className="bg-[#25D366]/10 text-[#128C7E] px-4 py-2 rounded-full text-[10px] font-bold uppercase hover:bg-[#25D366] hover:text-white transition-all"
                            >
                              WhatsApp
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  pacientes
                    .filter(pac => activeTab === 'pagados' ? pac.estado === 'pago_confirmado' : pac.estado === 'interesado')
                    .map((pac) => (
                    <tr key={pac.id} className="hover:bg-stone-50/50">
                      <td className="px-8 py-6">
                        <p className="font-bold text-stone-800">{pac.nombre}</p>
                        <p className="text-xs text-stone-400 italic">{pac.direccion}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-medium">{pac.telefono}</p>
                        <p className="text-[10px] text-stone-400">{pac.email}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs uppercase font-bold text-[#C9A962]">{pac.tratamiento_interes}</span>
                      </td>
                      <td className="px-8 py-6">
                        <button 
                          onClick={() => openWhatsApp(pac.telefono, pac.nombre, activeTab === 'recupero')}
                          className="flex items-center gap-2 bg-[#25D366]/10 text-[#128C7E] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#25D366] hover:text-white transition-all"
                        >
                          <span>WhatsApp</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {(activeTab === 'staff' ? profesionales : pacientes).length === 0 && (
              <div className="text-center py-20 text-stone-300 italic">No hay datos en esta categoría.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}