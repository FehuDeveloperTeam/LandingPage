import { useState } from 'react'
import { generatePDF } from '../components/CurriculumPDF'
import PageLayout from '../components/PageLayout'
import Card from '../components/Card'
import SEO from '../components/SEO'
import { 
  GraduationCap, Briefcase, Code2, Zap, Phone, 
  Mail, MapPin, FileText, Download, ExternalLink,
  Languages, Cpu, Globe
} from 'lucide-react'

function Curriculum() {
  const [generando, setGenerando] = useState(false)

  const data = {
    resumen: 'Analista Programador y Administrador de Empresas con enfoque en optimización de procesos. Experto en proyectar oportunidades de negocio mediante la integración de soluciones informáticas avanzadas en mercados competitivos.',
    
    contacto: {
      telefono: '+56 9 49 23 17 86',
      email: 'Fehu.developers@gmail.com',
      ubicacion: 'San Carlos, Chile'
    },

    educacion: [
      { periodo: '2022 - Presente', titulo: 'Analista Programador', institucion: 'INACAP', estado: 'En proceso de titulación' },
      { periodo: '2007 - 2010', titulo: 'Administrador de Empresas mención Personas', institucion: 'INACAP', estado: 'Titulado' },
    ],

    experienciaLaboral: [
      { periodo: '2025 - Presente', cargo: 'Asistente Logístico', empresa: 'COPEVAL San Carlos', descripcion: 'Gestión de entrega de producto a cliente final y manejo de sistema WMS para control de inventario y despachos.' },
      { periodo: '2024 - 2025', cargo: 'Control Logístico SAP', empresa: 'Comfrut SA', descripcion: 'Control operativo en líneas de producción, generación de informes de producto final y optimización de consumos.' },
      { periodo: '2020 - 2024', cargo: 'Encargado de Local', empresa: 'Importadora SOCAR', descripcion: 'Gestión integral de local, comercio exterior (China/Tailandia) y proyección de ventas B2B/B2C.' },
    ],

    experienciaTI: [
      { periodo: '2024 - Presente', cargo: 'Desarrollador Freelance', empresa: 'Independiente', descripcion: 'Desarrollo de Apps móviles, soluciones IoT con ESP32 y realidad aumentada aplicada a procesos industriales.' },
      { periodo: '2021 - 2023', cargo: 'Desarrollador de Software', empresa: 'SOCAR', descripcion: 'Automatización de gestión interna mediante aplicaciones de escritorio desarrolladas en Python.' },
    ],

    habilidades: [
      { categoria: 'Idiomas', items: ['Español nativo', 'Inglés avanzado'], icon: <Languages size={18}/> },
      { categoria: 'Software ERP', items: ['SAP', 'Softland', 'WMS', 'Git'], icon: <Cpu size={18}/> },
      { categoria: 'Stack Tech', items: ['React', 'Django', 'TypeScript', 'Python', 'Kotlin'], icon: <Code2 size={18}/> },
      { categoria: 'Innovación', items: ['IoT', 'SQL', 'Unity', 'AR Vuforia'], icon: <Zap size={18}/> },
    ],
  }

  const handleDownload = async () => {
    setGenerando(true)
    try {
      await generatePDF(data)
    } catch (error) {
      console.error('Error generando PDF:', error)
    } finally {
      setGenerando(false)
    }
  }

  return (
    <PageLayout
      titulo="Andrés Zurita S."
      subtitulo={data.resumen}
      icono={<FileText className="w-8 h-8" />}
    >
      <SEO 
        title="Curriculum Profesional | Andrés Zurita"
        description="Trayectoria profesional de Andrés Zurita. Experto en Administración y Desarrollo de Software (React, Django, IoT)."
      />

      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Contacto Flotante */}
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { icon: <Phone size={16}/>, label: data.contacto.telefono, href: `tel:${data.contacto.telefono}` },
            { icon: <Mail size={16}/>, label: data.contacto.email, href: `mailto:${data.contacto.email}` },
            { icon: <MapPin size={16}/>, label: data.contacto.ubicacion }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 px-6 py-3 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/10 text-sm font-bold text-gray-600 dark:text-gray-300">
              <span className="text-blue-600">{item.icon}</span>
              {item.href ? <a href={item.href} className="hover:text-blue-500 transition-colors">{item.label}</a> : item.label}
            </div>
          ))}
        </div>

        {/* Educación y Habilidades (Grid combinada) */}
        <div className="grid lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="text-blue-600" size={28} />
              <h2 className="text-2xl font-black tracking-tighter uppercase">Formación Académica</h2>
            </div>
            <div className="space-y-4">
              {data.educacion.map((edu, i) => (
                <Card key={i} className="p-6 border-l-4 border-l-blue-600">
                  <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{edu.periodo}</span>
                  <h3 className="font-bold text-xl mt-1">{edu.titulo}</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">{edu.institucion}</p>
                  <div className="mt-4 inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-tighter text-gray-600 dark:text-gray-400">
                    {edu.estado}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <aside className="space-y-8">
            <div className="flex items-center gap-3 mb-8">
              <Zap className="text-amber-500" size={28} />
              <h2 className="text-2xl font-black tracking-tighter uppercase">Skills</h2>
            </div>
            <div className="grid gap-4">
              {data.habilidades.map((hab, i) => (
                <div key={i} className="p-5 rounded-[2rem] bg-gray-900/5 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                  <h3 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-gray-400 mb-4">
                    {hab.icon} {hab.categoria}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {hab.items.map((item, j) => (
                      <span key={j} className="text-[11px] font-bold px-3 py-1 bg-white dark:bg-white/10 rounded-full shadow-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* Experiencia (Timeline) */}
        <section>
          <div className="flex items-center gap-3 mb-10">
            <Briefcase className="text-blue-600" size={28} />
            <h2 className="text-2xl font-black tracking-tighter uppercase">Experiencia Profesional</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[...data.experienciaLaboral, ...data.experienciaTI].map((exp, i) => (
              <Card key={i} className="p-8 group hover:border-blue-500/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black px-3 py-1 bg-blue-600 text-white rounded-md tracking-widest uppercase">
                    {exp.periodo}
                  </span>
                  {exp.empresa === 'Independiente' && <ExternalLink size={14} className="text-gray-400"/>}
                </div>
                <h3 className="font-bold text-xl group-hover:text-blue-600 transition-colors">{exp.cargo}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest mb-4">{exp.empresa}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {exp.descripcion}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Acción Final */}
        <div className="flex flex-col items-center py-16 border-t border-gray-100 dark:border-white/5">
          <button 
            onClick={handleDownload}
            disabled={generando}
            className="group relative inline-flex items-center gap-4 px-12 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm tracking-widest uppercase hover:scale-105 transition-all disabled:opacity-50"
          >
            {generando ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Download size={20} className="group-hover:bounce" />
            )}
            {generando ? 'Generando Documento...' : 'Descargar CV Profesional'}
            <div className="absolute -inset-2 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <p className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Disponible para proyectos freelance y tiempo completo</p>
        </div>
      </div>
    </PageLayout>
  )
}

export default Curriculum