"use client";

import { createContext, useContext, useState, useMemo } from "react";

// Crear el contexto
const ArrayContext = createContext();

// Proveedor del contexto
export const ArrayProvider = ({ children }) => {
  const [items, setItems] = useState(new Uint8Array());
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");

  // Establecer array completo
  const setArray = (newArray) => {
    setItems(newArray);
  };

  // Actualizar un elemento
  const updateItem = (index, newValue) => {
    setItems((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const updated = [...prev];
      updated[index] = newValue;
      return updated;
    });
  };

  // Limpiar todo
  const clearItems = () => {
    setItems([]);
    setFileName("");
    setFileType("");
  };

  // Valor memoizado
  const value = useMemo(
    () => ({
      items,
      setArray,
      updateItem,
      clearItems,
      fileName,
      setFileName,
      fileType,
      setFileType,
    }),
    [items, fileName, fileType],
  );

  return (
    <ArrayContext.Provider value={value}>{children}</ArrayContext.Provider>
  );
};

export const useArray = () => {
  return useContext(ArrayContext);
};
