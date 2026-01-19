import React, { useState, useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import PageLayout from '../../components/PageLayout';
import SEO from '../../components/SEO';
import { Barcode, Download, AlertCircle, ArrowLeft, RefreshCcw, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const BarcodeGenerator = () => {
  const [taskInput, setTaskInput] = useState('');
  const [taskError, setTaskError] = useState('');
  const [taskDownloadUrl, setTaskDownloadUrl] = useState('');
  const taskSvgRef = useRef(null);

  const [locInput, setLocInput] = useState('');
  const [locError, setLocError] = useState('');
  const [locDownloadUrl, setLocDownloadUrl] = useState('');
  const locSvgRef = useRef(null);

  // Limpieza de URLs de descarga para evitar fugas de memoria
  useEffect(() => {
    return () => {
      if (taskDownloadUrl) URL.revokeObjectURL(taskDownloadUrl);
      if (locDownloadUrl) URL.revokeObjectURL(locDownloadUrl);
    };
  }, [taskDownloadUrl, locDownloadUrl]);

  const prepareDownload = (svgElement, setDownloadUrl) => {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    setDownloadUrl(url);
  };

  const generateTask = () => {
    setTaskError('');
    if (!taskInput.trim()) return;
    try {
      JsBarcode(taskSvgRef.current, taskInput.trim(), {
        format: "CODE128",
        lineColor: "#000",
        width: 2.5,
        height: 100,
        displayValue: true,
        fontSize: 16,
        fontOptions: "bold",
        margin: 10
      });
      prepareDownload(taskSvgRef.current, setTaskDownloadUrl);
    } catch (e) {
      setTaskError('Caracteres no compatibles con CODE128');
    }
  };

  const generateLocation = () => {
    setLocError('');
    const input = locInput.trim();
    if (!input) return;
    try {
      const parts = input.split('-');
      if (parts.length !== 5) throw new Error("Formato requerido: ***-**-**-**-**");
      
      // Transformación lógica para sistema de bodega
      const refactored = `${parts[0]}_${parts[1]}${parts[2]}${parts[3]}_${parts[4]}`;
      
      JsBarcode(locSvgRef.current, refactored, {
        format: "CODE128",
        lineColor: "#000",
        width: 2.5,
        height: 100,
        displayValue: true,
        fontSize: 16,
        fontOptions: "bold",
        margin: 10
      });
      prepareDownload(locSvgRef.current, setLocDownloadUrl);
    } catch (e) {
      setLocError(e.message);
    }
  };

  const resetFields = (type) => {
    if (type === 'task') {
      setTaskInput('');
      setTaskDownloadUrl('');
      setTaskError('');
    } else {
      setLocInput('');
      setLocDownloadUrl('');
      setLocError('');
    }
  };

  return (
    <PageLayout 
      titulo="Generador Industrial" 
      subtitulo="Protocolo de generación de etiquetas CODE128 para automatización de almacenes."
      icono={<Barcode className="w-8 h-8 text-blue-500" />}
    >
      <SEO title="Generador de Barras Industrial | Fehu Developers" description="Herramienta logística avanzada para códigos CODE128." />
      
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-12">
          <Link 
            to="/herramientas" 
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-sm font-black uppercase tracking-widest hover:text-blue-500 transition-all shadow-sm"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Volver
          </Link>
          <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            <ClipboardCheck size={14} className="text-emerald-500" /> System Ready
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          
          {/* MÓDULO TAREA */}
          <div className="group bg-white dark:bg-gray-900 rounded-[3rem] p-8 md:p-10 border border-gray-100 dark:border-white/10 shadow-2xl transition-all">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                <span className="w-3 h-8 bg-blue-600 rounded-full"></span>
                Task Engine
              </h2>
              <button onClick={() => resetFields('task')} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <RefreshCcw size={18} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <input 
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && generateTask()}
                  placeholder="ID DE TAREA (EJ: T-900)"
                  className="w-full px-6 py-5 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-blue-600 rounded-[1.5rem] outline-none font-bold dark:text-white transition-all placeholder:opacity-30"
                />
              </div>
              <button 
                onClick={generateTask}
                className="w-full bg-gray-900 dark:bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs py-5 rounded-[1.5rem] transition-all shadow-xl active:scale-[0.98]"
              >
                Compilar Código
              </button>
            </div>

            <div className="mt-10 p-8 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
              {taskDownloadUrl ? (
                <div className="animate-in fade-in zoom-in duration-300">
                  <svg ref={taskSvgRef}></svg>
                </div>
              ) : (
                !taskError && <Barcode size={80} className="text-gray-100 dark:text-gray-800" />
              )}
              {taskError && (
                <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg font-bold text-xs">
                  <AlertCircle size={16}/> {taskError}
                </div>
              )}
            </div>

            {taskDownloadUrl && (
              <a href={taskDownloadUrl} download={`task_${taskInput}.svg`} className="flex items-center justify-center gap-3 mt-8 p-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                <Download size={18} /> Descargar Vector SVG
              </a>
            )}
          </div>

          {/* MÓDULO UBICACIÓN */}
          <div className="group bg-white dark:bg-gray-900 rounded-[3rem] p-8 md:p-10 border border-gray-100 dark:border-white/10 shadow-2xl transition-all">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                <span className="w-3 h-8 bg-emerald-500 rounded-full"></span>
                Location Core
              </h2>
              <button onClick={() => resetFields('loc')} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <RefreshCcw size={18} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <input 
                  type="text"
                  value={locInput}
                  onChange={(e) => setLocInput(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && generateLocation()}
                  placeholder="AC6-OR-09-01-01"
                  className="w-full px-6 py-5 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-emerald-500 rounded-[1.5rem] outline-none font-bold dark:text-white transition-all placeholder:opacity-30"
                />
              </div>
              <button 
                onClick={generateLocation}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-xs py-5 rounded-[1.5rem] transition-all shadow-xl active:scale-[0.98]"
              >
                Generar Etiqueta
              </button>
            </div>

            <div className="mt-10 p-8 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
              {locDownloadUrl ? (
                <div className="animate-in fade-in zoom-in duration-300">
                  <svg ref={locSvgRef}></svg>
                </div>
              ) : (
                !locError && <Barcode size={80} className="text-gray-100 dark:text-gray-800" />
              )}
              {locError && (
                <div className="flex flex-col items-center gap-2 text-red-500 bg-red-50 px-6 py-4 rounded-xl font-bold text-xs text-center leading-tight">
                  <AlertCircle size={20}/> {locError}
                </div>
              )}
            </div>

            {locDownloadUrl && (
              <a href={locDownloadUrl} download={`loc_${locInput}.svg`} className="flex items-center justify-center gap-3 mt-8 p-5 bg-emerald-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20">
                <Download size={18} /> Descargar Vector SVG
              </a>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-16 p-8 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
          <div className="flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
              <AlertCircle className="text-blue-500" size={32} />
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-xs mb-2">Especificación CODE128</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Esta herramienta genera códigos de alta densidad que permiten caracteres alfanuméricos. 
                Los archivos SVG son vectoriales, ideales para impresión térmica sin pérdida de calidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BarcodeGenerator;