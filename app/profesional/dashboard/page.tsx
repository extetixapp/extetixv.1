'use client';

import { useState } from 'react';
import { supabase } from '@/supabase';
import Link from 'next/link';

export default function ProfesionalesPage() {
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '', 
    dni: '', 
    telefono: '', // NUEVO CAMPO
    matNacional: '', 
    matProvincial: '', 
    seguro: ''
  });
  
  const [archivos, setArchivos] = useState<any>({});

  const handleFileChange = (e: any, campo: string) => {
    if (e.target.files[0]) {
      setArchivos({ ...archivos, [campo]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const urls: any = {};
      
      // Subida de archivos al Storage
      for (const key in archivos) {
        const file = archivos[key];
        const fileExt = file.name.split('.').pop();
        // Nombre de archivo más descriptivo para el admin
        const fileName = `${formData.nombre.replace(/\s+/g, '_')}_${key}_${Date.now()}.${fileExt}`;
        
        const { data, error: uploadError } = await supabase.storage
          .from('documentos_profesionales')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        // Obtenemos la URL pública para guardarla en la base de datos
        const { data: urlData } = supabase.storage
          .from('documentos_profesionales')
          .getPublicUrl(fileName);
          
        if (urlData) urls[key] = urlData.publicUrl;
      }

      // Inserción en la base de datos
      const { error: insertError } = await supabase.from('profesionales_aspirantes').insert([{
        nombre_completo: formData.nombre,
        dni: formData.dni,
        telefono: formData.telefono, // GUARDAMOS EL TELÉFONO
        matricula_nacional: formData.matNacional,
        matricula_provincial: formData.matProvincial,
        seguro_mala_praxis: formData.seguro,
        // Guardamos las URLs individuales para que el Admin las lea fácil
        dni_url: urls['dni'] || null,
        matricula_url: urls['titulo'] || null,
        seguro_url: urls['seguro'] || null,
        status: 'pendiente_aprobacion',
        activo: false
      }]);

      if (insertError) throw insertError;
      setEnviado(true);
    } catch (err: any) {
      console.error(err);
      alert("Error al subir legajo. Verifique los campos y la conexión.");
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md bg-white p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(201,169,98,0.1)] border border-[#C9A962]/20 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
            <svg className="w-8 h-8 text-[#C9A962]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="font-serif text-3xl italic mb-4 text-stone-900">Legajo Recibido</h2>
          <p className="text-stone-400 text-sm mb-10 leading-relaxed">Nuestro equipo médico auditará su documentación. Nos contactaremos en las próximas 48-72 horas hábiles.</p>
          <Link href="/" className="inline-block bg-stone-900 text-white px-10 py-4 rounded-full text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-[#C9A962] transition-all shadow-lg">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#C9A962]/20">
      
      {/* HERO */}
      <section className="pt-28 pb-20 px-6 text-center max-w-4xl mx-auto relative">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#C9A962]/5 rounded-full blur-3xl -z-10"></div>
        <span className="text-[10px] tracking-[0.6em] uppercase text-[#C9A962] font-black mb-6 block">Partnership Médico de Elite</span>
        <h1 className="text-5xl md:text-7xl font-serif italic text-stone-900 mb-8 leading-tight tracking-tight">
          Tu talento merece <br /> <span className="text-[#C9A962]">exclusividad.</span>
        </h1>
      </section>

      {/* FORMULARIO */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_50px_100px_rgba(0,0,0,0.03)] border border-[#C9A962]/10 relative z-10">
          <header className="mb-16 text-center">
            <h2 className="text-4xl font-serif italic text-stone-900 mb-4">Registro de Staff</h2>
            <div className="w-12 h-[1px] bg-[#C9A962] mx-auto mb-4"></div>
            <p className="text-stone-400 text-[9px] uppercase tracking-[0.4em] font-bold">Completa tu legajo profesional</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Datos Personales y Contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input required placeholder="Nombre Completo" className="w-full bg-transparent border-b border-stone-200 py-4 outline-none focus:border-[#C9A962] transition-all text-stone-800 placeholder:text-stone-300 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest" onChange={e => setFormData({...formData, nombre: e.target.value})} />
              <input required placeholder="DNI" className="w-full bg-transparent border-b border-stone-200 py-4 outline-none focus:border-[#C9A962] transition-all text-stone-800 placeholder:text-stone-300 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest" onChange={e => setFormData({...formData, dni: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* CAMPO TELÉFONO AGREGADO */}
              <input 
                required 
                type="tel"
                placeholder="Teléfono Celular (WhatsApp)" 
                className="w-full bg-transparent border-b border-stone-200 py-4 outline-none focus:border-[#C9A962] transition-all text-stone-800 placeholder:text-stone-300 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest" 
                onChange={e => setFormData({...formData, telefono: e.target.value})} 
              />
            </div>

            {/* Credenciales Médicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
              <input required placeholder="M. Nacional" className="bg-transparent border-b border-stone-200 py-4 outline-none focus:border-[#C9A962] text-stone-800 placeholder:text-stone-300 placeholder:text-[10px]" onChange={e => setFormData({...formData, matNacional: e.target.value})} />
              <input required placeholder="M. Provincial" className="bg-transparent border-b border-stone-200 py-4 outline-none focus:border-[#C9A962] text-stone-800 placeholder:text-stone-300 placeholder:text-[10px]" onChange={e => setFormData({...formData, matProvincial: e.target.value})} />
              <input required placeholder="Seguro Mala Praxis" className="bg-transparent border-b border-stone-200 py-4 outline-none focus:border-[#C9A962] text-stone-800 placeholder:text-stone-300 placeholder:text-[10px]" onChange={e => setFormData({...formData, seguro: e.target.value})} />
            </div>

            {/* Documentación Digital */}
            <div className="pt-8">
              <div className="flex items-center space-x-4 mb-8">
                <span className="h-[1px] w-8 bg-[#C9A962]"></span>
                <h4 className="text-[10px] tracking-[0.4em] uppercase font-black text-stone-900">Documentación Adjunta</h4>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {[
                  { id: 'dni', label: 'DNI (Frente y Dorso)' },
                  { id: 'titulo', label: 'Título y Matrículas' },
                  { id: 'seguro', label: 'Póliza de Seguro vigente' }
                ].map((file) => (
                  <div key={file.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-stone-50 rounded-[2rem] border border-stone-100 hover:border-[#C9A962]/30 transition-all group">
                    <span className="text-[11px] uppercase tracking-widest font-bold text-stone-500 group-hover:text-stone-900 transition-colors">{file.label}</span>
                    <input 
                      type="file" 
                      required
                      className="text-[10px] text-stone-400 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-[9px] file:font-bold file:uppercase file:bg-stone-900 file:text-white hover:file:bg-[#C9A962] file:transition-all cursor-pointer mt-4 md:mt-0"
                      onChange={e => handleFileChange(e, file.id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-stone-900 text-white py-7 rounded-full font-bold tracking-[0.5em] text-[11px] uppercase hover:bg-[#C9A962] hover:shadow-[0_20px_40px_rgba(201,169,98,0.3)] transition-all duration-500 disabled:opacity-30 shadow-xl"
              >
                {loading ? 'Subiendo Legajo...' : 'ENVIAR POSTULACIÓN'}
              </button>
            </div>
          </form>
        </div>
      </section>
      
      <footer className="py-24 text-center border-t border-stone-100">
         <p className="font-serif italic text-stone-300 text-lg mb-2">Extetix Staff</p>
         <p className="text-[9px] uppercase tracking-[0.4em] text-stone-400">Excelencia Médica Asegurada</p>
      </footer>
    </div>
  );
}