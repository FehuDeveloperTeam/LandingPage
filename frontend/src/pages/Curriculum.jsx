import { useState } from 'react'
import { generatePDF } from '../components/CurriculumPDF.jsx'
import PageLayout from '../components/PageLayout'
import Card from '../components/Card'
import { IconAcademic, IconPhone, IconMail, IconLocation, IconBolt } from '../components/Icons'
import SEO from '../components/SEO'
import { Download, Terminal, Briefcase, RefreshCcw } from 'lucide-react'

function Curriculum() {
  const [generando, setGenerando] = useState(false)

  const data = {
    resumen: 'Gran conocimiento del área, con enfoque administrativo y conocimiento informático para proyectar y potenciar las oportunidades de negocio en un mercado competitivo y en continuo avance.',
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
      { periodo: '2024 - 2025', cargo: 'Control Logístico SAP', empresa: 'Comfrut SA (Planta San Carlos)', descripcion: 'Encargado del control y correcto funcionamiento en líneas de producción, generando informes de producto final y consumos de materias primas.' },
      { periodo: '2020 - 2024', cargo: 'Encargado de Local', empresa: 'Importadora SOCAR', descripcion: 'Mantención total de local, contacto con proveedores, manejo de costos, proyección de ventas. Gestor de importaciones desde China y Tailandia.' },
      { periodo: '2019 - 2020', cargo: 'Ejecutivo de Ventas', empresa: 'Importadora Blobel SPA', descripcion: 'Atención a clientes intermedios (B2B) con desarrollo de marcas importadas.' },
      { periodo: '2012 - 2019', cargo: 'Ejecutivo de Ventas', empresa: 'Importadora Bicimoto Ltda.', descripcion: 'Contacto con cliente intermedio (B2B), manejo de productos automotrices y control de cobranza.' },
    ],
    experienciaTI: [
      { periodo: '2024 - Presente', cargo: 'Desarrollador Freelance', empresa: 'Independiente', descripcion: 'Desarrollo de aplicaciones móviles multiplataforma, proyectos IoT con ESP32 y soluciones con realidad aumentada.' },
      { periodo: '2024', cargo: 'Consultor Bases de Datos', empresa: 'Independiente', descripcion: 'Asesoría en diseño e implementación de bases de datos relacionales para Pymes.' },
      { periodo: '2021 - 2023', cargo: 'Desarrollador de Software', empresa: 'SOCAR', descripcion: 'Creación, desarrollo y mantención de aplicaciones de escritorio para gestión interna utilizando Python.' },
      { periodo: '2019 - 2020', cargo: 'Desarrollador de Videojuegos', empresa: 'Independiente', descripcion: 'Desarrollo y publicación de videojuegos 2D para plataformas móviles utilizando Unity y C#.' },
    ],
    habilidades: [
      { categoria: 'Idiomas', items: ['Español nativo', 'Inglés avanzado'] },
      { categoria: 'Software', items: ['SAP', 'Softland', 'WMS', 'Git'] },
      { categoria: 'Desarrollo', items: ['Python', 'JavaScript', 'TypeScript', 'C#', 'Kotlin', 'React', 'Django'] },
      { categoria: 'Otros', items: ['IoT (ESP32)', 'Firebase', 'SQL', 'Unity', 'Vuforia AR'] },
    ],
  }

  const handleDownload = async (e) => {
    e.preventDefault();
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
    <PageLayout titulo="Andrés Zurita Sanhueza" subtitulo={data.resumen}>
      <SEO title="Curriculum" description="CV de Andres Zurita." url="/curriculum" />

      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Botón Descarga */}
        <div className="flex justify-end sticky top-24 z-10 pointer-events-none">
          <button 
            onClick={handleDownload}
            disabled={generando}
            className={`pointer-events-auto flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:scale-105 active:scale-95 ${generando ? 'opacity-50' : ''}`}
          >
            {generando ? <RefreshCcw className="animate-spin" size={14} /> : <Download size={14} />}
            {generando ? 'Compilando...' : 'Descargar PDF'}
          </button>
        </div>

        {/* Contacto Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-3 flex items-center gap-3 border-none bg-blue-50/50 dark:bg-blue-500/5">
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <IconPhone size={14} className="text-blue-500" />
                </div>
                <a href={`tel:${data.contacto.telefono}`} className="text-[10px] font-bold dark:text-gray-300">{data.contacto.telefono}</a>
            </Card>
            <Card className="p-3 flex items-center gap-3 border-none bg-purple-50/50 dark:bg-purple-500/5">
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <IconMail size={14} className="text-purple-500" />
                </div>
                <a href={`mailto:${data.contacto.email}`} className="text-[10px] font-bold dark:text-gray-300 truncate">{data.contacto.email}</a>
            </Card>
            <Card className="p-3 flex items-center gap-3 border-none bg-amber-50/50 dark:bg-amber-500/5">
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <IconLocation size={14} className="text-amber-500" />
                </div>
                <span className="text-[10px] font-bold dark:text-gray-300">{data.contacto.ubicacion}</span>
            </Card>
        </div>

        {/* 1. SECCIÓN TECH EXPERIENCE */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg rotate-3">
              <Terminal size={16} />
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white text-gray-900">Tech Experience</h2>
          </div>
          <div className="space-y-6">
            {data.experienciaTI.map((exp, i) => (
              <Card key={i} className="p-6 group hover:border-blue-500/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                  <h3 className="text-lg font-black text-blue-600 dark:text-blue-400 uppercase tracking-tight">{exp.cargo}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-[9px] font-black uppercase text-gray-500">
                    {exp.periodo}
                  </span>
                </div>
                <p className="text-sm font-bold mb-2 dark:text-white text-gray-800">{exp.empresa}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{exp.descripcion}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* 2. SECCIÓN LOGÍSTICA & GESTIÓN (Restaurada) */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg -rotate-3">
              <Briefcase size={16} />
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white text-gray-900">Logística & Gestión</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {data.experienciaLaboral.map((exp, i) => (
              <Card key={i} className="p-5 border-l-4 border-l-amber-500 bg-white dark:bg-gray-900/50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black uppercase text-xs tracking-widest dark:text-white text-gray-800">{exp.cargo}</h3>
                  <span className="text-[9px] font-bold text-gray-400">{exp.periodo}</span>
                </div>
                <p className="text-[11px] font-bold text-amber-600 mb-2">{exp.empresa}</p>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-snug">{exp.descripcion}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* 3. EDUCACIÓN Y SKILLSET */}
        <div className="grid md:grid-cols-2 gap-12">
            <section>
                <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 dark:text-white text-gray-900">
                    <div className="w-5 h-5 flex items-center justify-center bg-blue-500/10 rounded-lg shrink-0">
                      <IconAcademic size={12} className="text-blue-500" />
                    </div>
                    Educación
                </h2>
                <div className="space-y-4">
                    {data.educacion.map((edu, i) => (
                        <div key={i} className="relative pl-6 border-l border-gray-200 dark:border-white/10">
                            <div className="absolute -left-1 w-2 h-2 rounded-full bg-blue-500 top-1.5" />
                            <p className="text-[9px] font-black text-gray-400 uppercase">{edu.periodo}</p>
                            <h3 className="text-sm font-bold dark:text-white text-gray-800">{edu.titulo}</h3>
                            <p className="text-xs text-gray-500">{edu.institucion}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 dark:text-white text-gray-900">
                    <div className="w-5 h-5 flex items-center justify-center bg-amber-500/10 rounded-lg shrink-0">
                      <IconBolt size={12} className="text-amber-500" />
                    </div>
                    Skillset
                </h2>
                <div className="flex flex-wrap gap-2">
                    {data.habilidades.flatMap(h => h.items).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg text-[9px] font-black uppercase tracking-tighter dark:text-gray-300 text-gray-600">
                            {skill}
                        </span>
                    ))}
                </div>
            </section>
        </div>
      </div>
    </PageLayout>
  )
}

export default Curriculum