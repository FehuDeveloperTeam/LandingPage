import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import { Barcode, Settings, Search, LayoutGrid, ArrowRight } from 'lucide-react';

const TOOLS = [
  {
    id: 'generador-barras',
    name: 'Generador de Código de Barras',
    description: 'Genera códigos CODE128 para tareas y ubicaciones logísticas.',
    icon: Barcode,
    path: '/herramientas/generador-barras',
    color: 'from-blue-500 to-cyan-500',
    glow: 'group-hover:shadow-blue-500/20'
  },
  {
    id: 'pokemon-tcg',
    name: 'Poké-Buscador TCG',
    description: 'Buscador avanzado de cartas con filtros por edición, tipo y rareza.',
    icon: Search, 
    path: '/herramientas/pokemon',
    color: 'from-red-600 to-orange-600',
    glow: 'group-hover:shadow-red-500/20'
  },
  {
    id: 'proximamente',
    name: 'Más herramientas',
    description: 'Estamos desarrollando nuevas utilidades para optimizar tu flujo de trabajo.',
    icon: Settings,
    path: '#',
    color: 'from-gray-400 to-gray-500',
    disabled: true
  }
];

function ToolsGallery() {
  return (
    <PageLayout 
      titulo="Toolbox" 
      subtitulo="Soluciones rápidas y utilidades de productividad para optimizar tus tareas cotidianas."
      icono={<LayoutGrid className="w-8 h-8" />}
    >
      <SEO 
        title="Herramientas | Fehu Developers" 
        description="Utilidades de productividad, generadores de códigos y buscadores técnicos." 
      />
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link 
              key={tool.id} 
              to={tool.disabled ? '#' : tool.path}
              className={`group relative p-8 rounded-[2.5rem] border backdrop-blur-md transition-all duration-500 ${
                tool.disabled 
                ? 'opacity-60 cursor-not-allowed bg-gray-100/50 dark:bg-white/5 border-gray-200 dark:border-white/5' 
                : `bg-white/50 dark:bg-white/5 border-white/20 dark:border-white/10 hover:-translate-y-2 hover:shadow-2xl ${tool.glow}`
              }`}
            >
              {/* Icono con gradiente */}
              <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                <Icon size={32} />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tool.name}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {tool.description}
              </p>

              {!tool.disabled && (
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white group-hover:gap-4 transition-all">
                  Abrir herramienta <ArrowRight size={18} className="text-blue-600" />
                </div>
              )}

              {tool.disabled && (
                <span className="text-xs font-medium px-3 py-1 bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400 rounded-full">
                  Próximamente
                </span>
              )}

              {/* Efecto de brillo sutil de fondo en hover */}
              {!tool.disabled && (
                <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity rounded-[2.5rem]`} />
              )}
            </Link>
          );
        })}
      </div>
    </PageLayout>
  );
}

export default ToolsGallery;