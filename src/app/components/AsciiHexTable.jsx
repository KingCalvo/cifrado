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
  const [indexInput, setIndexInput] = useState("");
  const [isEditingIndex, setIsEditingIndex] = useState(false);
  const containerRef = useRef(null);

  // detectar móvil
  const [cols, setCols] = useState(10);

  useEffect(() => {
    const updateCols = () => {
      setCols(window.innerWidth < 768 ? 5 : 10);
    };

    updateCols();
    window.addEventListener("resize", updateCols);

    return () => window.removeEventListener("resize", updateCols);
  }, []);

  const COLS = cols;

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

  useEffect(() => {
    if (!isEditingIndex) {
      setIndexInput(String(selectedIndex));
    }
  }, [selectedIndex, isEditingIndex]);

  useEffect(() => {
    if (items.length === 0) return;

    let newStart = selectedIndex - Math.floor(WINDOW_SIZE / 2);

    if (newStart < 0) newStart = 0;
    if (newStart > items.length - WINDOW_SIZE) {
      newStart = Math.max(0, items.length - WINDOW_SIZE);
    }

    setStart(newStart);
  }, [selectedIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const firstCell = el.querySelector("[data-index]");
    if (!firstCell) return;

    const rowEl = firstCell.parentElement;
    if (!rowEl) return;

    const rowHeight = rowEl.getBoundingClientRect().height;

    const indexInView = selectedIndex - start;
    if (indexInView < 0) return;

    const row = Math.floor(indexInView / COLS);

    el.scrollTop = row * rowHeight;
  }, [start, selectedIndex, COLS]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT") return;

      if (e.key === "ArrowRight") {
        setSelectedIndex((i) => Math.min(i + 1, items.length - 1));
      }

      if (e.key === "ArrowLeft") {
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }

      if (e.key === "ArrowDown") {
        setSelectedIndex((i) => Math.min(i + COLS, items.length - 1));
      }

      if (e.key === "ArrowUp") {
        setSelectedIndex((i) => Math.max(i - COLS, 0));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [items.length, COLS]);

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

  const corruptByte = () => {
    if (!items.length) return;

    const newArray = new Uint8Array(items);
    newArray[selectedIndex] = Math.floor(Math.random() * 256);

    setArray(newArray);
    setModifiedIndex(selectedIndex);
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
                data-index={realIndex}
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
      <div ref={containerRef} className="flex-1 overflow-auto">
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
      <div className="sticky bottom-0 bg-[#0f172a] p-3 border-t border-gray-700 flex flex-wrap gap-4 items-center justify-center text-sm">
        {/* Posición */}
        <div className="flex items-center gap-2 text-gray-400">
          <span>Posición:</span>
          <input
            type="number"
            inputMode="numeric"
            className="w-24 px-2 py-1 bg-[#020617] border border-gray-600 rounded text-center focus:border-blue-500 focus:outline-none"
            value={indexInput}
            placeholder="0"
            onFocus={() => {
              setIsEditingIndex(true);
              setIndexInput("");
            }}
            onChange={(e) => {
              const value = e.target.value;

              if (/^\d*$/.test(value)) {
                setIndexInput(value);
              }
            }}
            onBlur={() => {
              setIsEditingIndex(false);

              if (indexInput === "") {
                setIndexInput(String(selectedIndex));
                return;
              }

              let num = parseInt(indexInput, 10);

              if (isNaN(num)) {
                setIndexInput(String(selectedIndex));
                return;
              }

              if (num < 0) num = 0;
              if (num > items.length - 1) num = items.length - 1;

              handleSelection(num);
              setIndexInput(String(num));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
          />
          <span>/ {items.length - 1}</span>

          {/* Reset */}
          <button
            onClick={() => setSelectedIndex(0)}
            className="px-4 py-1 rounded-lg border transition-all
          bg-gray-800 border-gray-600 text-gray-400
          hover:bg-gray-700 hover:text-white
          active:scale-95"
          >
            Inicio
          </button>
        </div>

        {/* ASCII */}
        <div className="flex items-center gap-2 text-gray-400">
          <span>ASCII:</span>
          <input
            maxLength={1}
            className="w-12 px-2 py-1 bg-[#020617] border border-gray-600 rounded text-center focus:border-blue-500 focus:outline-none"
            value={asciiValue}
            onChange={(e) => {
              setAsciiValue(e.target.value);
              setLastEdited("ascii");
            }}
          />
        </div>

        {/* HEX */}
        <div className="flex items-center gap-2 text-gray-400">
          <span>HEX:</span>
          <input
            maxLength={2}
            className="w-12 px-2 py-1 bg-[#020617] border border-gray-600 rounded text-center focus:border-blue-500 focus:outline-none"
            value={hexValue}
            onChange={(e) => {
              setHexValue(e.target.value.toUpperCase());
              setLastEdited("hex");
            }}
          />
        </div>

        {/* Guardar */}
        <button
          onClick={handleEdit}
          className="px-4 py-1 rounded-lg border transition-all
    bg-blue-500/20 border-blue-500 text-blue-400
    hover:bg-blue-600/10 hover:text-white
    active:scale-95"
        >
          Guardar
        </button>

        {/* Corromper */}
        <button
          onClick={corruptByte}
          className="px-4 py-1 rounded-lg border transition-all
          bg-red-500/20 border-red-500 text-red-400
          hover:bg-red-600/10 hover:text-white
          active:scale-95"
        >
          Corromper 1 byte
        </button>
      </div>
    </div>
  );
};

export default ByteViewer;
