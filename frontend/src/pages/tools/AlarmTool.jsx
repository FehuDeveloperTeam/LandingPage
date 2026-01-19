import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, Bell, Timer, StopCircle, Play, Pause, 
  RotateCcw, Plus, Trash2, Moon, Sun, Zap, 
  Volume2, VolumeX, ChevronRight, X, AlarmClock
} from 'lucide-react';

const AlarmaTool = () => {
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState('alarmas');
  const [time, setTime] = useState(new Date());
  const [alarmas, setAlarmas] = useState(JSON.parse(localStorage.getItem('fehu-alarmas')) || []);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [wakeLock, setWakeLock] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ringingAlarm, setRingingAlarm] = useState(null);

  // Estados Cronómetro
  const [chronoTime, setChronoTime] = useState(0);
  const [chronoRunning, setChronoRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  // Estados Temporizador
  const [timerInput, setTimerInput] = useState({ h: 0, m: 0, s: 0 });
  const [timerTotal, setTimerTotal] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // --- REFS ---
  const audioRef = useRef(null);
  const chronoInterval = useRef(null);
  const timerInterval = useRef(null);

  // --- EFECTOS ---
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    checkAlarms();
    return () => clearInterval(timer);
  }, [time]);

  useEffect(() => {
    localStorage.setItem('fehu-alarmas', JSON.stringify(alarmas));
  }, [alarmas]);

  // --- LÓGICA DE ALARMA ---
  const checkAlarms = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0-6
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    alarmas.forEach(alarm => {
      if (alarm.enabled && alarm.time === currentTime && alarm.days.includes(currentDay) && !ringingAlarm) {
        triggerAlarm(alarm);
      }
    });
  };

  const triggerAlarm = (alarm) => {
    setRingingAlarm(alarm);
    audioRef.current.play();
    if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
  };

  const stopAlarm = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setRingingAlarm(null);
  };

  const handleSnooze = () => {
    stopAlarm();
    const snoozeTime = 5; // 5 minutos
    const [h, m] = ringingAlarm.time.split(':').map(Number);
    let newM = m + snoozeTime;
    let newH = h;
    if (newM >= 60) { newM -= 60; newH = (newH + 1) % 24; }
    
    const newTimeString = `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
    
    const snoozeAlarm = {
      ...ringingAlarm,
      id: Date.now(),
      time: newTimeString,
      label: `${ringingAlarm.label} (Pospuesta)`,
      isSnooze: true
    };
    setAlarmas([...alarmas, snoozeAlarm]);
  };

  // --- RENDERIZADO DE INTERFAZ ---
  return (
    <div className={`min-h-screen transition-colors duration-500 p-4 md:p-8 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Estilo Editorial */}
        <header className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 dark:border-white/10 pb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 text-blue-600 mb-2">
              <AlarmClock className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Fehu OS / Tools</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              Time<span className="text-blue-600">Control</span>
            </h1>
          </div>
          
          <div className="text-right">
            <p className="text-4xl md:text-6xl font-black italic tracking-tighter">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {time.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </header>

        {/* Tabs de Navegación Neomorfistas */}
        <nav className="flex p-2 bg-gray-100 dark:bg-white/5 rounded-[2rem] gap-2">
          {['alarmas', 'cronometro', 'temporizador'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                ? 'bg-white dark:bg-white/10 shadow-xl text-blue-600' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Contenido Dinámico */}
        <main className="min-h-[400px]">
          {activeTab === 'alarmas' && (
            <div className="grid gap-4">
              <button 
                onClick={() => setShowModal(true)}
                className="group p-8 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-4 hover:border-blue-500 transition-colors"
              >
                <div className="p-4 bg-blue-600/10 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                  <Plus size={32} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Añadir Nueva Alarma</span>
              </button>

              {alarmas.map(alarm => (
                <div key={alarm.id} className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-4xl font-black italic tracking-tighter">{alarm.time}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{alarm.label || 'Sin etiqueta'}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setAlarmas(alarmas.filter(a => a.id !== alarm.id))}
                      className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div 
                      onClick={() => setAlarmas(alarmas.map(a => a.id === alarm.id ? {...a, enabled: !a.enabled} : a))}
                      className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${alarm.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white/10'}`}
                    >
                      <div className={`w-6 h-6 bg-white rounded-full transition-transform ${alarm.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CRONÓMETRO - Optimizado */}
          {activeTab === 'cronometro' && (
            <div className="text-center space-y-8">
              <div className="text-7xl md:text-9xl font-black italic tracking-tighter text-blue-600">
                {new Date(chronoTime).toISOString().substr(11, 8)}
                <span className="text-2xl ml-2">{(chronoTime % 1000).toString().padStart(3, '0').substr(0, 2)}</span>
              </div>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setChronoRunning(!chronoRunning)}
                  className={`p-6 rounded-full ${chronoRunning ? 'bg-red-500' : 'bg-blue-600'} text-white shadow-xl hover:scale-105 transition-all`}
                >
                  {chronoRunning ? <Pause size={32} /> : <Play size={32} />}
                </button>
                <button 
                  onClick={() => {setChronoTime(0); setLaps([])}}
                  className="p-6 rounded-full bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-white"
                >
                  <RotateCcw size={32} />
                </button>
              </div>
            </div>
          )}
        </main>

        {/* MODAL DE ALARMA SONANDO (Overlay de Pantalla Completa) */}
        {ringingAlarm && (
          <div className="fixed inset-0 z-[200] bg-blue-600 flex items-center justify-center p-6 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse" />
            <div className="relative text-center space-y-12">
              <div className="space-y-4">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <Bell size={48} className="text-white" />
                </div>
                <h2 className="text-8xl font-black italic tracking-tighter">{ringingAlarm.time}</h2>
                <p className="text-xl font-bold uppercase tracking-[0.4em]">{ringingAlarm.label || 'ALERTA DE TIEMPO'}</p>
              </div>
              
              <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
                <button 
                  onClick={handleSnooze}
                  className="py-6 bg-white/10 backdrop-blur-md border border-white/30 rounded-[2rem] font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                >
                  Posponer 5 min
                </button>
                <button 
                  onClick={stopAlarm}
                  className="py-6 bg-white text-blue-600 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl"
                >
                  Detener Alarma
                </button>
              </div>
            </div>
          </div>
        )}

        <audio ref={audioRef} loop>
          <source src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" type="audio/mpeg" />
        </audio>

      </div>
    </div>
  );
};

export default AlarmaTool;