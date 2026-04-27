"use client";
import React, { useState } from "react";
import AsciiHexTable from "../components/AsciiHexTable";
import { useArray } from "../context/ArrayContext";
import { hashSHA256 } from "../utils/crypto/crypto";

const HashClient = ({ dict }) => {
  const { items } = useArray();

  const [hash, setHash] = useState("");
  const [copied, setCopied] = useState(false);

  const handleHash = async () => {
    if (!items || items.length === 0) {
      alert(dict.hashPage.noData);
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
      console.error(dict.hashPage.copyError, err);
    }
  };

  return (
    <div className="mt-24">
      <div className="mb-4">
        <h1 className="text-center text-2xl font-semibold text-blue-400 mb-2">
          {dict.hashPage.title}
        </h1>
        <p className="text-center text-gray-400 text-sm mb-4">
          {dict.hashPage.description}
        </p>
      </div>

      {/* HASH UI */}
      <div className="w-full max-w-3xl mx-auto flex flex-wrap p-3 mt-4 mb-4 bg-[#0f172a] rounded shadow items-center gap-2">
        <span className="text-sm text-gray-400">
          {dict.hashPage.resultLabel}
        </span>

        <input
          type="text"
          className="border px-2 flex-1 bg-[#020617] text-white rounded"
          value={hash}
          readOnly
        />

        {/* Calcular */}
        <button
          onClick={handleHash}
          disabled={!items.length}
          className="bg-blue-500/20 border-blue-500 text-blue-400
          hover:bg-blue-600/10 hover:text-white font-bold py-1 px-4 rounded disabled:opacity-50"
        >
          {dict.hashPage.calculate}
        </button>

        {/* Copiar */}
        <button
          onClick={handleCopy}
          disabled={!hash}
          className={`font-bold py-1 px-4 rounded transition
            ${
              !hash
                ? "bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed"
                : copied
                  ? "bg-green-500/20 border-green-500 text-green-400"
                  : "bg-purple-500/20 border-purple-500 text-purple-400 hover:bg-purple-600/10 hover:text-white"
            }`}
        >
          {copied ? dict.hashPage.copied : dict.hashPage.copy}
        </button>
      </div>

      <AsciiHexTable />
    </div>
  );
};

export default HashClient;
