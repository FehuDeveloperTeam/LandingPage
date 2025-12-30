function DemoLayout({ children, tema }) {
  const temas = {
    tangibles: {
      // Fondo con gradiente
      bg: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-950 dark:via-orange-950/50 dark:to-gray-900',
      // Texto
      text: 'text-gray-800 dark:text-gray-100',
      textMuted: 'text-gray-600 dark:text-gray-400',
      textAccent: 'text-orange-600 dark:text-orange-400',
      // Cards con glassmorphism
      card: 'bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10',
      cardHover: 'hover:bg-white/90 dark:hover:bg-white/10 hover:shadow-2xl hover:shadow-orange-500/10',
      // Botones
      btnPrimary: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50',
      btnSecondary: 'bg-white/50 dark:bg-white/10 backdrop-blur border border-orange-200/50 dark:border-orange-500/30 hover:bg-white/80 dark:hover:bg-white/20',
      // Inputs
      input: 'bg-white/50 dark:bg-white/5 backdrop-blur border border-gray-200/50 dark:border-white/10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20',
      // Badges
      badge: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/20',
      // Decoración
      glow: 'orange',
      gradient: 'from-orange-500 to-amber-500',
    },
    intangibles: {
      bg: 'bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 dark:from-gray-950 dark:via-cyan-950/50 dark:to-gray-900',
      text: 'text-gray-800 dark:text-gray-100',
      textMuted: 'text-gray-600 dark:text-gray-400',
      textAccent: 'text-cyan-600 dark:text-cyan-400',
      card: 'bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10',
      cardHover: 'hover:bg-white/90 dark:hover:bg-white/10 hover:shadow-2xl hover:shadow-cyan-500/10',
      btnPrimary: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50',
      btnSecondary: 'bg-white/50 dark:bg-white/10 backdrop-blur border border-cyan-200/50 dark:border-cyan-500/30 hover:bg-white/80 dark:hover:bg-white/20',
      input: 'bg-white/50 dark:bg-white/5 backdrop-blur border border-gray-200/50 dark:border-white/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20',
      badge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20',
      glow: 'cyan',
      gradient: 'from-cyan-500 to-blue-500',
    },
    servicios: {
      bg: 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-950 dark:via-violet-950/50 dark:to-gray-900',
      text: 'text-gray-800 dark:text-gray-100',
      textMuted: 'text-gray-600 dark:text-gray-400',
      textAccent: 'text-violet-600 dark:text-violet-400',
      card: 'bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10',
      cardHover: 'hover:bg-white/90 dark:hover:bg-white/10 hover:shadow-2xl hover:shadow-violet-500/10',
      btnPrimary: 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50',
      btnSecondary: 'bg-white/50 dark:bg-white/10 backdrop-blur border border-violet-200/50 dark:border-violet-500/30 hover:bg-white/80 dark:hover:bg-white/20',
      input: 'bg-white/50 dark:bg-white/5 backdrop-blur border border-gray-200/50 dark:border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20',
      badge: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20',
      glow: 'violet',
      gradient: 'from-violet-500 to-purple-500',
    },
    presentacion: {
      bg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-gray-950 dark:via-emerald-950/50 dark:to-gray-900',
      text: 'text-gray-800 dark:text-gray-100',
      textMuted: 'text-gray-600 dark:text-gray-400',
      textAccent: 'text-emerald-600 dark:text-emerald-400',
      card: 'bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10',
      cardHover: 'hover:bg-white/90 dark:hover:bg-white/10 hover:shadow-2xl hover:shadow-emerald-500/10',
      btnPrimary: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50',
      btnSecondary: 'bg-white/50 dark:bg-white/10 backdrop-blur border border-emerald-200/50 dark:border-emerald-500/30 hover:bg-white/80 dark:hover:bg-white/20',
      input: 'bg-white/50 dark:bg-white/5 backdrop-blur border border-gray-200/50 dark:border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
      badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20',
      glow: 'emerald',
      gradient: 'from-emerald-500 to-teal-500',
    },
  }

  const t = temas[tema] || temas.presentacion

  return (
    <div className={`min-h-screen -mx-8 -my-12 ${t.bg} ${t.text} transition-all duration-500 relative overflow-hidden`}>
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br ${t.gradient} rounded-full opacity-20 blur-3xl animate-pulse`}></div>
        <div className={`absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br ${t.gradient} rounded-full opacity-10 blur-3xl animate-pulse`} style={{animationDelay: '1s'}}></div>
        <div className={`absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-br ${t.gradient} rounded-full opacity-15 blur-3xl animate-pulse`} style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Contenido */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-12">
        {typeof children === 'function' ? children(t) : children}
      </div>
    </div>
  )
}

export default DemoLayout