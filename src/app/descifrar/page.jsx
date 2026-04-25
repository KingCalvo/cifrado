"use client";
import React, { useState, useMemo } from "react";
import AsciiHexTable from "../components/AsciiHexTable";
import { useArray } from "../context/ArrayContext";
import { usePassword } from "../context/Password";
import { verifyHMAC, decryptFile } from "../utils/crypto/crypto";
import { Eye, EyeOff } from "lucide-react";

const DescifrarPage = () => {
  const { items, setArray, fileName, fileType, setFileName, setFileType } =
    useArray();

  const { password, updatePassword } = usePassword();

  const [localPassword, setLocalPassword] = useState(password);
  const [loading, setLoading] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Detectar cifrado
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

  const handleDecrypt = async () => {
    if (passwordError || localPassword.length < 12) return;

    if (!items.length) {
      alert("No hay datos");
      return;
    }

    if (!isEncrypted) {
      alert("El archivo no está cifrado");
      return;
    }

    setLoading(true);

    try {
      const data = new Uint8Array(items);

      const hmac = data.slice(data.length - 32);
      const coreData = data.slice(0, data.length - 32);

      const metaLength = (coreData[5] << 8) | coreData[6];
      const metaStart = 7;
      const metaEnd = metaStart + metaLength;

      const metadata = JSON.parse(
        new TextDecoder().decode(coreData.slice(metaStart, metaEnd)),
      );

      const offset = metaEnd;

      const salt = coreData.slice(offset, offset + 16);
      const iv = coreData.slice(offset + 16, offset + 28);
      const encrypted = coreData.slice(offset + 28);

      const isValid = await verifyHMAC(coreData, localPassword, salt, hmac);

      if (!isValid) {
        throw new Error("Archivo modificado o contraseña incorrecta");
      }

      const decrypted = await decryptFile(encrypted, localPassword, iv, salt);

      setArray([...decrypted]);
      setFileName(metadata.name);
      setFileType(metadata.type);

      setIsDecrypted(true);
    } catch (err) {
      console.error(err);
      alert("Archivo corrupto o contraseña incorrecta");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!items.length) {
      alert("No hay datos");
      return;
    }

    // bloqueo
    if (!isDecrypted) {
      alert("Primero debes descifrar el archivo");
      return;
    }

    const name = fileName || "archivo";
    const type = fileType || "application/octet-stream";

    const cleanName = name.replace(/^cifrado_/, "");

    const outputName = "descifrado_" + cleanName;

    const blob = new Blob([new Uint8Array(items)], { type });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = outputName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-20">
      <h1 className="text-center text-2xl font-bold mb-2">Descifrado</h1>

      {/* estado */}
      <div className="text-center mb-4">
        {isEncrypted ? (
          <span className="text-red-400 font-semibold">🔐 Archivo cifrado</span>
        ) : isDecrypted ? (
          <span className="text-blue-400 font-semibold">
            🔓 Archivo descifrado
          </span>
        ) : (
          <span className="text-green-400 font-semibold">
            📄 Archivo sin cifrar
          </span>
        )}
      </div>
      <h2 className="text-center text-base font-bold mb-2">
        Ingresa una contraseña para descifrar:
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
          onClick={handleDecrypt}
          disabled={
            loading ||
            !isEncrypted ||
            passwordError ||
            localPassword.length < 12
          }
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "Descifrando..." : "Descifrar"}
        </button>

        <button
          onClick={handleDownload}
          disabled={!isDecrypted || loading}
          className={`font-bold py-2 px-4 rounded transition
    ${
      !isDecrypted || loading
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

export default DescifrarPage;
