"use client";
import React, { useState } from "react";
import Bitacora from "../components/Bitacora";
import AsciiHexTable from "../components/AsciiHexTable";
import { useArray } from "../context/ArrayContext";

const Page = () => {
  const { items } = useArray();
  const [log, setLog] = useState("");
  const [hash, setHash] = useState("");

  // Función para rotar bits a la izquierda en un byte
  const rotateLeft = (byte, shift) =>
    ((byte << shift) | (byte >> (8 - shift))) & 0xff;

  // Función de hashing personalizada en 6 pasos
  const customHash = (byteArray) => {
    let logText = "";

    // Paso 1: Inicializar estado con 16 bytes fijos
    let state = Array.from({ length: 16 }, (_, i) => (i * 17 + 23) & 0xff);
    logText +=
      "1. Estado inicial: " +
      state.map((b) => b.toString(16).padStart(2, "0")).join(" ") +
      "\n\n";

    // Paso 2: Mezclar los bytes de entrada en el estado
    for (let i = 0; i < byteArray.length; i++) {
      state[i % 16] = (state[i % 16] + byteArray[i] + i) & 0xff;
    }
    logText +=
      "2. Estado tras mezclar bytes: " +
      state.map((b) => b.toString(16).padStart(2, "0")).join(" ") +
      "\n\n";

    // Paso 3: Aplicar XOR de cada elemento del estado con un patrón fijo
    const pattern = [0xa5, 0x5a, 0x3c, 0xc3, 0x7e, 0xe7, 0x1f, 0xf1];
    for (let i = 0; i < state.length; i++) {
      state[i] = state[i] ^ pattern[i % pattern.length];
    }
    logText +=
      "3. Estado tras XOR con patrón: " +
      state.map((b) => b.toString(16).padStart(2, "0")).join(" ") +
      "\n\n";

    // Paso 4: Rotar cada byte del estado a la izquierda
    // El número de bits de rotación se calcula como (state[0] + i) mod 8 para cada posición
    for (let i = 0; i < state.length; i++) {
      let shift = (state[0] + i) % 8;
      state[i] = rotateLeft(state[i], shift);
    }
    logText +=
      "4. Estado tras rotaciones: " +
      state.map((b) => b.toString(16).padStart(2, "0")).join(" ") +
      "\n\n";

    // Paso 5: Sumar a cada byte del estado su índice multiplicado por 17 (operación indexada)
    for (let i = 0; i < state.length; i++) {
      state[i] = (state[i] + i * 17) & 0xff;
    }
    logText +=
      "5. Estado tras suma indexada: " +
      state.map((b) => b.toString(16).padStart(2, "0")).join(" ") +
      "\n\n";

    // Paso 6: Combinar el estado en un acumulador usando multiplicación modular
    // Se usa un módulo grande (primo cercano a 2^32) para asegurar alta sensibilidad
    let accumulator = 1;
    const MOD = 4294967291;
    for (let i = 0; i < state.length; i++) {
      accumulator = (accumulator * (state[i] + 1)) % MOD;
    }
    // Convertir el acumulador a base36 (números y letras minúsculas) y rellenar a 10 caracteres
    let finalHash = accumulator.toString(36).padStart(10, "0");
    logText +=
      "6. Acumulador final y hash: " + accumulator + " -> " + finalHash + "\n";

    return { hash: finalHash, log: logText };
  };

  // Función para calcular el hash usando los bytes cargados
  const handleCalculateHash = () => {
    if (items.length === 0) {
      setLog("No hay datos para calcular el hash.");
      return;
    }

    // Convertir el arreglo de bytes a un array normal (ya son números 0-255)
    const byteArray = items;
    const { hash: calculatedHash, log: logText } = customHash(byteArray);
    setHash(calculatedHash);
    setLog(logText);
  };

  return (
    <div className="mt-20">
      <div className="mb-4">
        <h1 className="text-center text-2xl font-bold">Hash</h1>
      </div>
      {/* Visualización de bytes */}
      <AsciiHexTable />
      {/* Sección de cálculo de hash */}
      <div className="w-full max-w-3xl max-h-60 mx-auto flex p-2 mt-4 bg-gray-700 rounded shadow">
        <div className="flex items-center gap-x-2 flex-1">
          Hash:
          <input
            type="text"
            className="border px-2 w-12 flex-1 mx-2 bg-gray-900 text-white rounded"
            value={hash}
            readOnly
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
          onClick={handleCalculateHash}
        >
          Calcular
        </button>
      </div>
      {/* Bitácora para mostrar los pasos */}
      <div className="mt-6 p-4 bg-gray-800 rounded text-sm">
        <Bitacora resultText={log} />
      </div>
    </div>
  );
};

export default Page;
