"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useArray } from "../context/ArrayContext";

const ByteViewer = () => {
  const { items, setArray } = useArray();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [asciiValue, setAsciiValue] = useState("");
  const [hexValue, setHexValue] = useState("");
  const [lastEdited, setLastEdited] = useState("");
  const [modifiedIndex, setModifiedIndex] = useState(null);
  const [view, setView] = useState("ascii");

  const containerRef = useRef(null);

  // detectar móvil
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const COLS = isMobile ? 5 : 10;

  // Limite
  const MAX_BYTES = 5000;

  // ventana dinámica
  const [start, setStart] = useState(0);
  const WINDOW_SIZE = 1000;

  const visibleItems = useMemo(() => {
    return items.slice(start, start + WINDOW_SIZE);
  }, [items, start]);

  const rows = Math.ceil(visibleItems.length / COLS);

  // sync selección
  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex < items.length) {
      const byte = items[selectedIndex];

      setAsciiValue(
        byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : "·",
      );

      setHexValue(byte.toString(16).toUpperCase().padStart(2, "0"));
    } else {
      setAsciiValue("");
      setHexValue("");
    }

    setLastEdited("");
  }, [selectedIndex, items]);

  // scroll dinámico
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const scrollRatio = el.scrollTop / el.scrollHeight;

    const newStart = Math.floor(
      scrollRatio * Math.max(0, items.length - WINDOW_SIZE),
    );

    setStart(newStart);
  };

  const handleSelection = (index) => {
    if (index >= 0 && index < items.length) {
      setSelectedIndex(index);
    }
  };

  const handleEdit = () => {
    let newByte;

    if (
      lastEdited === "ascii" &&
      asciiValue.length === 1 &&
      asciiValue !== "·"
    ) {
      newByte = asciiValue.charCodeAt(0);
    }

    if (lastEdited === "hex" && /^[0-9A-Fa-f]{1,2}$/.test(hexValue)) {
      newByte = parseInt(hexValue, 16);
    }

    if (newByte !== undefined) {
      const newArray = new Uint8Array(items);
      newArray[selectedIndex] = newByte;
      setArray(newArray);
      setModifiedIndex(selectedIndex);
    }
  };

  const renderTable = (mode) => (
    <>
      {/* header */}
      <div className="sticky top-0 bg-gray-800 z-10">
        <div className="text-center font-bold py-1 border-b border-gray-700">
          {mode === "ascii" ? "ASCII" : "HEX"}
        </div>

        <div
          className="grid text-center text-xs font-bold"
          style={{ gridTemplateColumns: `70px repeat(${COLS}, 1fr)` }}
        >
          {["#", ...Array.from({ length: COLS }, (_, i) => i)].map(
            (item, i) => (
              <div key={i} className="p-1 border-b border-gray-700">
                {item}
              </div>
            ),
          )}
        </div>
      </div>

      {/* body */}
      {Array.from({ length: rows }, (_, row) => (
        <div
          key={row}
          className="grid text-center text-xs"
          style={{ gridTemplateColumns: `70px repeat(${COLS}, 1fr)` }}
        >
          <div className="bg-gray-800 p-1 font-bold">{start + row * COLS}</div>

          {Array.from({ length: COLS }, (_, col) => {
            const localIndex = row * COLS + col;
            const realIndex = start + localIndex;

            return (
              <div
                key={col}
                onClick={() => handleSelection(realIndex)}
                className={`p-1 cursor-pointer
                  ${selectedIndex === realIndex ? "bg-blue-500 text-black" : ""}
                  ${modifiedIndex === realIndex ? "bg-yellow-400 text-black" : ""}
                  hover:bg-gray-600`}
              >
                {visibleItems[localIndex] !== undefined
                  ? mode === "ascii"
                    ? visibleItems[localIndex] >= 32 &&
                      visibleItems[localIndex] <= 126
                      ? String.fromCharCode(visibleItems[localIndex])
                      : "·"
                    : visibleItems[localIndex]
                        .toString(16)
                        .toUpperCase()
                        .padStart(2, "0")
                  : ""}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );

  return (
    <div className="w-full h-[65vh] flex flex-col bg-gray-900 text-white rounded-lg shadow-lg">
      {/* header */}
      <div className="p-3 border-b border-gray-700 text-center font-bold">
        Visor de Bytes
      </div>

      {/* Tabs movil */}
      <div className="md:hidden flex justify-center gap-2 p-2">
        <button
          onClick={() => setView("ascii")}
          className={`px-3 py-1 rounded ${
            view === "ascii" ? "bg-blue-500" : "bg-gray-700"
          }`}
        >
          ASCII
        </button>

        <button
          onClick={() => setView("hex")}
          className={`px-3 py-1 rounded ${
            view === "hex" ? "bg-blue-500" : "bg-gray-700"
          }`}
        >
          HEX
        </button>
      </div>

      {/* tablas */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex flex-1 overflow-auto"
      >
        {/* Desktop */}
        <div className="hidden md:flex w-full">
          <div className="flex-1 border-r border-gray-700">
            {renderTable("ascii")}
          </div>

          <div className="flex-1">{renderTable("hex")}</div>
        </div>

        {/* movil */}
        <div className="md:hidden w-full">{renderTable(view)}</div>
      </div>

      {/* editor */}
      <div className="sticky bottom-0 bg-gray-800 p-3 border-t border-gray-700 flex flex-wrap gap-3 items-center justify-center text-sm">
        <input
          type="number"
          className="w-20 px-2 bg-gray-900 border"
          value={selectedIndex}
          onChange={(e) => handleSelection(Number(e.target.value))}
        />

        <input
          maxLength={1}
          className="w-10 px-2 bg-gray-900 border"
          value={asciiValue}
          onChange={(e) => {
            setAsciiValue(e.target.value);
            setLastEdited("ascii");
          }}
        />

        <input
          maxLength={2}
          className="w-12 px-2 bg-gray-900 border"
          value={hexValue}
          onChange={(e) => {
            setHexValue(e.target.value.toUpperCase());
            setLastEdited("hex");
          }}
        />

        <button onClick={handleEdit} className="bg-blue-500 px-3 py-1 rounded">
          Guardar
        </button>
      </div>
    </div>
  );
};

export default ByteViewer;
