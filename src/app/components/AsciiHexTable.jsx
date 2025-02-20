"use client";
import { useState, useEffect } from "react";
import { useArray } from "../context/ArrayContext";

const ByteViewer = () => {
  const { items, updateItem } = useArray();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [asciiValue, setAsciiValue] = useState("");
  const [hexValue, setHexValue] = useState("");
  // Esta variable nos ayudará a saber cuál campo fue editado recientemente
  const [lastEdited, setLastEdited] = useState("");

  useEffect(() => {
    if (items[selectedIndex] !== undefined) {
      setAsciiValue(String.fromCharCode(items[selectedIndex]));
      setHexValue(
        items[selectedIndex].toString(16).toUpperCase().padStart(2, "0")
      );
    } else {
      setAsciiValue("");
      setHexValue("");
    }
    setLastEdited("");
  }, [selectedIndex, items]);

  const handleSelection = (index) => {
    setSelectedIndex(index);
  };

  const handleEdit = () => {
    let newByte;
    if (lastEdited === "ascii" && asciiValue.length === 1) {
      newByte = asciiValue.charCodeAt(0);
    } else if (lastEdited === "hex" && hexValue.match(/^[0-9A-Fa-f]{1,2}$/)) {
      newByte = parseInt(hexValue, 16);
    }
    if (newByte !== undefined) {
      updateItem(selectedIndex, newByte);
      setLastEdited("");
    }
  };

  // Calcula la cantidad de filas a mostrar (al menos 1)
  const rows = Math.max(1, Math.ceil(items.length / 10));

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-60 mx-auto text-white overflow-auto">
      <h2 className="text-center text-lg font-semibold mb-4">Visor de Bytes</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Tabla ASCII */}
        <div className="border p-2 rounded-md bg-gray-800 shadow">
          <h2 className="text-center text-lg font-semibold">ASCII</h2>
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
          </div>
          {/* Filas de datos */}
          {Array.from({ length: rows }, (_, row) => (
            <div key={row} className="grid grid-cols-11 gap-1 text-center">
              <div className="font-bold text-black bg-gray-200">{row * 10}</div>
              {Array.from({ length: 10 }, (_, col) => {
                const index = row * 10 + col;
                return (
                  <div
                    key={col}
                    className={`border p-1 cursor-pointer ${
                      selectedIndex === index ? "bg-blue-400 text-black" : ""
                    }`}
                    onClick={() => handleSelection(index)}
                  >
                    {items[index] !== undefined
                      ? String.fromCharCode(items[index])
                      : ""}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {/* Tabla Hexadecimal */}
        <div className="border p-2 rounded-md bg-gray-800 shadow">
          <h2 className="text-center text-lg font-semibold">HEX</h2>
          <div className="grid grid-cols-11 gap-1 text-center">
            {["#", ...Array.from({ length: 10 }, (_, i) => i)].map(
              (item, index) => (
                <div key={index} className="font-bold bg-gray-700 p-1">
                  {item}
                </div>
              )
            )}
          </div>
          {/* Filas de datos */}
          {Array.from({ length: rows }, (_, row) => (
            <div key={row} className="grid grid-cols-11 gap-1 text-center">
              <div className="font-bold bg-gray-700">{row * 10}</div>
              {Array.from({ length: 10 }, (_, col) => {
                const index = row * 10 + col;
                return (
                  <div
                    key={col}
                    className={`border p-1 cursor-pointer ${
                      selectedIndex === index ? "bg-blue-400 text-black" : ""
                    }`}
                    onClick={() => handleSelection(index)}
                  >
                    {items[index] !== undefined
                      ? items[index].toString(16).toUpperCase().padStart(2, "0")
                      : ""}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Fila de edición (posición, ASCII, Hex y botón) */}
      <div className="mt-4 flex justify-between items-center p-2 bg-gray-700 rounded shadow">
        <div>
          Posición:
          <input
            type="number"
            className="border px-2 w-20 mx-2 bg-gray-900 text-white"
            value={selectedIndex}
            onChange={(e) => handleSelection(Number(e.target.value))}
            min="0"
            max={items.length - 1}
          />
          / {items.length - 1}
        </div>
        <div>
          ASCII:
          <input
            type="text"
            className="border px-2 w-12 mx-2 bg-gray-900 text-white"
            value={asciiValue}
            onChange={(e) => {
              setAsciiValue(e.target.value);
              setLastEdited("ascii");
            }}
          />
        </div>
        <div>
          Hex:
          <input
            type="text"
            className="border px-2 w-12 mx-2 bg-gray-900 text-white"
            value={hexValue}
            onChange={(e) => {
              setHexValue(e.target.value);
              setLastEdited("hex");
            }}
          />
        </div>
        <button
          onClick={handleEdit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
        >
          Editar
        </button>
      </div>
    </div>
  );
};

export default ByteViewer;
