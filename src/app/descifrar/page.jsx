"use client";
import React, { useState } from "react";
import AsciiHexTable from "../components/AsciiHexTable";
import Bitacora from "../components/Bitacora";
import { useArray } from "../context/ArrayContext";
import { usePassword } from "../context/Password";

// Convertir entre bytes y bits
const bytesToBits = (bytes) => {
  const bits = [];
  bytes.forEach((byte) => {
    const binStr = byte.toString(2).padStart(8, "0");
    binStr.split("").forEach((bit) => {
      bits.push(parseInt(bit, 10));
    });
  });
  return bits;
};

const bitsToBytes = (bits) => {
  const bytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byteBits = bits.slice(i, i + 8);
    while (byteBits.length < 8) byteBits.push(0);
    const byte = parseInt(byteBits.join(""), 2);
    bytes.push(byte);
  }
  return bytes;
};

// Métodos de descifrado (en orden inverso al cifrado)
// Nota: Algunos métodos son simétricos, por lo que su función de cifrado y descifrado es la misma.
function xorDecrypt(bits, password) {
  return bits.map((b, i) => b ^ password.charCodeAt(i % password.length) % 2);
}
function sumMod2Decrypt(bits, password) {
  return bits.map(
    (b, i) => (b + (password.charCodeAt(i % password.length) % 2)) % 2
  );
}
function rotateDecrypt(bits, password) {
  // Se recorre la contraseña en orden inverso para revertir la rotación
  let arr = [...bits];
  for (let c of [...password].reverse()) {
    arr = rotate(arr, c.charCodeAt(0) % 2 === 0);
  }
  return arr;
}
function rotate(bits, right = true) {
  return right
    ? [bits[bits.length - 1], ...bits.slice(0, -1)]
    : [...bits.slice(1), bits[0]];
}
function blockReverseDecrypt(bits, password) {
  return blockReverseEncrypt(bits, password);
}
function blockReverseEncrypt(bits, password) {
  return password.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 2 ===
    1
    ? bits.reverse()
    : bits;
}
function permuteDecrypt(bits, password) {
  let indices = [...bits.keys()];
  indices.sort(
    (a, b) =>
      (password.charCodeAt(a % password.length) % bits.length) -
      (password.charCodeAt(b % password.length) % bits.length)
  );
  let original = new Array(bits.length);
  indices.forEach((idx, i) => {
    original[idx] = bits[i];
  });
  return original;
}
const shiftLeftDecrypt = (bits) => [
  bits[bits.length - 1],
  ...bits.slice(0, -1),
];
const shiftRightDecrypt = (bits) => [...bits.slice(1), bits[0]];
const pairReverseDecrypt = (bits) => {
  let arr = [...bits];
  for (let i = 0; i < arr.length - 1; i += 2)
    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
  return arr;
};
const altSumDecrypt = (bits) =>
  bits.map((b, i) => (i % 2 === 0 ? (b + 1) % 2 : b));
const passwordShiftDecrypt = (bits, password) => {
  const shift =
    password.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    bits.length;
  return [...bits.slice(shift), ...bits.slice(0, shift)];
};
const altXorDecrypt = (bits, password) =>
  bits.map(
    (b, i) =>
      b ^ (password.charCodeAt(i % password.length) % 2 ^ (i % 2 === 0 ? 0 : 1))
  );

// Lista de métodos de descifrado en el orden inverso al aplicado en cifrado
const methods = [
  { name: "Alternate XOR", decrypt: altXorDecrypt },
  { name: "Password Shift", decrypt: passwordShiftDecrypt },
  { name: "Suma Alterna", decrypt: altSumDecrypt },
  { name: "Inversión por Pares", decrypt: pairReverseDecrypt },
  { name: "Shift Right", decrypt: shiftRightDecrypt },
  { name: "Shift Left", decrypt: shiftLeftDecrypt },
  { name: "Permutación", decrypt: permuteDecrypt },
  { name: "Inversión", decrypt: blockReverseDecrypt },
  { name: "Rotación", decrypt: rotateDecrypt },
  { name: "Suma Mod 2", decrypt: sumMod2Decrypt },
  { name: "XOR", decrypt: xorDecrypt },
];

const DescifrarPage = () => {
  const { items, updateAllItems } = useArray();
  const { password, updatePassword } = usePassword();
  const [localPassword, setLocalPassword] = useState(password);
  const [log, setLog] = useState("");
  const [decryptedBytes, setDecryptedBytes] = useState([]);

  const handleDescifrar = () => {
    // Verificar que se haya ingresado una contraseña
    if (!localPassword || localPassword.trim() === "") {
      setLog("Por favor ingrese una contraseña (4 caracteres).");
      return;
    }
    // Verificar que se haya ingresado una contraseña de 4 caracteres
    if (!localPassword || localPassword.trim().length !== 4) {
      setLog("La contraseña debe tener exactamente 4 caracteres.");
      return;
    }

    // Convertir el array de bytes actual a bits
    const bits = bytesToBits(items);
    let decryptedBits = [...bits];
    let resultText = "Original (bits): " + decryptedBits.join("") + "\n";
    const pass = localPassword;
    // Aplicar cada método de descifrado en orden inverso
    methods.forEach((method, index) => {
      decryptedBits = method.decrypt(decryptedBits, pass);
      resultText += `${methods.length - index}. ${
        method.name
      } Descifrado: ${decryptedBits.join("")}\n`;
    });
    resultText += "\nResultado final (bits): " + decryptedBits.join("") + "\n";
    // Convertir el array de bits de vuelta a bytes
    const newBytes = bitsToBytes(decryptedBits);
    resultText += "Resultado final (bytes): " + newBytes.join(", ");
    // Actualizar el contexto con los nuevos bytes descifrados para que AsciiHexTable se actualice
    updateAllItems(newBytes);
    setDecryptedBytes(newBytes);
    setLog(resultText);
  };

  const handleGuardar = () => {
    // Crear un Blob con los bytes descifrados y descargarlo
    const blob = new Blob([new Uint8Array(decryptedBytes)], {
      type: "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "archivo_descifrado.bin";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-20">
      <div className="mb-4">
        <h1 className="text-center text-2xl font-bold">Descifrado</h1>
      </div>
      {/* Input para la contraseña */}
      <div className="flex justify-center mb-4">
        <label className="mr-2">Contraseña (4 caracteres):</label>
        <input
          type="text"
          maxLength="4"
          value={localPassword}
          onChange={(e) => {
            setLocalPassword(e.target.value);
            updatePassword(e.target.value);
          }}
          className="border px-2 py-1 bg-gray-800 text-white"
        />
      </div>
      {/* Componente reutilizable para visualizar y editar los bytes */}
      <AsciiHexTable />
      {/* Botones para descifrar y guardar */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={handleDescifrar}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Descifrar
        </button>
        <button
          onClick={handleGuardar}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Guardar Archivo
        </button>
      </div>
      {/* Mostrar el log del proceso de descifrado */}
      <div className="mt-6 p-4 bg-gray-800 rounded text-sm">
        <Bitacora resultText={log} />
      </div>
    </div>
  );
};

export default DescifrarPage;
