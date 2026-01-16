import React, { useState, useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import PageLayout from '../../components/PageLayout';
import SEO from '../../components/SEO';
import { Barcode, Download, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const BarcodeGenerator = () => {
  // Estados para Tarea
  const [taskInput, setTaskInput] = useState('');
  const [taskError, setTaskError] = useState('');
  const [taskDownloadUrl, setTaskDownloadUrl] = useState('');
  const taskSvgRef = useRef(null);

  // Estados para Ubicación
  const [locInput, setLocInput] = useState('');
  const [locError, setLocError] = useState('');
  const [locDownloadUrl, setLocDownloadUrl] = useState('');
  const locSvgRef = useRef(null);

  // Función genérica para generar la descarga
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
      if (parts.length !== 5) {
        throw new Error("Formato inválido. Usa: ***-**-**-**-**");
      }

      // Lógica de refactorización: AC6-OR-09-01-01 -> AC6_OR0901_01
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
    <PageLayout>
      <SEO title="Generador de Códigos de Barras" description="Herramienta logística para generar códigos de tarea y ubicación." />
      
      <div className="min-h-screen bg-gray-50 dark:bg-black py-12 px-4 transition-colors">
        <div className="max-w-5xl mx-auto">
          
          <Link to="/herramientas" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 font-bold transition-colors">
            <ArrowLeft size={20} /> Volver a Herramientas
          </Link>

          <header className="mb-12">
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
              Generador de <span className="text-blue-600">Barras</span>
            </h1>
          </header>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* SECCIÓN TAREA */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-black mb-6 dark:text-white uppercase tracking-tight">Código de Tarea</h2>
              <div className="space-y-4">
                <input 
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value.toUpperCase())}
                  placeholder="Ej: TAREA-123-XYZ"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none dark:text-white transition-all"
                />
                <button 
                  onClick={generateTask}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20"
                >
                  Generar Tarea
                </button>
              </div>

              <div className="mt-8 p-4 bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center min-h-[180px]">
                <svg ref={taskSvgRef} className={taskDownloadUrl ? 'block' : 'hidden'}></svg>
                {!taskDownloadUrl && !taskError && <Barcode size={48} className="text-gray-200" />}
                {taskError && <p className="text-red-500 text-sm flex items-center gap-2"><AlertCircle size={16}/> {taskError}</p>}
              </div>

              {taskDownloadUrl && (
                <a href={taskDownloadUrl} download="tarea.svg" className="flex items-center justify-center gap-2 mt-4 text-blue-600 font-bold hover:underline">
                  <Download size={18} /> Descargar SVG
                </a>
              )}
            </div>

            {/* SECCIÓN UBICACIÓN */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-black mb-6 dark:text-white uppercase tracking-tight text-green-600">Código de Ubicación</h2>
              <div className="space-y-4">
                <input 
                  type="text"
                  value={locInput}
                  onChange={(e) => setLocInput(e.target.value.toUpperCase())}
                  placeholder="AC6-OR-09-01-01"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-green-500 rounded-2xl outline-none dark:text-white transition-all"
                />
                <button 
                  onClick={generateLocation}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-green-500/20"
                >
                  Generar Ubicación
                </button>
              </div>

              <div className="mt-8 p-4 bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center min-h-[180px]">
                <svg ref={locSvgRef} className={locDownloadUrl ? 'block' : 'hidden'}></svg>
                {!locDownloadUrl && !locError && <Barcode size={48} className="text-gray-200" />}
                {locError && <p className="text-red-500 text-sm flex items-center gap-2 text-center"><AlertCircle size={16}/> {locError}</p>}
              </div>

              {locDownloadUrl && (
                <a href={locDownloadUrl} download="ubicacion.svg" className="flex items-center justify-center gap-2 mt-4 text-green-600 font-bold hover:underline">
                  <Download size={18} /> Descargar SVG
                </a>
              )}
            </div>

          </div>

          <footer className="mt-12 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              Desarrollado para optimización logística • Soporte interno anexo 5121
            </p>
          </footer>
        </div>
      </div>
    </PageLayout>
  );
};

export default BarcodeGenerator;