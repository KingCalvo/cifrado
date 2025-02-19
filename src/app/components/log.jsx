"use client";
import React from "react";

/**
 * Componente reutilizable de bitácora.
 *
 *  - logs: Array de strings, cada string es una línea o mensaje de log.
 *  - onClear: Función para limpiar el log.
 *
 * Ejemplo de uso:
 *   <LogViewer logs={arrayDeMensajes} onClear={() => setArrayDeMensajes([])} />
 */
const LogViewer = ({ logs = [], onClear }) => {
  return (
    <div className="flex flex-col w-full h-[500px] border border-gray-500 rounded-md p-2">
      <h2 className="text-center font-bold mb-2">Bitácora</h2>
      <div className="flex-1 overflow-y-auto bg-white text-black p-2 rounded">
        {logs.length > 0 ? (
          logs.map((line, index) => (
            <div key={index} className="mb-1">
              {line}
            </div>
          ))
        ) : (
          <div className="text-gray-500 italic">
            No hay mensajes en la bitácora
          </div>
        )}
      </div>
      <button
        onClick={onClear}
        className="mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded self-center"
      >
        Limpiar
      </button>
    </div>
  );
};

export default Log;
