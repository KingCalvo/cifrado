import React from "react";
import AsciiHexTable from "../components/AsciiHexTable";

const Page = () => {
  return (
    <div className="mt-40">
      <AsciiHexTable />
    </div>
  );
};

export default Page;

const bits = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const password = "clave123";

// 1. XOR Decryption
const xorDecrypt = (bits, password) =>
  bits.map((b, i) => b ^ (password.charCodeAt(i % password.length) % 2));

// 2. Suma Mod 2 Decryption
const sumMod2Decrypt = (bits, password) =>
  bits.map((b, i) => (b - (password.charCodeAt(i % password.length) % 2) + 2) % 2);

// 3. Rotación de bits
const rotate = (bits, right = true) =>
  right ? [bits[bits.length - 1], ...bits.slice(0, -1)] : [...bits.slice(1), bits[0]];

const rotateDecrypt = (bits, password) => {
  let arr = [...bits];
  for (let c of [...password].reverse()) arr = rotate(arr, c.charCodeAt(0) % 2 === 0);
  return arr;
};

// 4. Inversión de bloque
const blockReverseDecrypt = (bits, password) =>
  password.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 2 === 1
    ? bits.reverse()
    : bits;

// 5. Permutación
const permuteDecrypt = (bits, password) => {
  let indices = [...bits.keys()];
  indices.sort(
    (a, b) =>
      (password.charCodeAt(a % password.length) % bits.length) -
      (password.charCodeAt(b % password.length) % bits.length)
  );
  let original = new Array(bits.length);
  indices.forEach((idx, i) => (original[idx] = bits[i]));
  return original;
};

// 6. Desplazamiento (Shift Left)
const shiftLeftDecrypt = (bits) => [bits[bits.length - 1], ...bits.slice(0, -1)];

// 7. Desplazamiento (Shift Right)
const shiftRightDecrypt = (bits) => [...bits.slice(1), bits[0]];

// 8. Inversión por pares
const pairReverseDecrypt = (bits) => {
  let arr = [...bits];
  for (let i = 0; i < arr.length - 1; i += 2) [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
  return arr;
};

// 9. Suma alterna
const altSumDecrypt = (bits) =>
  bits.map((b, i) => (i % 2 === 0 ? (b + 1) % 2 : b));

// 10. AND con clave
const andDecrypt = (bits, password) =>
  bits.map((b, i) => (b | (password.charCodeAt(i % password.length) % 2)) % 2);

// 11. OR con clave
const orDecrypt = (bits, password) =>
  bits.map((b, i) => (b & (password.charCodeAt(i % password.length) % 2)));

// Métodos de descifrado
const methods = [
  { name: "XOR", decrypt: xorDecrypt },
  { name: "Suma Mod 2", decrypt: sumMod2Decrypt },
  { name: "Rotación", decrypt: rotateDecrypt },
  { name: "Inversión", decrypt: blockReverseDecrypt },
  { name: "Permutación", decrypt: permuteDecrypt },
  { name: "Shift Left", decrypt: shiftLeftDecrypt },
  { name: "Shift Right", decrypt: shiftRightDecrypt },
  { name: "Inversión por Pares", decrypt: pairReverseDecrypt },
  { name: "Suma Alterna", decrypt: altSumDecrypt },
  { name: "AND con Clave", decrypt: andDecrypt },
  { name: "OR con Clave", decrypt: orDecrypt },
];

const decryptData = (encryptedBits) => {
  let decryptedBits = [...encryptedBits];
  let resultText = `Inicial: ${decryptedBits.join(" ")}\n`;

  // Descifrado
  methods.reverse().forEach((method) => {
    decryptedBits = method.decrypt(decryptedBits, password);
    resultText += `${method.name} Descifrado: ${decryptedBits.join(" ")}\n`;
  });

  return resultText;
};

console.log(decryptData(bits));