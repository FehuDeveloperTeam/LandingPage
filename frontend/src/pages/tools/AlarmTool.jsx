import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, X, ArrowLeft, Bell, Play, Pause, RotateCcw 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';

const AlarmaTool = () => {
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState('alarmas');
  const [time, setTime] = useState(new Date());
  const [alarmas, setAlarmas] = useState(() => {
    const saved = localStorage.getItem('fehu-alarmas');
    return saved ? JSON.parse(saved) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [ringingAlarm, setRingingAlarm] = useState(null);

  const [chronoTime, setChronoTime] = useState(0);
  const [chronoRunning, setChronoRunning] = useState(false);
  const chronoRef = useRef(null);

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerInput, setTimerInput] = useState({ h: 0, m: 0, s: 0 });
  const timerRef = useRef(null);

  const [newAlarm, setNewAlarm] = useState({ time: '08:00', label: '' });
  const audioRef = useRef(null);

  // Persistencia
  useEffect(() => {
    localStorage.setItem('fehu-alarmas', JSON.stringify(alarmas));
  }, [alarmas]);

  // Reloj y Lógica de Alarma
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now);
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (now.getSeconds() === 0) {
        alarmas.forEach(a => {
          if (a.enabled && a.time === currentTime && !ringingAlarm) {
            setRingingAlarm(a);
            if (audioRef.current) audioRef.current.play().catch(console.error);
          }
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [alarmas, ringingAlarm]);

  // Cronómetro
  useEffect(() => {
    if (chronoRunning) {
      chronoRef.current = setInterval(() => setChronoTime(prev => prev + 10), 10);
    } else {
      clearInterval(chronoRef.current);
    }
    return () => clearInterval(chronoRef.current);
  }, [chronoRunning]);

  // Temporizador
  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      timerRef.current = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      setRingingAlarm({ label: 'Temporizador', time: '00:00' });
      if (audioRef.current) audioRef.current.play().catch(console.error);
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, timerSeconds]);

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setRingingAlarm(null);
  };

  const startTimer = () => {
    const total = (parseInt(timerInput.h || 0) * 3600) + (parseInt(timerInput.m || 0) * 60) + parseInt(timerInput.s || 0);
    if (total > 0) {
      setTimerSeconds(total);
      setTimerActive(true);
    }
  };

  const formatChrono = (ms) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const msRemainder = ((ms % 1000) / 10).toFixed(0);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}.${msRemainder.toString().padStart(2, '0')}`;
  };

  // --- RENDERIZADO ---
  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 relative z-10">
        
        {/* NAVEGACIÓN */}
        <div className="flex justify-between items-center">
          <Link to="/herramientas" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowLeft size={14} /> Volver a Herramientas
          </Link>
        </div>

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 dark:border-white/5 pb-10">
          <div>
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8] dark:text-white">
              Time<span className="text-blue-600">Control</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-4">Fehu Precision Engineering</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-5xl md:text-7xl font-black italic tracking-tighter dark:text-white">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </header>

        {/* TABS */}
        <nav className="flex p-1.5 bg-gray-100 dark:bg-white/5 rounded-[2rem] border border-gray-200 dark:border-white/5">
          {['alarmas', 'cronometro', 'temporizador'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-lg' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* CONTENIDO PRINCIPAL */}
        <main className="min-h-[400px]">
          {activeTab === 'alarmas' && (
            <div className="grid md:grid-cols-2 gap-6">
              <button 
                onClick={() => setShowModal(true)}
                className="p-10 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-4 hover:border-blue-600 transition-all group"
              >
                <Plus size={32} className="text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Nueva Alarma</span>
              </button>

              {alarmas.map(a => (
                <div key={a.id} className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-4xl font-black italic tracking-tighter dark:text-white">{a.time}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{a.label || 'Alarma'}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setAlarmas(alarmas.filter(x => x.id !== a.id))} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                    <button 
                      onClick={() => setAlarmas(alarmas.map(x => x.id === a.id ? {...x, enabled: !x.enabled} : x))}
                      className={`w-12 h-7 rounded-full transition-all flex items-center px-1 ${a.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white/10'}`}
                    >
                      <div className={`h-5 w-5 bg-white rounded-full shadow-md transform transition-transform ${a.enabled ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'cronometro' && (
            <div className="flex flex-col items-center py-10 space-y-10">
              <div className="text-7xl md:text-[10rem] font-black italic tracking-tighter text-blue-600 leading-none">
                {formatChrono(chronoTime)}
              </div>
              <div className="flex gap-6">
                <button onClick={() => setChronoRunning(!chronoRunning)} className="h-20 w-20 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/20 active:scale-95 transition-transform">
                  {chronoRunning ? <Pause size={30} /> : <Play size={30} fill="white" />}
                </button>
                <button onClick={() => {setChronoTime(0); setChronoRunning(false)}} className="h-20 w-20 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center dark:text-white active:scale-95 transition-transform">
                  <RotateCcw size={30}/>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'temporizador' && (
            <div className="flex flex-col items-center py-10 space-y-12">
              {!timerActive ? (
                <div className="flex gap-4">
                  {['h', 'm', 's'].map(u => (
                    <div key={u} className="flex flex-col items-center gap-2">
                      <input type="number" placeholder="00" className="w-20 md:w-28 p-6 text-3xl md:text-5xl font-black text-center bg-gray-100 dark:bg-white/5 dark:text-white rounded-2xl outline-none focus:ring-2 ring-blue-600 transition-all"
                        onChange={(e) => setTimerInput({...timerInput, [u]: e.target.value})} />
                      <span className="text-[10px] font-black uppercase text-gray-400">{u === 'h' ? 'Horas' : u === 'm' ? 'Min' : 'Seg'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-7xl md:text-[10rem] font-black italic tracking-tighter text-blue-600 leading-none">
                  {new Date(timerSeconds * 1000).toISOString().substr(11, 8)}
                </div>
              )}
              <button onClick={timerActive ? () => {setTimerActive(false); setTimerSeconds(0);} : startTimer} className={`px-12 py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${timerActive ? 'bg-red-500 shadow-red-500/20' : 'bg-blue-600 shadow-blue-600/20'} text-white shadow-xl`}>
                {timerActive ? 'Cancelar' : 'Iniciar Cuenta Regresiva'}
              </button>
            </div>
          )}
        </main>

        {/* MODAL NUEVA ALARMA */}
        {showModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-white/80 dark:bg-black/90 backdrop-blur-xl">
            <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-sm rounded-[3rem] p-10 border border-gray-200 dark:border-white/10 shadow-2xl space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black uppercase italic dark:text-white">Nueva Alarma</h3>
                <button onClick={() => setShowModal(false)} className="dark:text-white"><X size={20}/></button>
              </div>
              <input 
                type="time" 
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 text-5xl font-black text-center text-blue-600 outline-none"
                value={newAlarm.time}
                onChange={(e) => setNewAlarm({...newAlarm, time: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="ETIQUETA (EJ. MEDICINA)"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 text-center font-black text-[10px] uppercase tracking-widest outline-none dark:text-white"
                value={newAlarm.label}
                onChange={(e) => setNewAlarm({...newAlarm, label: e.target.value.toUpperCase()})}
              />
              <button 
                onClick={() => {
                  setAlarmas([...alarmas, { ...newAlarm, id: Date.now(), enabled: true }]);
                  setShowModal(false);
                  setNewAlarm({ time: '08:00', label: '' });
                }}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-600/30"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        )}

        {/* PANTALLA DE ALARMA SONANDO */}
        {ringingAlarm && (
          <div className="fixed inset-0 z-[1000] bg-blue-600 flex flex-col items-center justify-center p-10 text-center text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <Bell size={120} className="animate-bounce mb-8 relative z-10" />
            <h2 className="text-8xl md:text-[12rem] font-black italic tracking-tighter mb-4 relative z-10 leading-none">{ringingAlarm.time}</h2>
            <p className="text-2xl md:text-4xl font-black uppercase tracking-[0.4em] mb-12 relative z-10">{ringingAlarm.label || '¡ATENCIÓN!'}</p>
            <button onClick={stopAlarm} className="w-full max-w-sm py-8 bg-white text-blue-600 rounded-[2rem] font-black text-xl uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform relative z-10">
              DETENER AHORA
            </button>
          </div>
        )}

        {/* AUDIO ELEMENT */}
        <audio ref={audioRef} loop preload="auto">
          <source src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </PageLayout>
  );
};

export default AlarmaTool;
