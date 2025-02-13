"use client"; // Importante para usar hooks en Next.js (app router)

import { useArray } from "../context/ArrayContext";

const ExampleComponent = () => {
  const { items, addItem, removeItem } = useArray();

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col gap-6">
      <h2>Lista de Elementos</h2>
      <button
        className="px-4 py-2 bg-blue-700 "
        onClick={() => addItem(`Elemento ${items.length + 1}`)}
      >
        Agregar Elemento
      </button>
      <ul className="flex-col gap-4">
        {items.map((item, index) => (
          <li key={index}>
            {item}{" "}
            <button
              className="px-4 py-2 bg-red-700 "
              onClick={() => removeItem(index)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExampleComponent;
