"use client";
import React, { useState } from "react";
import AsciiHexTable from "../components/AsciiHexTable";
import Bitacora from "../components/Bitacora";
import { useArray } from "../context/ArrayContext";
import { usePassword } from "../context/Password";

// Convierte el arreglo de bytes en un arreglo de bits (cada byte se representa con 8 bits)
const bytesToBits = (bytes) => {
  const bits = [];
  bytes.forEach((byte) => {
    const binStr = byte.toString(2).padStart(8, "0");
    binStr.split("").forEach((bit) => {
      bits.push(parseInt(bit));
    });
  });
  return bits;
};

// Convierte un arreglo de bits a bytes (se agrupan 8 bits para formar cada byte)
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

// Funciones de cifrado
function xorEncrypt(bits, password) {
  return bits.map((b, i) => b ^ password.charCodeAt(i % password.length) % 2);
}
function sumMod2Encrypt(bits, password) {
  return bits.map(
    (b, i) => (b + (password.charCodeAt(i % password.length) % 2)) % 2
  );
}
function rotate(bits, right = true) {
  return right
    ? [bits[bits.length - 1], ...bits.slice(0, -1)]
    : [...bits.slice(1), bits[0]];
}
function rotateEncrypt(bits, password) {
  let arr = [...bits];
  for (let c of password) arr = rotate(arr, c.charCodeAt(0) % 2 === 1);
  return arr;
}
function blockReverseEncrypt(bits, password) {
  return password.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 2 ===
    1
    ? bits.reverse()
    : bits;
}
function permuteEncrypt(bits, password) {
  let indices = [...bits.keys()];
  indices.sort(
    (a, b) =>
      (password.charCodeAt(a % password.length) % bits.length) -
      (password.charCodeAt(b % password.length) % bits.length)
  );
  return indices.map((i) => bits[i]);
}
const shiftLeftEncrypt = (bits) => [
  bits[bits.length - 1],
  ...bits.slice(0, -1),
];
const shiftRightEncrypt = (bits) => [...bits.slice(1), bits[0]];
const pairReverseEncrypt = (bits) => {
  let arr = [...bits];
  for (let i = 0; i < arr.length - 1; i += 2)
    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
  return arr;
};
const altSumEncrypt = (bits) =>
  bits.map((b, i) => (i % 2 === 0 ? (b + 1) % 2 : b));
const passwordShiftEncrypt = (bits, password) => {
  const shift =
    password.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    bits.length;
  return [...bits.slice(-shift), ...bits.slice(0, -shift)];
};
const altXorEncrypt = (bits, password) =>
  bits.map(
    (b, i) =>
      b ^ (password.charCodeAt(i % password.length) % 2 ^ (i % 2 === 0 ? 0 : 1))
  );

// Lista de métodos de cifrado a aplicar
const methods = [
  { name: "XOR", encrypt: xorEncrypt },
  { name: "Suma Mod 2", encrypt: sumMod2Encrypt },
  { name: "Rotación", encrypt: rotateEncrypt },
  { name: "Inversión", encrypt: blockReverseEncrypt },
  { name: "Permutación", encrypt: permuteEncrypt },
  { name: "Shift Left", encrypt: shiftLeftEncrypt },
  { name: "Shift Right", encrypt: shiftRightEncrypt },
  { name: "Inversión por Pares", encrypt: pairReverseEncrypt },
  { name: "Suma Alterna", encrypt: altSumEncrypt },
  { name: "Password Shift", encrypt: passwordShiftEncrypt },
  { name: "Alternate XOR", encrypt: altXorEncrypt },
];

const CifrarPage = () => {
  const { items, updateAllItems } = useArray();
  const { password, updatePassword } = usePassword();
  const [localPassword, setLocalPassword] = useState(password);
  const [log, setLog] = useState("");
  const [encryptedBytes, setEncryptedBytes] = useState([]);

  const handleCifrar = () => {
    // Convertir bytes a bits
    const bits = bytesToBits(items);
    let encryptedBits = [...bits];
    let resultText = "Original (bits): " + encryptedBits.join("") + "\n";

    const pass = localPassword;
    // Aplicar cada método de cifrado
    methods.forEach((method, index) => {
      encryptedBits = method.encrypt(encryptedBits, pass);
      resultText += `${index + 1}. ${method.name} Cifrado: ${encryptedBits.join(
        ""
      )}\n`;
    });
    resultText += "\nResultado final (bits): " + encryptedBits.join("") + "\n";
    // Convertir bits a bytes
    const newBytes = bitsToBytes(encryptedBits);
    resultText += "Resultado final (bytes): " + newBytes.join(", ");

    // Actualizar el contexto con los nuevos bytes cifrados
    updateAllItems(newBytes);
    setEncryptedBytes(newBytes);
    setLog(resultText);
  };

  const handleGuardar = () => {
    // Crear un Blob con los bytes cifrados para descargarlo como archivo
    const blob = new Blob([new Uint8Array(encryptedBytes)], {
      type: "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "archivo_cifrado.bin";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-20">
      <div className="mb-4">
        <h1 className="text-center text-2xl font-bold">Cifrado</h1>
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
      {/* Botones para cifrar y guardar */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={handleCifrar}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Cifrar
        </button>
        <button
          onClick={handleGuardar}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Guardar Archivo
        </button>
      </div>
      {/* Mostrar el log del proceso de cifrado */}
      <div className="mt-6 p-4 bg-gray-800 rounded text-sm">
        <Bitacora resultText={log} />
      </div>
    </div>
  );
};

export default CifrarPage;
