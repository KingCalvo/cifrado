"use client";

import { useState } from "react";
import crypto from "crypto"; // Asegúrate de tener este módulo instalado

function Hashing() {
  const initialMessage = "esto es un texto de prueba.".split(""); // Usamos este mensaje para el hash
  const [message, setMessage] = useState(initialMessage);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hash, setHash] = useState(""); // Nuevo estado para almacenar el hash

  const handleChange = (index, value, isHex) => {
    let updatedMessage = [...message];
    if (isHex) {
      const parsedValue = parseInt(value, 16);
      if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 255) {
        updatedMessage[index] = String.fromCharCode(parsedValue);
      }
    } else {
      if (value.length === 1) {
        updatedMessage[index] = value;
      }
    }//s
    setMessage(updatedMessage);
  };

  // Función para realizar el hash personalizado
  const customHash = (fileBuffer) => {
    // 1. Realizamos un hash SHA-256 inicial
    let hash = crypto.createHash('sha256');
    hash.update(fileBuffer);
    let result = hash.digest('hex');

    // 2. XOR con una clave fija para añadir entropía
    const key = 123456789; // clave arbitraria
    result = xorWithKey(result, key);

    // 3. División en bloques de 4 caracteres y permutación
    result = permuteBlocks(result, 4);

    // 4. Operación matemática (módulo 36) sobre los valores de los bytes
    result = applyModulo36(result);

    // 5. Codificación en base36 (solo caracteres 0-9 y a-z)
    result = result.toString('base36');

    // 6. Reducir el tamaño a 10 caracteres
    result = result.slice(0, 10);

    return result;
  };

  // Función XOR con una clave
  const xorWithKey = (input, key) => {
    let output = '';
    for (let i = 0; i < input.length; i++) {
      output += String.fromCharCode(input.charCodeAt(i) ^ (key & 0xFF));
    }
    return output;
  };

  // Función para permutar bloques
  const permuteBlocks = (input, blockSize) => {
    let output = '';
    for (let i = 0; i < input.length; i += blockSize) {
      let block = input.slice(i, i + blockSize);
      output = block + output; // Aquí se invierte el orden de los bloques
    }
    return output;
  };

  // Función para aplicar módulo 36 (reduce el rango a 0-9 y a-z)
  const applyModulo36 = (input) => {
    let output = '';
    for (let i = 0; i < input.length; i++) {
      output += (input.charCodeAt(i) % 36).toString(36);
    }
    return output;
  };

  // Función para calcular el hash y actualizar el estado
  const handleCalculateHash = () => {
    const fileBuffer = Buffer.from(message.join(''), 'utf-8'); // Usamos el `initialMessage` como base
    const calculatedHash = customHash(fileBuffer); // Calculamos el hash
    setHash(calculatedHash); // Actualizamos el estado del hash
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto text-white">
      <h2 className="text-center text-lg font-semibold mb-4">Visor de Bytes</h2>

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
            {message.map((char, i) => (
              <div
                key={i}
                className={`border p-1 text-center cursor-pointer ${selectedIndex === i ? "bg-blue-400 text-black" : ""}`}
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
            {message.map((char, i) => (
              <div
                key={i}
                className={`border p-1 text-center cursor-pointer ${selectedIndex === i ? "bg-blue-400 text-black" : ""}`}
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
            max={message.length - 1}
          />
          / {message.length - 1}
        </div>
        <div>
          ASCII:
          <input
            type="text"
            className="border px-2 w-12 mx-2 bg-gray-900 text-white"
            value={message[selectedIndex]}
            onChange={(e) => handleChange(selectedIndex, e.target.value, false)}
          />
        </div>
        <div>
          Hex:
          <input
            type="text"
            className="border px-2 w-12 mx-2 bg-gray-900 text-white"
            value={message[selectedIndex].charCodeAt(0).toString(16).toUpperCase()}
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
          onClick={handleCalculateHash} // Calculamos el hash cuando se hace clic
        >
          Calcular
        </button>
      </div>
    </div>
  );
}

export default Hashing;
