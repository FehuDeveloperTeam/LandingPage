import React, { useState, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import PageLayout from '../../components/PageLayout';
import SEO from '../../components/SEO';
import { Barcode, Download, AlertCircle, ArrowLeft } from 'lucide-react';
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
        width: 2,
        height: 80,
        displayValue: true
      });
      prepareDownload(taskSvgRef.current, setTaskDownloadUrl);
    } catch (e) {
      setTaskError('Datos inválidos para CODE128');
    }
  };

  const generateLocation = () => {
    setLocError('');
    const input = locInput.trim();
    if (!input) return;
    try {
      const parts = input.split('-');
      if (parts.length !== 5) throw new Error("Formato inválido. Usa: ***-**-**-**-**");
      const refactored = `${parts[0]}_${parts[1]}${parts[2]}${parts[3]}_${parts[4]}`;
      JsBarcode(locSvgRef.current, refactored, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 80,
        displayValue: true
      });
      prepareDownload(locSvgRef.current, setLocDownloadUrl);
    } catch (e) {
      setLocError(e.message);
    }
  };

  return (
    <PageLayout 
      titulo="Generador de Barras" 
      subtitulo="Herramienta logística para la creación de códigos CODE128 de tarea y ubicación."
      icono={<Barcode className="w-8 h-8" />}
    >
      <SEO title="Generador de Códigos de Barras | Fehu Developers" description="Herramienta logística para generar códigos de tarea y ubicación." />
      
      <div className="max-w-5xl mx-auto">
        {/* Botón Volver */}
        <Link 
          to="/herramientas" 
          className="inline-flex items-center gap-2 px-4 py-2 mb-12 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-bold">Volver a Herramientas</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* SECCIÓN TAREA */}
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white/20 dark:border-white/10">
            <h2 className="text-xl font-black mb-6 dark:text-white uppercase tracking-tight flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              Código de Tarea
            </h2>
            <div className="space-y-4">
              <input 
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value.toUpperCase())}
                placeholder="Ej: TAREA-123-XYZ"
                className="w-full px-5 py-4 bg-gray-50/50 dark:bg-black/20 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none dark:text-white transition-all"
              />
              <button 
                onClick={generateTask}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                Generar Tarea
              </button>
            </div>

            <div className="mt-8 p-6 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center min-h-[200px]">
              <svg ref={taskSvgRef} className={taskDownloadUrl ? 'block' : 'hidden'}></svg>
              {!taskDownloadUrl && !taskError && <Barcode size={64} className="text-gray-200" />}
              {taskError && <p className="text-red-500 text-sm flex items-center gap-2 font-medium"><AlertCircle size={18}/> {taskError}</p>}
            </div>

            {taskDownloadUrl && (
              <a href={taskDownloadUrl} download="tarea.svg" className="flex items-center justify-center gap-2 mt-6 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                <Download size={18} /> Descargar SVG
              </a>
            )}
          </div>

          {/* SECCIÓN UBICACIÓN */}
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white/20 dark:border-white/10">
            <h2 className="text-xl font-black mb-6 dark:text-white uppercase tracking-tight flex items-center gap-2">
              <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
              Código de Ubicación
            </h2>
            <div className="space-y-4">
              <input 
                type="text"
                value={locInput}
                onChange={(e) => setLocInput(e.target.value.toUpperCase())}
                placeholder="AC6-OR-09-01-01"
                className="w-full px-5 py-4 bg-gray-50/50 dark:bg-black/20 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none dark:text-white transition-all"
              />
              <button 
                onClick={generateLocation}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Generar Ubicación
              </button>
            </div>

            <div className="mt-8 p-6 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center min-h-[200px]">
              <svg ref={locSvgRef} className={locDownloadUrl ? 'block' : 'hidden'}></svg>
              {!locDownloadUrl && !locError && <Barcode size={64} className="text-gray-200" />}
              {locError && <p className="text-red-500 text-sm flex items-center gap-2 text-center font-medium"><AlertCircle size={18}/> {locError}</p>}
            </div>

            {locDownloadUrl && (
              <a href={locDownloadUrl} download="ubicacion.svg" className="flex items-center justify-center gap-2 mt-6 p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold hover:bg-emerald-100 transition-colors">
                <Download size={18} /> Descargar SVG
              </a>
            )}
          </div>
        </div>

        <footer className="mt-16 text-center border-t border-gray-200 dark:border-white/10 pt-8">
          <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">
            Herramienta de optimización logística • Soporte interno anexo 5121
          </p>
        </footer>
      </div>
    </PageLayout>
  );
};

export default BarcodeGenerator;