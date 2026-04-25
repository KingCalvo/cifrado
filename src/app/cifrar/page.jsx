"use client";
import React, { useState, useMemo } from "react";
import AsciiHexTable from "../components/AsciiHexTable";
import { useArray } from "../context/ArrayContext";
import { usePassword } from "../context/Password";
import { concatBuffers } from "../utils/crypto/buffer";
import { generateHMAC, encryptFile } from "../utils/crypto/crypto";
import { Eye, EyeOff } from "lucide-react";

const CifrarPage = () => {
  const { items, setArray, fileName, fileType } = useArray();
  const { password, updatePassword } = usePassword();

  const [localPassword, setLocalPassword] = useState(password);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Detectar si esta cifrado
  const isEncrypted = useMemo(() => {
    if (!items || items.length < 4) return false;

    try {
      const data = new Uint8Array(items);
      const magic = new TextDecoder().decode(data.slice(0, 4));
      return magic === "ECF1";
    } catch {
      return false;
    }
  }, [items]);

  const handleCifrar = async () => {
    if (passwordError || localPassword.length < 12) {
      return;
    }

    if (!items.length) {
      alert("No hay datos");
      return;
    }

    // bloqueo
    if (isEncrypted) {
      alert("Este archivo ya está cifrado");
      return;
    }

    setLoading(true);

    try {
      const data = new Uint8Array(items);

      const { encrypted, iv, salt } = await encryptFile(data, localPassword);

      const metadata = {
        name: fileName || "archivo",
        type: fileType || "application/octet-stream",
        size: data.length,
        timestamp: Date.now(),
      };

      const metaBytes = new TextEncoder().encode(JSON.stringify(metadata));

      const magic = new TextEncoder().encode("ECF1");
      const version = new Uint8Array([1]);

      const metaLength = new Uint8Array(2);
      metaLength[0] = metaBytes.length >> 8;
      metaLength[1] = metaBytes.length & 0xff;

      const coreData = concatBuffers(
        magic,
        version,
        metaLength,
        metaBytes,
        salt,
        iv,
        encrypted,
      );

      const hmac = await generateHMAC(coreData, localPassword, salt);

      const finalData = concatBuffers(coreData, hmac);

      setArray([...finalData]);
    } catch (err) {
      console.error(err);
      alert("Error al cifrar");
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = () => {
    if (!items.length) {
      alert("No hay datos para descargar");
      return;
    }

    if (!isEncrypted) {
      alert("Primero debes cifrar el archivo");
      return;
    }

    const safeName = fileName || "archivo";

    const outputName = safeName.startsWith("cifrado_")
      ? safeName
      : "cifrado_" + safeName;

    const blob = new Blob([new Uint8Array(items)], {
      type: "application/octet-stream",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = outputName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-20">
      <h1 className="text-center text-2xl font-bold mb-2">Cifrado</h1>

      {/* estado */}
      <div className="text-center mb-4">
        {isEncrypted ? (
          <span className="text-red-400 font-semibold">
            🔐 Archivo ya cifrado
          </span>
        ) : (
          <span className="text-green-400 font-semibold">
            📄 Archivo sin cifrar
          </span>
        )}
      </div>
      <h2 className="text-center text-base font-bold mb-2">
        Ingresa una contraseña para cifrar:
      </h2>
      {/* contraseña */}
      <div className="flex justify-center mb-4 items-center gap-2">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={localPassword}
            maxLength={64}
            onChange={(e) => {
              const value = e.target.value;

              setLocalPassword(value);
              updatePassword(value);

              if (value.length === 0) {
                setPasswordError("");
              } else if (value.length < 12) {
                setPasswordError("Mínimo 12 caracteres");
              } else if (value.length > 64) {
                setPasswordError("Máximo 64 caracteres");
              } else {
                setPasswordError("");
              }
            }}
            className="w-64 border px-3 py-1 pr-10 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {passwordError && (
            <p className="text-red-400 text-sm mt-1 text-center">
              {passwordError}
            </p>
          )}

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <AsciiHexTable />

      {/* botones */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={handleCifrar}
          disabled={
            loading || isEncrypted || passwordError || localPassword.length < 12
          }
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "Cifrando..." : "Cifrar"}
        </button>

        <button
          onClick={handleGuardar}
          disabled={!isEncrypted || loading}
          className={`font-bold py-2 px-4 rounded transition
    ${
      !isEncrypted || loading
        ? "bg-gray-500 cursor-not-allowed opacity-60"
        : "bg-blue-500 hover:bg-blue-700 text-white"
    }`}
        >
          Descargar Archivo
        </button>
      </div>
    </div>
  );
};

export default CifrarPage;
