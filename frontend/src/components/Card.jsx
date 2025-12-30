function Card({ children, className = '', hover = true, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white/70 dark:bg-white/5 
        backdrop-blur-xl 
        border border-gray-200/50 dark:border-white/10 
        rounded-2xl 
        transition-all duration-300
        ${hover ? 'hover:bg-white/90 dark:hover:bg-white/10 hover:shadow-xl hover:shadow-gray-900/5 dark:hover:shadow-black/20 hover:-translate-y-1' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default Card