"use client";
import { useState } from "react";
import { useArray } from "../context/ArrayContext";
import { FaFileDownload } from "react-icons/fa";

const DocumentForm = () => {
  const [file, setFile] = useState(null);
  const { setArray, clearItems, items, fileName, setFileName, setFileType } =
    useArray();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setFileName(selectedFile.name);
      setFileType(selectedFile.type);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!file) return;

    setLoading(true);
    setProgress(0);

    const reader = new FileReader();

    reader.readAsArrayBuffer(file);

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setProgress(percent);
      }
    };

    reader.onload = () => {
      const byteArray = new Uint8Array(reader.result);

      setArray(byteArray);

      setLoading(false);
    };

    reader.onerror = () => {
      setLoading(false);
      alert("Error al leer archivo");
    };
  };

  const handleDelete = () => {
    setFile(null);
    setFileName("");
    clearItems();
    console.log("Archivo eliminado y contexto limpiado");
  };

  return (
    <section className="w-full h-screen flex justify-center items-center">
      {loading && (
        <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
          <div className="w-64 bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-500 h-4 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white mt-4">{progress}%</p>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="min-w-[300px] max-w-[700px] bg-slate-600 h-[500px] rounded-2xl p-8 mb-8 flex flex-col justify-center items-center gap-8"
      >
        <div className="flex flex-col justify-center items-center gap-8">
          <label
            htmlFor="document"
            className="bg-slate-400 w-36 h-36 rounded-2xl cursor-pointer hover:font-bold hover:scale-110 hover:border-2 hover:border-white transition-all flex flex-col justify-center items-center"
          >
            <FaFileDownload className="text-4xl w-5/6" />
            <p>Subir documento</p>
          </label>
          <span
            className={`text-center text-2xl font-semibold ${
              fileName ? "text-green-500" : "text-red-500"
            }`}
          >
            {fileName ? fileName : "No se ha seleccionado un archivo"}
          </span>
          <span>{items.length} bytes cargados</span>
          <input
            type="file"
            id="document"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-700 rounded-xl px-6 py-4 text-xl hover:scale-110 hover:border-white hover:border-2 hover:transition-all"
        >
          Cargar Bytes
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-700 rounded-xl px-6 py-4 text-xl hover:scale-110 hover:border-white hover:border-2 hover:transition-all"
        >
          Vaciar Bytes
        </button>
      </form>
    </section>
  );
};

export default DocumentForm;
