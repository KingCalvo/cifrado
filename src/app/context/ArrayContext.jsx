"use client"; // Agrega esta línea arriba de todo

import { createContext, useContext, useState } from "react";

// 1. Crear el contexto
const ArrayContext = createContext();

// 2. Proveedor del contexto
export const ArrayProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Función para agregar un elemento al array
  const addItem = (item) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  // Función para eliminar un elemento por índice
  const removeItem = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
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

  return (
    <ArrayContext.Provider
      value={{ items, addItem, removeItem, updateItem, updateAllItems }}
    >
      {children}
    </ArrayContext.Provider>
  );
};

// 3. Hook personalizado para usar el contexto
export const useArray = () => {
  return useContext(ArrayContext);
};
