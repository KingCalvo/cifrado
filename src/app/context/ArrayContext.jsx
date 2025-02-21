"use client"; // Agrega esta línea arriba de todo

import { createContext, useContext, useState } from "react";

// 1. Crear el contexto
const ArrayContext = createContext();

// 2. Proveedor del contexto
export const ArrayProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [fileName, setFileName] = useState(""); // Nombre del archivo
  const [fileType, setFileType] = useState(""); // Tipo MIME del archivo

  // Función para agregar un elemento al array
  const addItem = (item) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  // Función para eliminar un elemento por índice
  const removeItem = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  // Función para agregar un array de bytes y metadatos del archivo
  const addFileData = (byteArray, name, type) => {
    setItems(byteArray);
    setFileName(name);
    setFileType(type);
  };

  // Función para actualizar un elemento del array
  const updateItem = (index, newValue) => {
    setItems((prevItems) => {
      const updated = [...prevItems];
      updated[index] = newValue;
      return updated;
    });
  };

  const updateAllItems = (newItems) => {
    setItems(newItems);
  };

  const clearItems = () => {
    setItems([]);
    setFileName("");
    setFileType("");
  };

  const addArray = (array) => {
    setItems(array);
  };

  return (
    <ArrayContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItem,
        updateAllItems,
        clearItems,
        fileName,
        fileType,
        addFileData,
        addArray,
      }}
    >
      {children}
    </ArrayContext.Provider>
  );
};

// 3. Hook personalizado para usar el contexto
export const useArray = () => {
  return useContext(ArrayContext);
};
