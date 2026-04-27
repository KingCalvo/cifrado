"use client";

import { createContext, useContext, useState } from "react";

// Crear el contexto correctamente
const PasswordContext = createContext();

export const PasswordProvider = ({ children }) => {
  const [password, setPassword] = useState("");

  const updatePassword = (newPassword) => {
    setPassword(newPassword);
  };

  return (
    <PasswordContext.Provider value={{ password, updatePassword }}>
      {children}
    </PasswordContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const usePassword = () => {
  return useContext(PasswordContext);
};
