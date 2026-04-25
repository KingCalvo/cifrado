"use client";
import React, { useState } from "react";
import AsciiHexTable from "../components/AsciiHexTable";
import { useArray } from "../context/ArrayContext";
import { hashSHA256 } from "../utils/crypto/crypto";

const Page = () => {
  const { items } = useArray();
  const [hash, setHash] = useState("");

  const handleHash = async () => {
    if (!items || items.length === 0) {
      alert("No hay datos para calcular el hash");
      return;
    }

    const data = new Uint8Array(items);
    const result = await hashSHA256(data);
    setHash(result);
  };

  return (
    <div className="mt-20">
      <div className="mb-4">
        <h1 className="text-center text-2xl font-bold">Hash (SHA-256)</h1>
      </div>

      {/* Visualización de bytes */}
      <AsciiHexTable />

      {/* Sección de cálculo de hash */}
      <div className="w-full max-w-3xl mx-auto flex p-3 mt-4 bg-gray-700 rounded shadow items-center gap-2">
        <span className="text-white">Hash:</span>

        <input
          type="text"
          className="border px-2 flex-1 bg-gray-900 text-white rounded"
          value={hash}
          readOnly
        />

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
          onClick={handleHash}
        >
          Calcular
        </button>
      </div>
    </div>
  );
};

export default Page;
