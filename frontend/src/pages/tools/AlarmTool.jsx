import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, X, ArrowLeft, Bell, Play, Pause, RotateCcw, Timer
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';

const AlarmaTool = () => {
  const [activeTab, setActiveTab] = useState('alarmas');
  const [time, setTime] = useState(new Date());
  const [alarmas, setAlarmas] = useState(() => {
    const saved = localStorage.getItem('fehu-alarmas');
    return saved ? JSON.parse(saved) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [ringingAlarm, setRingingAlarm] = useState(null);

  // --- CRONÓMETRO ---
  const [chronoTime, setChronoTime] = useState(0);
  const [chronoRunning, setChronoRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const chronoRef = useRef(null);

  // --- TEMPORIZADOR ---
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerInput, setTimerInput] = useState({ h: '', m: '', s: '' });
  const timerRef = useRef(null);

  const [newAlarm, setNewAlarm] = useState({ time: '08:00', label: '' });
  
  // REFERENCIA DE AUDIO
  const audioRef = useRef(null);

  // Persistencia de alarmas
  useEffect(() => {
    localStorage.setItem('fehu-alarmas', JSON.stringify(alarmas));
  }, [alarmas]);

  // Reloj y Chequeo de Alarma cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now);
      
      const hh = now.getHours().toString().padStart(2, '0');
      const mm = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${hh}:${mm}`;
      
      // Solo chequeamos al segundo 0 para evitar que suene 60 veces
      if (now.getSeconds() === 0) {
        alarmas.forEach(a => {
          if (a.enabled && a.time === currentTime && !ringingAlarm) {
            triggerAlarm(a);
          }
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [alarmas, ringingAlarm]);

  // Lógica de Temporizador
  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      triggerAlarm({ label: 'Temporizador Finalizado', time: '00:00' });
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, timerSeconds]);

  // FUNCIÓN CRÍTICA: Disparar Alarma
  const triggerAlarm = (alarm) => {
    setRingingAlarm(alarm);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.muted = false; // Forzar sonido
      
      // Intentar reproducir y capturar error de política de navegador
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("El navegador bloqueó el audio. Se requiere interacción previa.", error);
        });
      }
    }
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setRingingAlarm(null);
  };

  // Función para "despertar" el audio mediante un clic del usuario
  const unlockAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }).catch(() => {/* Silencioso */});
    }
  };

  const handleTimerInputChange = (u, value) => {
    let val = Math.max(0, parseInt(value) || 0);
    if (u === 'h' && val > 99) val = 99;
    if ((u === 'm' || u === 's') && val > 59) val = 59;
    setTimerInput({ ...timerInput, [u]: val });
  };

  const startTimer = () => {
    unlockAudio(); // IMPORTANTE: Desbloquea el audio al hacer clic
    const total = (Number(timerInput.h) * 3600) + (Number(timerInput.m) * 60) + Number(timerInput.s);
    if (total > 0) {
      setTimerSeconds(total);
      setTimerActive(true);
    }
  };

  const formatChrono = (ms) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const msRemainder = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}.${msRemainder.toString().padStart(2, '0')}`;
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 relative z-10">
        
        {/* AUDIO ELEMENT - Movido arriba para asegurar carga */}
        <audio ref={audioRef} loop preload="auto">
          <source src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" type="audio/mpeg" />
        </audio>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 dark:border-white/5 pb-10">
          <div>
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter dark:text-white">
              Time<span className="text-blue-600">Control</span>
            </h1>
          </div>
          <div className="text-5xl md:text-7xl font-black italic tracking-tighter dark:text-white tabular-nums font-mono">
            {time.toLocaleTimeString()}
          </div>
        </header>

        {/* TABS */}
        <nav className="flex p-1.5 bg-gray-100 dark:bg-white/5 rounded-[2rem]">
          {['alarmas', 'cronometro', 'temporizador'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-lg' : 'text-gray-400'}`}>
              {tab}
            </button>
          ))}
        </nav>

        <main className="min-h-[400px]">
          {activeTab === 'alarmas' && (
            <div className="grid md:grid-cols-2 gap-6">
              <button onClick={() => setShowModal(true)} className="p-10 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-4 hover:border-blue-600 group">
                <Plus size={32} className="text-blue-600 group-hover:scale-110" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Nueva Alarma</span>
              </button>
              {alarmas.map(a => (
                <div key={a.id} className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-4xl font-black italic tracking-tighter dark:text-white font-mono tabular-nums">{a.time}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{a.label || 'Sin Etiqueta'}</p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setAlarmas(alarmas.map(x => x.id === a.id ? {...x, enabled: !x.enabled} : x))}
                      className={`w-12 h-7 rounded-full transition-all flex items-center px-1 ${a.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white/10'}`}
                    >
                      <div className={`h-5 w-5 bg-white rounded-full transition-transform ${a.enabled ? 'translate-x-5' : ''}`} />
                    </button>
                    <button onClick={() => setAlarmas(alarmas.filter(x => x.id !== a.id))} className="text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'cronometro' && (
            <div className="flex flex-col items-center py-10 space-y-10">
              <div className="text-7xl md:text-[10rem] font-black italic tracking-tighter text-blue-600 leading-none font-mono tabular-nums">
                {formatChrono(chronoTime)}
              </div>
              <div className="flex gap-4">
                <button onClick={() => { setChronoRunning(!chronoRunning); unlockAudio(); }} className="h-20 w-20 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl active:scale-95 transition-transform">
                  {chronoRunning ? <Pause size={30} /> : <Play size={30} fill="white" />}
                </button>
                <button onClick={() => { if (chronoTime > 0) setLaps([chronoTime, ...laps]); }} className="h-20 w-20 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center dark:text-white"><Timer size={30}/></button>
                <button onClick={() => {setChronoTime(0); setChronoRunning(false); setLaps([]);}} className="h-20 w-20 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center dark:text-white"><RotateCcw size={30}/></button>
              </div>
              <div className="w-full max-w-md space-y-2 mt-8 max-h-60 overflow-y-auto custom-scrollbar">
                {laps.map((lap, i) => (
                  <div key={i} className="flex justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase text-gray-400">Vuelta {laps.length - i}</span>
                    <span className="font-mono tabular-nums font-bold dark:text-white">{formatChrono(lap)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'temporizador' && (
            <div className="flex flex-col items-center py-10 space-y-12">
              {!timerActive ? (
                <div className="flex gap-4">
                  {['h', 'm', 's'].map(u => (
                    <div key={u} className="flex flex-col items-center gap-2">
                      <input 
                        type="number" placeholder="00" value={timerInput[u]}
                        className="w-20 md:w-28 p-6 text-3xl md:text-5xl font-black text-center bg-gray-100 dark:bg-white/5 dark:text-white rounded-2xl outline-none focus:ring-2 ring-blue-600 transition-all font-mono tabular-nums"
                        onChange={(e) => handleTimerInputChange(u, e.target.value)} 
                      />
                      <span className="text-[10px] font-black uppercase text-gray-400">{u === 'h' ? 'Hrs' : u === 'm' ? 'Min' : 'Seg'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-7xl md:text-[10rem] font-black italic tracking-tighter text-blue-600 font-mono tabular-nums">
                  {new Date(timerSeconds * 1000).toISOString().substr(11, 8)}
                </div>
              )}
              <button onClick={timerActive ? () => {setTimerActive(false); setTimerSeconds(0);} : startTimer} className={`px-12 py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${timerActive ? 'bg-red-500 shadow-red-500/20' : 'bg-blue-600 shadow-blue-600/20'} text-white shadow-xl`}>
                {timerActive ? 'Cancelar' : 'Iniciar'}
              </button>
            </div>
          )}
        </main>

        {/* MODAL NUEVA ALARMA */}
        {showModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-white/80 dark:bg-black/90 backdrop-blur-xl">
            <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-sm rounded-[3rem] p-10 border border-gray-200 dark:border-white/10 shadow-2xl space-y-6">
              <input type="time" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 text-5xl font-black text-center text-blue-600 outline-none font-mono" value={newAlarm.time} onChange={(e) => setNewAlarm({...newAlarm, time: e.target.value})} />
              <input type="text" placeholder="ETIQUETA" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 text-center font-black text-[10px] uppercase tracking-widest outline-none dark:text-white" value={newAlarm.label} onChange={(e) => setNewAlarm({...newAlarm, label: e.target.value})} />
              <button onClick={() => { unlockAudio(); setAlarmas([{ ...newAlarm, id: Date.now(), enabled: true }, ...alarmas]); setShowModal(false); }} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest">Guardar</button>
              <button onClick={() => setShowModal(false)} className="w-full text-[10px] font-black uppercase text-gray-400">Cancelar</button>
            </div>
          </div>
        )}

        {/* OVERLAY DE ALARMA SONANDO */}
        {ringingAlarm && (
          <div className="fixed inset-0 z-[1000] bg-blue-600 flex flex-col items-center justify-center p-10 text-center text-white">
            <Bell size={100} className="animate-bounce mb-8" />
            <h2 className="text-8xl md:text-[12rem] font-black italic tracking-tighter mb-4 font-mono tabular-nums leading-none">{ringingAlarm.time}</h2>
            <p className="text-2xl font-black uppercase tracking-[0.4em] mb-12">{ringingAlarm.label || '¡ALERTA!'}</p>
            <button onClick={stopAlarm} className="w-full max-w-sm py-8 bg-white text-blue-600 rounded-[2rem] font-black text-xl shadow-2xl active:scale-95 transition-transform">DETENER</button>
          </div>
        )}

      </div>
    </PageLayout>
  );
};

export default AlarmaTool;