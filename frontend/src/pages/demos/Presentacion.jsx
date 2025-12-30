import { useState } from 'react'
import DemoLayout from '../../components/DemoLayout'
import ContactModal from '../../components/ContactModal'

function Presentacion() {
  const [contactoAbierto, setContactoAbierto] = useState(false)

  const servicios = [
    { icono: '💻', titulo: 'Transformación Digital', descripcion: 'Soluciones tecnológicas que optimizan procesos y aumentan la productividad.' },
    { icono: '📊', titulo: 'Consultoría Empresarial', descripcion: 'Análisis estratégico para impulsar el crecimiento sostenible.' },
    { icono: '🌐', titulo: 'Desarrollo de Software', descripcion: 'Aplicaciones web y móviles a medida para tu industria.' },
    { icono: '🔒', titulo: 'Ciberseguridad', descripcion: 'Protección de datos con las mejores prácticas de seguridad.' }
  ]

  const stats = [
    { numero: '150+', texto: 'Proyectos' },
    { numero: '50+', texto: 'Clientes' },
    { numero: '8', texto: 'Años' },
    { numero: '24/7', texto: 'Soporte' }
  ]

  const testimonios = [
    { texto: 'Gracias a Nexus pudimos digitalizar completamente nuestra operación. Los resultados superaron nuestras expectativas.', autor: 'María González', cargo: 'Gerente General', empresa: 'Agrícola Valle Verde' },
    { texto: 'El equipo demostró un profesionalismo excepcional. Entregaron antes del plazo con calidad impecable.', autor: 'Roberto Fuentes', cargo: 'Director de Operaciones', empresa: 'Transportes del Sur' },
    { texto: 'La consultoría estratégica nos permitió identificar oportunidades que no habíamos considerado.', autor: 'Carolina Muñoz', cargo: 'CEO', empresa: 'Comercial Ñuble' }
  ]

  return (
    <DemoLayout tema="presentacion">
      {(tema) => (
        <div className="space-y-24">
          {/* Hero */}
          <header className="text-center py-12 space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 text-5xl shadow-2xl shadow-emerald-500/30 mb-4 animate-bounce">
              🚀
            </div>
            <h1 className="text-5xl md:text-7xl font-bold">
              Nexus<span className={`bg-gradient-to-r ${tema.gradient} bg-clip-text text-transparent`}>Tech</span>
            </h1>
            <p className={`text-xl md:text-2xl ${tema.textMuted} max-w-2xl mx-auto`}>
              Impulsamos la transformación digital de empresas en la Región de Ñuble
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <button 
                onClick={() => setContactoAbierto(true)}
                className={`px-10 py-5 ${tema.btnPrimary} rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105`}
              >
                Consulta gratuita
              </button>
              <a 
                href="#servicios"
                className={`px-10 py-5 ${tema.btnSecondary} rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105`}
              >
                Conocer más
              </a>
            </div>
          </header>

          {/* Stats */}
          <section className={`${tema.card} rounded-3xl p-8 md:p-12`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${tema.gradient} bg-clip-text text-transparent`}>
                    {stat.numero}
                  </p>
                  <p className={tema.textMuted}>{stat.texto}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Servicios */}
          <section id="servicios" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h2>
              <p className={`${tema.textMuted} max-w-xl mx-auto`}>
                Soluciones integrales para potenciar tu negocio
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {servicios.map((s, i) => (
                <div key={i} className={`${tema.card} rounded-2xl p-8 ${tema.cardHover} transition-all duration-500 group`}>
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{s.icono}</div>
                  <h3 className="text-xl font-bold mb-2">{s.titulo}</h3>
                  <p className={tema.textMuted}>{s.descripcion}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Por qué elegirnos */}
          <section className={`${tema.card} rounded-3xl p-12`}>
            <h2 className="text-3xl font-bold mb-12 text-center">¿Por qué elegirnos?</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { icono: '🎯', titulo: 'Enfoque Personalizado', texto: 'Soluciones adaptadas a tus necesidades específicas.' },
                { icono: '🤝', titulo: 'Compromiso Regional', texto: 'Conocemos el mercado local y su desarrollo.' },
                { icono: '⚡', titulo: 'Resultados Medibles', texto: 'Métricas que demuestran el impacto real.' }
              ].map((item, i) => (
                <div key={i} className="text-center group">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${tema.gradient} flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    {item.icono}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.titulo}</h3>
                  <p className={tema.textMuted}>{item.texto}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonios */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Lo que dicen nuestros clientes</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonios.map((t, i) => (
                <div key={i} className={`${tema.card} rounded-2xl p-8`}>
                  <div className={`text-5xl mb-4 bg-gradient-to-r ${tema.gradient} bg-clip-text text-transparent`}>"</div>
                  <p className={`${tema.textMuted} mb-6 italic`}>{t.texto}</p>
                  <div>
                    <p className="font-bold">{t.autor}</p>
                    <p className={`text-sm ${tema.textMuted}`}>{t.cargo}, {t.empresa}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Final */}
          <section className={`bg-gradient-to-r ${tema.gradient} rounded-3xl p-12 text-center text-white`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para transformar tu negocio?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Agenda una consulta gratuita y descubre cómo podemos ayudarte.
            </p>
            <button 
              onClick={() => setContactoAbierto(true)}
              className="px-10 py-5 bg-white text-emerald-600 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              Contactar ahora
            </button>
          </section>

          {/* Contacto */}
          <section className="grid gap-6 md:grid-cols-3">
            {[
              { icono: '📍', titulo: 'Dirección', info: ['Maipú 450, Of. 302', 'San Carlos, Ñuble'] },
              { icono: '📞', titulo: 'Teléfono', info: ['+56 42 241 5000', '+56 9 8765 4321'] },
              { icono: '✉️', titulo: 'Email', info: ['contacto@nexustech.cl', 'ventas@nexustech.cl'] }
            ].map((c, i) => (
              <div key={i} className={`${tema.card} rounded-2xl p-6 text-center`}>
                <div className="text-4xl mb-3">{c.icono}</div>
                <h3 className="font-bold mb-2">{c.titulo}</h3>
                {c.info.map((line, j) => (
                  <p key={j} className={tema.textMuted}>{line}</p>
                ))}
              </div>
            ))}
          </section>

          <ContactModal 
            isOpen={contactoAbierto} 
            onClose={() => setContactoAbierto(false)}
            servicioPreseleccionado="consultoría empresarial"
          />
        </div>
      )}
    </DemoLayout>
  )
}

export default Presentacion