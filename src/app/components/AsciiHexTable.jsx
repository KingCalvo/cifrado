"use client";

import { useState } from "react";

function AsciiHexTable() {
  const initialMessage = "esto es un texto de prueba.".split("");
  const [message, setMessage] = useState(initialMessage);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
    }
    setMessage(updatedMessage);
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
            {message.map((char, i) => (
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
            value={message[selectedIndex]
              .charCodeAt(0)
              .toString(16)
              .toUpperCase()}
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
    </div>
  );
}
export default AsciiHexTable;
