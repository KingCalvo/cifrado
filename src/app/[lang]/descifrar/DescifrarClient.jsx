"use client";
import React, { useState, useMemo, useEffect } from "react";
import AsciiHexTable from "../components/AsciiHexTable";
import { useArray } from "../context/ArrayContext";
import { usePassword } from "../context/Password";
import { verifyHMAC, decryptFile } from "../utils/crypto/crypto";
import { Eye, EyeOff } from "lucide-react";

const DescifrarPage = ({ dict }) => {
  const { items, setArray, fileName, fileType, setFileName, setFileType } =
    useArray();

  const { password, updatePassword } = usePassword();

  const [localPassword, setLocalPassword] = useState(password);
  const [loading, setLoading] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

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
      alert(dict.decryptPage.noData);
      return;
    }

    if (!isEncrypted) {
      alert(dict.decryptPage.notEncrypted);
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
        throw new Error(dict.decryptPage.invalidFile);
      }

      const decrypted = await decryptFile(encrypted, localPassword, iv, salt);

      setArray([...decrypted]);
      setFileName(metadata.name);
      setFileType(metadata.type);

      setIsDecrypted(true);
    } catch (err) {
      console.error(err);
      alert(dict.decryptPage.invalidFile);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!items.length) {
      alert(dict.decryptPage.noData);
      return;
    }

    // bloqueo
    if (!isDecrypted) {
      alert(dict.decryptPage.mustDecrypt);
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
      <h1 className="text-center text-2xl font-semibold text-blue-400 mb-2">
        {dict.decryptPage.title}
      </h1>
      <p className="text-center text-gray-400 text-sm mb-4">
        {dict.decryptPage.description}
      </p>

      {/* estado */}
      <div className="text-center mb-4">
        {isEncrypted ? (
          <span className="text-red-400 font-semibold">
            {" "}
            {dict.decryptPage.statusEncrypted}
          </span>
        ) : isDecrypted ? (
          <span className="text-blue-400 font-semibold">
            {dict.decryptPage.statusDecrypted}
          </span>
        ) : (
          <span className="text-green-400 font-semibold">
            {dict.decryptPage.statusNotEncrypted}
          </span>
        )}
      </div>
      <h2 className="text-center text-sm font-bold mb-2">
        {dict.decryptPage.passwordLabel}
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
                setPasswordError(dict.decryptPage.minError);
              } else if (value.length > 64) {
                setPasswordError(dict.decryptPage.maxError);
              } else {
                setPasswordError("");
              }
            }}
            className="w-64 bg-[#020617] border border-gray-600 text-white rounded-lg px-3 py-2 pr-10
          focus:border-blue-500 focus:outline-none transition"
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
      <div className="flex justify-center mt-6 gap-4 px-4">
        <button
          onClick={handleDecrypt}
          disabled={
            loading ||
            !isEncrypted ||
            passwordError ||
            localPassword.length < 12
          }
          className={`
            flex-1 max-w-xs py-3 rounded-lg border transition-all
            bg-green-500/20 border-green-500 text-green-400
            hover:bg-green-600/10 hover:text-white
            active:scale-95
            ${
              loading ||
              !isEncrypted ||
              passwordError ||
              localPassword.length < 12
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
            `}
        >
          {loading ? dict.decryptPage.decrypting : dict.decryptPage.decrypt}
        </button>

        <button
          onClick={handleDownload}
          disabled={!isDecrypted || loading}
          className={`
            flex-1 max-w-xs py-3 rounded-lg border transition-all
            ${
              !isDecrypted || loading
                ? "bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed"
                : "bg-blue-500/20 border-blue-500 text-blue-400 hover:bg-blue-600/10 hover:text-white active:scale-95"
            }
            `}
        >
          {dict.decryptPage.download}
        </button>
      </div>
    </div>
  );
};

export default DescifrarPage;
