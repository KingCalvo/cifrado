"use client";
import React, { useState } from "react";
import AsciiHexTable from "../components/AsciiHexTable";
import { useArray } from "../context/ArrayContext";
import { hashSHA256 } from "../utils/crypto/crypto";

const Page = () => {
  const { items } = useArray();

  const [hash, setHash] = useState("");
  const [copied, setCopied] = useState(false);

  const handleHash = async () => {
    if (!items || items.length === 0) {
      alert("No hay datos para calcular el hash");
      return;
    }

    const data = new Uint8Array(items);
    const result = await hashSHA256(data);

    setHash(result);
    setCopied(false); // reset estado copy
  };

  const handleCopy = async () => {
    if (!hash) return;

    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);

      // reset después de 2s
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  return (
    <div className="mt-20">
      <div className="mb-4">
        <h1 className="text-center text-2xl font-bold">Hash (SHA-256)</h1>
      </div>

      <AsciiHexTable />

      {/* HASH UI */}
      <div className="w-full max-w-3xl mx-auto flex flex-wrap p-3 mt-4 bg-gray-700 rounded shadow items-center gap-2">
        <span className="text-white">Hash:</span>

        <input
          type="text"
          className="border px-2 flex-1 bg-gray-900 text-white rounded"
          value={hash}
          readOnly
        />

        {/* Calcular */}
        <button
          onClick={handleHash}
          disabled={!items.length}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded disabled:opacity-50"
        >
          Calcular
        </button>

        {/* Copiar */}
        <button
          onClick={handleCopy}
          disabled={!hash}
          className={`font-bold py-1 px-4 rounded transition
            ${
              !hash
                ? "bg-gray-500 cursor-not-allowed"
                : copied
                  ? "bg-green-500"
                  : "bg-purple-500 hover:bg-purple-700 text-white"
            }`}
        >
          {copied ? "Copiado ✓" : "Copiar"}
        </button>
      </div>
    </div>
  );
};

export default Page;
