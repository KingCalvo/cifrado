"use client";

import { useState, useEffect } from "react";
import { useArray } from "../context/ArrayContext";
import crypto from "crypto";

const Hashing = ({ setLog }) => {
  const { items } = useArray();

  // Inicializamos localMessage a partir de los bytes cargados en el contexto
  const [localMessage, setLocalMessage] = useState(
    items.map((byte) => String.fromCharCode(byte))
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hash, setHash] = useState("");

  // Actualizamos localMessage si cambian los bytes
  useEffect(() => {
    setLocalMessage(items.map((byte) => String.fromCharCode(byte)));
  }, [items]);

  const handleChange = (index, value, isHex) => {
    let updatedMessage = [...localMessage];
    if (isHex) {
      const parsedValue = parseInt(value, 16);
      if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 255) {
        updatedMessage[index] = String.fromCharCode(parsedValue);
      }
    } else {
      if (value.length === 1) {
        updatedMessage[index] = value;
      }
    }
    setLocalMessage(updatedMessage);
  };

  // Función XOR con una clave
  const xorWithKey = (input, key) => {
    let output = "";
    for (let i = 0; i < input.length; i++) {
      output += String.fromCharCode(input.charCodeAt(i) ^ (key & 0xff));
    }
    return output;
  };

  // Función para permutar bloques
  const permuteBlocks = (input, blockSize) => {
    let output = "";
    for (let i = 0; i < input.length; i += blockSize) {
      let block = input.slice(i, i + blockSize);
      output = block + output; // Invierte el orden de los bloques
    }
    return output;
  };

  // Función para aplicar módulo 36 (reduce el rango a 0-9 y a-z)
  const applyModulo36 = (input) => {
    let output = "";
    for (let i = 0; i < input.length; i++) {
      output += (input.charCodeAt(i) % 36).toString(36);
    }
    return output;
  };

  // Función personalizada de hash que utiliza los bytes cargados y acumula log
  const customHash = (buffer) => {
    let logText = "";
    // 1. Realizamos un hash SHA-256 inicial
    let hashObj = crypto.createHash("sha256");
    hashObj.update(buffer);
    let result = hashObj.digest("hex");
    logText += `1. SHA-256: ${result}\n`;

    // 2. XOR con una clave fija para añadir entropía
    const key = 123456789;
    result = xorWithKey(result, key);
    logText += `2. XOR con clave (${key}): ${result}\n`;

    // 3. División en bloques de 4 caracteres y permutación
    result = permuteBlocks(result, 4);
    logText += `3. Permutación en bloques de 4: ${result}\n`;

    // 4. Operación matemática (módulo 36)
    result = applyModulo36(result);
    logText += `4. Módulo 36 aplicado: ${result}\n`;

    // 5. Reducir el tamaño a 10 caracteres (ya está en base36)
    result = result.slice(0, 10);
    logText += `5. Resultado final (10 caracteres): ${result}\n`;

    return { hash: result, log: logText };
  };

  // Función para calcular el hash usando los bytes del archivo
  const handleCalculateHash = () => {
    // Convertir el arreglo de bytes (items) a un Buffer
    const buffer = Buffer.from(items);
    const { hash: calculatedHash, log: logText } = customHash(buffer);
    setHash(calculatedHash);
    if (setLog) {
      setLog(logText);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto text-white">
      <h2 className="text-center text-lg font-semibold mb-4">Hashing</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Tabla ASCII */}
        <div className="border p-2 rounded-md bg-gray-800 shadow">
          <div className="grid grid-cols-11 gap-1 text-center">
            {["#", ...Array.from({ length: 10 }, (_, i) => i)].map(
              (item, index) => (
                <div
                  key={index}
                  className="font-bold text-black bg-gray-200 p-1"
                >
                  {item}
                </div>
              )
            )}
            {localMessage.map((char, i) => (
              <div
                key={i}
                className={`border p-1 text-center cursor-pointer ${
                  selectedIndex === i ? "bg-blue-400 text-black" : ""
                }`}
                onClick={() => setSelectedIndex(i)}
              >
                {char}
              </div>
            ))}
          </div>
        </div>
        {/* Tabla Hexadecimal */}
        <div className="border p-2 rounded-md bg-gray-800 shadow">
          <div className="grid grid-cols-11 gap-1 text-center">
            {["#", ...Array.from({ length: 10 }, (_, i) => i)].map(
              (item, index) => (
                <div key={index} className="font-bold bg-gray-700 p-1">
                  {item}
                </div>
              )
            )}
            {localMessage.map((char, i) => (
              <div
                key={i}
                className={`border p-1 text-center cursor-pointer ${
                  selectedIndex === i ? "bg-blue-400 text-black" : ""
                }`}
                onClick={() => setSelectedIndex(i)}
              >
                {char.charCodeAt(0).toString(16).toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edición */}
      <div className="mt-4 flex justify-between items-center p-2 bg-gray-700 rounded shadow">
        <div>
          Posición:
          <input
            type="number"
            className="border px-2 w-12 mx-2 bg-gray-900 text-white"
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
            min="0"
            max={localMessage.length - 1}
          />
          / {localMessage.length - 1}
        </div>
        <div>
          ASCII:
          <input
            type="text"
            className="border px-2 w-12 mx-2 bg-gray-900 text-white"
            value={localMessage[selectedIndex]}
            onChange={(e) => handleChange(selectedIndex, e.target.value, false)}
          />
        </div>
        <div>
          Hex:
          <input
            type="text"
            className="border px-2 w-12 mx-2 bg-gray-900 text-white"
            value={
              localMessage[selectedIndex]
                ? localMessage[selectedIndex]
                    .charCodeAt(0)
                    .toString(16)
                    .toUpperCase()
                : ""
            }
            onChange={(e) => handleChange(selectedIndex, e.target.value, true)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
          onClick={() => alert("Valor editado en la posición " + selectedIndex)}
        >
          Editar
        </button>
      </div>

      {/* Hash */}
      <div className="mt-4 flex justify-between items-center p-2 bg-gray-700 rounded shadow">
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
    </div>
  );
};

export default Hashing;
