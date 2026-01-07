import { useState } from 'react'
import { generatePDF } from '../components/CurriculumPDF'
import PageLayout from '../components/PageLayout'
import Card from '../components/Card'
import { IconAcademic, IconBriefcase, IconCode, IconBolt, IconPhone, IconMail, IconLocation, IconDocument } from '../components/Icons'
import SEO from '../components/SEO'

function Curriculum() {
  const [generando, setGenerando] = useState(false)

  const data = {
    resumen: 'Gran conocimiento del área, con enfoque administrativo y conocimiento informático para proyectar y potenciar las oportunidades de negocio en un mercado competitivo y en continuo avance.',
    
    contacto: {
      telefono: '+56 9 49 23 17 86',
      email: 'Fehu.developers@gmail.com',
      instagram: '@andreszs4',
      ubicacion: 'San Carlos, Chile'
    },

    educacion: [
      { periodo: '2022 - Presente', titulo: 'Analista Programador', institucion: 'INACAP', estado: 'En proceso de titulación' },
      { periodo: '2007 - 2010', titulo: 'Administrador de Empresas mención Personas', institucion: 'INACAP', estado: 'Titulado' },
    ],

    experienciaLaboral: [
      { periodo: '2025 - Presente', cargo: 'Asistente Logístico', empresa: 'COPEVAL San Carlos', descripcion: 'Gestión de entrega de producto a cliente final y manejo de sistema WMS para control de inventario y despachos.' },
      { periodo: '2024 - 2025', cargo: 'Control Logístico SAP', empresa: 'Comfrut SA (Planta San Carlos)', descripcion: 'Encargado del control y correcto funcionamiento en líneas de producción, generando informes de producto final y consumos de materias primas.' },
      { periodo: '2020 - 2024', cargo: 'Encargado de Local', empresa: 'Importadora SOCAR', descripcion: 'Mantención total de local, contacto con proveedores, manejo de costos, proyección de ventas. Gestor de importaciones desde China y Tailandia. Atención B2B y B2C.' },
      { periodo: '2019 - 2020', cargo: 'Ejecutivo de Ventas', empresa: 'Importadora Blobel SPA', descripcion: 'Depuración de cartera de clientes por áreas geográficas. Atención a clientes intermedios (B2B) con desarrollo de marcas importadas.' },
      { periodo: '2012 - 2019', cargo: 'Ejecutivo de Ventas', empresa: 'Importadora Bicimoto Ltda.', descripcion: 'Contacto con cliente intermedio (B2B), manejo de productos automotrices. Control de cobranza, generación de notas de venta, control de stock y manejo de cartera de clientes.' },
    ],

    experienciaTI: [
      { periodo: '2024 - Presente', cargo: 'Desarrollador Freelance', empresa: 'Independiente', descripcion: 'Desarrollo de aplicaciones móviles multiplataforma, proyectos IoT con ESP32 y soluciones con realidad aumentada para diversos clientes.' },
      { periodo: '2024', cargo: 'Consultor Bases de Datos', empresa: 'Independiente', descripcion: 'Asesoría en diseño e implementación de bases de datos relacionales para pequeñas y medianas empresas.' },
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
      titulo="Andrés Zurita Sanhueza"
      subtitulo={data.resumen}
    >
      <SEO 
  title="Curriculum"
  description="Curriculum de Andres Zurita. Analista Programador con experiencia en React, Django, Flutter, IoT y realidad aumentada."
  url="/curriculum"
/>
      <div className="space-y-12">
        {/* Contacto */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Card className="px-5 py-3" hover={true}>
            <a href={`tel:${data.contacto.telefono}`} className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
              <IconPhone className="w-4 h-4" /> {data.contacto.telefono}
            </a>
          </Card>
          <Card className="px-5 py-3" hover={true}>
            <a href={`mailto:${data.contacto.email}`} className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
              <IconMail className="w-4 h-4" /> {data.contacto.email}
            </a>
          </Card>
          <Card className="px-5 py-3" hover={false}>
            <span className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <IconLocation className="w-4 h-4" /> {data.contacto.ubicacion}
            </span>
          </Card>
        </div>

        {/* Educación */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <IconAcademic className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Educación</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {data.educacion.map((edu, i) => (
              <Card key={i} className="p-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{edu.periodo}</p>
                <h3 className="font-bold text-lg mb-1">{edu.titulo}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{edu.institucion}</p>
                <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
                  edu.estado === 'Titulado' 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                }`}>
                  {edu.estado}
                </span>
              </Card>
            ))}
          </div>
        </section>

        {/* Experiencia Laboral */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg">
              <IconBriefcase className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Experiencia Laboral</h2>
          </div>
          <div className="space-y-4">
            {data.experienciaLaboral.map((exp, i) => (
              <Card key={i} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="font-bold text-lg">{exp.cargo}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{exp.periodo}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">{exp.empresa}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{exp.descripcion}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Experiencia TI */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white shadow-lg">
              <IconCode className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Experiencia en Tecnología</h2>
          </div>
          <div className="space-y-4">
            {data.experienciaTI.map((exp, i) => (
              <Card key={i} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="font-bold text-lg">{exp.cargo}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{exp.periodo}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">{exp.empresa}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{exp.descripcion}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Habilidades */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
              <IconBolt className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Habilidades</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data.habilidades.map((hab, i) => (
              <Card key={i} className="p-5">
                <h3 className="font-bold mb-3 text-gray-900 dark:text-white">{hab.categoria}</h3>
                <div className="flex flex-wrap gap-2">
                  {hab.items.map((item, j) => (
                    <span key={j} className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Descargar */}
        <section className="text-center pt-8 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={handleDownload}
            disabled={generando}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-gray-900 rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generando ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-gray-900/30 dark:border-t-gray-900 rounded-full animate-spin" />
                Generando PDF...
              </>
            ) : (
              <>
                <IconDocument className="w-5 h-5" />
                Descargar CV en PDF
              </>
            )}
          </button>
        </section>
      </div>
    </PageLayout>
    
  )
  
}

export default Curriculum