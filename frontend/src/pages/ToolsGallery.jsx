import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import { Barcode, QrCode, Calculator, Settings } from 'lucide-react';

const TOOLS = [
  {
    id: 'generador-barras',
    name: 'Generador de Código de Barras',
    description: 'Genera códigos CODE128 para tareas y ubicaciones logísticas.',
    icon: Barcode,
    path: '/herramientas/generador-barras',
    color: 'bg-blue-500'
  },
  {
    id: 'pokemon-tcg',
    name: 'Poké-Buscador TCG',
    description: 'Buscador avanzado de cartas con filtros por edición, tipo y rareza.',
    icon: Search, 
    path: '/herramientas/pokemon',
    color: 'bg-red-600'
  },
  // Aquí podrás añadir más herramientas en el futuro fácilmente
  {
    id: 'proximamente',
    name: 'Más herramientas',
    description: 'Estamos desarrollando nuevas utilidades para optimizar tu flujo de trabajo.',
    icon: Settings,
    path: '#',
    color: 'bg-gray-400',
    disabled: true
  }
];

function ToolsGallery() {
  return (
    <PageLayout>
      <SEO title="Herramientas" description="Utilidades y herramientas de productividad." />
      
      <div className="min-h-screen bg-white dark:bg-black py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
              Toolbox<span className="text-blue-600">.</span>
            </h1>
            <p className="text-gray-500 mt-4 text-lg">Soluciones rápidas para tareas cotidianas.</p>
          </header>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link 
                  key={tool.id} 
                  to={tool.path}
                  className={`group p-8 rounded-[32px] border-2 transition-all duration-300 ${
                    tool.disabled 
                    ? 'opacity-60 cursor-not-allowed border-gray-100 dark:border-gray-800' 
                    : 'border-gray-100 dark:border-gray-800 hover:border-blue-500 hover:shadow-2xl'
                  }`}
                >
                  <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                    {tool.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    {tool.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default ToolsGallery;