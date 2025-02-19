"use client";
import { useState } from "react";
import { useArray } from "../context/ArrayContext"; // Se importa el contexto
import { FaFileDownload } from "react-icons/fa";

const DocumentForm = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const { addItem } = useArray();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    if (file) {
      setFileName(file.name); // Actualiza el nombre del archivo cuando se selecciona uno
    } else {
      setFileName(""); // Si no hay archivo, limpia el nombre
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const byteArray = new Uint8Array(arrayBuffer); // Convierte en array de bytes

        // Agrega cada byte individualmente al contexto
        byteArray.forEach((byte) => {
          addItem(byte);
        });

        console.log(
          "Archivo convertido y bytes añadidos al contexto:",
          byteArray
        );
      };
      reader.onerror = (error) => {
        console.error("Error al leer el archivo:", error);
      };
    } else {
      console.log("Documento no seleccionado");
    }
  };

  return (
    <section className="w-full h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="min-w-[300px] max-w-[700px] bg-slate-600 h-[400px] rounded-2xl p-4 flex flex-col justify-center items-center gap-8"
      >
        <div className="flex flex-col justify-center items-center gap-8">
          <label htmlFor="document" className="bg-slate-400 w-36 h-36 rounded-2xl cursor-pointer hover:font-bold hover:scale-110 hover:border-2 hover:border-white transition-all flex flex-col justify-center items-center" >
            <FaFileDownload className="text-4xl w-5/6" />
            <p>Subir documento</p>
          </label>
          <span className="text-center text-2xl font-semibold">
            {fileName ? fileName : "No se ha seleccionado un archivo"}
          </span>
          <input type="file" id="document" onChange={handleFileChange} className="hidden" />
        </div>
        <button
          type="submit"
          className="bg-blue-700 rounded-xl px-6 py-4 text-xl hover:scale-110 hover:border-white hover:border-2 hover:transition-all"
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default DocumentForm;
