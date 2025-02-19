"use client";

import { createContext, useContext, useState } from "react";

const BinaryContext = createContext();

export const ArrayProviderBinary = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  const removeItem = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <BinaryContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </BinaryContext.Provider>
  );
};

export const useBinaryArray = () => useContext(BinaryContext);