"use client";
import React from "react";
import AsciiHexTable from "../components/AsciiHexTable";
import Bitacora from "../components/Bitacora";
import { useBinaryArray } from "../context/ArrayBinary";

const Page = () => {
  const { items: bits } = useBinaryArray();
  const password = "clave123";
  function xorEncrypt(bits, password) {
    return bits.map((b, i) => b ^ password.charCodeAt(i % password.length) % 2);
  }
  function xorDecrypt(bits, password) {
    return xorEncrypt(bits, password);
  }

  function sumMod2Encrypt(bits, password) {
    return bits.map(
      (b, i) => (b + (password.charCodeAt(i % password.length) % 2)) % 2
    );
  }
  function sumMod2Decrypt(bits, password) {
    return sumMod2Encrypt(bits, password);
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
  function rotateDecrypt(bits, password) {
    let arr = [...bits];
    for (let c of [...password].reverse())
      arr = rotate(arr, c.charCodeAt(0) % 2 === 0);
    return arr;
  }
  function blockReverseEncrypt(bits, password) {
    return password.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
      2 ===
      1
      ? bits.reverse()
      : bits;
  }
  function blockReverseDecrypt(bits, password) {
    return blockReverseEncrypt(bits, password);
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
  function permuteDecrypt(bits, password) {
    let indices = [...bits.keys()];
    indices.sort(
      (a, b) =>
        (password.charCodeAt(a % password.length) % bits.length) -
        (password.charCodeAt(b % password.length) % bits.length)
    );
    let original = new Array(bits.length);
    indices.forEach((idx, i) => (original[idx] = bits[i]));
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
  const passwordShiftEncrypt = (bits, password) => {
    const shift =
      password.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      bits.length;
    return [...bits.slice(-shift), ...bits.slice(0, -shift)];
  };
  const passwordShiftDecrypt = (bits, password) => {
    const shift =
      password.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      bits.length;
    return [...bits.slice(shift), ...bits.slice(0, shift)];
  };
  const altXorEncrypt = (bits, password) =>
    bits.map(
      (b, i) =>
        b ^
        (password.charCodeAt(i % password.length) % 2 ^ (i % 2 === 0 ? 0 : 1))
    );

  //las funciones y los metodos se podrian pasar a un contexto pero la neta le intente per no pude XD
  const methods = [
    { name: "XOR", encrypt: xorEncrypt, decrypt: xorDecrypt },
    { name: "Suma Mod 2", encrypt: sumMod2Encrypt, decrypt: sumMod2Decrypt },
    { name: "Rotación", encrypt: rotateEncrypt, decrypt: rotateDecrypt },
    {
      name: "Inversión",
      encrypt: blockReverseEncrypt,
      decrypt: blockReverseDecrypt,
    },
    { name: "Permutación", encrypt: permuteEncrypt, decrypt: permuteDecrypt },
    {
      name: "Shift Left",
      encrypt: shiftLeftDecrypt,
      decrypt: shiftLeftDecrypt,
    },
    {
      name: "Shift Right",
      encrypt: shiftRightDecrypt,
      decrypt: shiftRightDecrypt,
    },
    {
      name: "Inversión por Pares",
      encrypt: pairReverseDecrypt,
      decrypt: pairReverseDecrypt,
    },
    { name: "Suma Alterna", encrypt: altSumDecrypt, decrypt: altSumDecrypt },
    {
      name: "Password Shift",
      encrypt: passwordShiftEncrypt,
      decrypt: passwordShiftDecrypt,
    },
    {
      name: "Alternate XOR",
      encrypt: altXorEncrypt,
      decrypt: altXorEncrypt,
    },
  ];
  //todo esto es lo mismo para el cifraddo y descifrado
  let encryptedBits = bits;
  let resultText = "Original: " + encryptedBits + "\n";

  // Cifrado: numeración creciente lo unico que cambia es aquí, no sé si le vayan a poner más pasos o que
  methods.forEach((method, index) => {
    encryptedBits = method.encrypt(encryptedBits, password);
    resultText += `${index + 1}. ${method.name} Cifrado: ${encryptedBits}\n`;
  });

  resultText += "\n";

  // Descifrado: numeración decreciente
  methods.reverse().forEach((method, index) => {
    encryptedBits = method.decrypt(encryptedBits, password);
    resultText += `${methods.length - index}. ${
      method.name
    } Descifrado: ${encryptedBits}\n`;
  });

  resultText += "\n" + bits + " Original: ";
  resultText += "\n" + encryptedBits + " Final Resultado: ";

  return (
    <div className="mt-40 min-h-screen pb-16">
      <AsciiHexTable />
      <Bitacora resultText={resultText} />
    </div>
  );
};

export default Page;
