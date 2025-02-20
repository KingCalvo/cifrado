"use client";
import React, { useState } from "react";
import Bitacora from "../components/Bitacora";
import Hashing from "../components/Hashing";

const Page = () => {
  const [log, setLog] = useState("");
  return (
    <div className="mt-20">
      <div className="mb-4">
        <h1 className="text-center text-2xl font-bold">Hash</h1>
      </div>
      {/* Componente Hash */}
      <div className="flex justify-center mt-4 space-x-4">
        <Hashing setLog={setLog} />
      </div>
      {/* Mostrar la bitácora */}
      <div className="mt-6 p-4 bg-gray-800 rounded text-sm">
        <Bitacora resultText={log} />
      </div>
    </div>
  );
};

export default Page;
