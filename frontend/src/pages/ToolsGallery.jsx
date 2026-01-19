import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import { Barcode, Settings, Search, LayoutGrid, ArrowRight, Zap, Clock, ArrowLeft} from 'lucide-react';

const TOOLS = [
  {
    id: 'generador-barras',
    name: 'Logistics Barcode',
    description: 'Motor de generación CODE128 para gestión de inventarios y etiquetado industrial.',
    icon: Barcode,
    path: '/herramientas/generador-barras',
    color: 'from-blue-600 to-indigo-500',
    glow: 'group-hover:shadow-blue-500/30'
  },
  {
    id: 'pokemon-tcg',
    name: 'Poké-Buscador TCG',
    description: 'Protocolo de búsqueda avanzada para coleccionistas. Filtros por rareza y set.',
    icon: Search, 
    path: '/herramientas/pokemon',
    color: 'from-rose-600 to-orange-500',
    glow: 'group-hover:shadow-rose-500/30'
  },
  {
    id: 'alarma-sistema',
    name: 'System Alarm',
    description: 'Módulo de monitoreo y alertas para sistemas críticos. Notificaciones en tiempo real.',
    icon: Clock,
    path: '/tools/alarma',
    color: 'from-blue-600 to-indigo-500',
    glow: 'group-hover:shadow-blue-500/30'
  },
  {
    id: 'proximamente',
    name: 'System Core',
    description: 'Módulos encriptados en desarrollo. Próximamente utilidades de automatización.',
    icon: Settings,
    path: '#',
    color: 'from-gray-600 to-gray-800',
    disabled: true
  }
];

function ToolsGallery() {
  return (
    <PageLayout 
      titulo="Toolbox" 
      subtitulo="Micro-utilidades de ingeniería diseñadas para optimizar flujos de trabajo técnicos y logística."
      icono={<LayoutGrid className="w-8 h-8 text-blue-500" />}
    >
      <SEO 
        title="Herramientas | Fehu Developers" 
        description="Utilidades de productividad, generadores de códigos y buscadores técnicos." 
      />

      {/* BOTÓN VOLVER (Navegación entre herramientas) */}
        <div className="flex justify-start">
          <Link 
            to="/herramientas" // Ajusta esta ruta a tu menú principal de herramientas
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Volver a Herramientas
          </Link>
        </div>
      
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link 
              key={tool.id} 
              to={tool.disabled ? '#' : tool.path}
              className={`group relative p-10 rounded-[3rem] border transition-all duration-500 overflow-hidden flex flex-col ${
                tool.disabled 
                ? 'opacity-50 cursor-not-allowed bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/5' 
                : `bg-white dark:bg-gray-900 border-gray-100 dark:border-white/10 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] ${tool.glow}`
              }`}
            >
              {/* Badge de Estado (Top Right) */}
              <div className="absolute top-8 right-8">
                {tool.disabled ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Standby</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Online</span>
                  </div>
                )}
              </div>

              {/* Icono Principal */}
              <div className={`w-20 h-20 bg-gradient-to-br ${tool.color} rounded-[2rem] flex items-center justify-center text-white mb-10 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative`}>
                <Icon size={36} strokeWidth={1.5} />
                {!tool.disabled && (
                    <div className="absolute inset-0 bg-white opacity-20 blur-xl scale-50 group-hover:scale-100 transition-transform duration-500" />
                )}
              </div>

              {/* Título y Descripción */}
              <div className="space-y-4 flex-grow">
                <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed text-sm">
                  {tool.description}
                </p>
              </div>

              {/* Footer de Tarjeta */}
              <div className="mt-10 pt-8 border-t border-gray-50 dark:border-white/5">
                {!tool.disabled ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">
                      Ejecutar <ArrowRight size={14} className="text-blue-500 group-hover:translate-x-2 transition-transform" />
                    </div>
                    <Zap size={14} className="text-amber-500 fill-amber-500 animate-pulse" />
                  </div>
                ) : (
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Módulo de Expansión
                  </p>
                )}
              </div>

              {/* Efecto de Luz de Fondo (Hover) */}
              {!tool.disabled && (
                <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`} />
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer de Soporte */}
      <div className="mt-20 p-8 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            ¿Necesitas una herramienta personalizada para tu empresa? 
            <Link to="/presentacion" className="ml-2 text-blue-500 hover:underline">Solicitar desarrollo</Link>
        </p>
      </div>
    </PageLayout>
  );
}

export default ToolsGallery;