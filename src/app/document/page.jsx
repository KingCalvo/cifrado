"use client";
import { useState } from "react";
import { useArray } from "../context/ArrayContext";
import { FaFileDownload, FaFileAlt } from "react-icons/fa";

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
  };

  return (
    <section className="w-full min-h-screen flex justify-center items-center bg-black text-white px-4">
      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
          <div className="w-72 h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-gray-300">{progress}%</p>
        </div>
      )}

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-[#111827] border border-gray-700 rounded-2xl p-8 flex flex-col gap-6 shadow-xl"
      >
        {/* Título */}
        <h2 className="text-xl text-center font-semibold text-blue-400">
          Selecciona un archivo para cargarlo en el sistema
        </h2>

        {/* Upload */}
        <label
          htmlFor="document"
          className="w-full h-40 border-2 border-dashed border-gray-600 rounded-xl flex flex-col justify-center items-center cursor-pointer
          hover:border-blue-400 hover:bg-blue-500/5 transition-all"
        >
          <FaFileDownload className="text-3xl text-blue-400 mb-2" />
          <p className="text-gray-300 text-sm">Seleccionar archivo</p>
        </label>

        {/* Info archivo */}
        <div className="flex flex-col items-center justify-center gap-2 bg-black/30 border border-gray-700 rounded-lg p-4 text-center">
          {/* Icono dinámico */}
          <div className="text-blue-400 text-3xl">
            {fileName ? <FaFileAlt /> : <FaFileDownload />}
          </div>

          {/* Texto */}
          <div className="flex flex-col text-sm">
            <span className={fileName ? "text-green-400" : "text-gray-400"}>
              {fileName || "Ningún archivo seleccionado"}
            </span>
            <span className="text-xs text-gray-500">
              {items.length} bytes cargados
            </span>
          </div>
        </div>

        <input
          type="file"
          id="document"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Botones */}
        <div className="flex justify-between gap-4">
          {/* Vaciar - izquierda */}
          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 bg-red-600/10 border border-red-500 text-red-400 py-3 rounded-lg
            hover:bg-red-500/20 hover:text-white transition-all"
          >
            Vaciar
          </button>

          {/* Cargar - derecha */}
          <button
            type="submit"
            className="flex-1 bg-blue-600/10 border border-blue-500 text-blue-400 py-3 rounded-lg
            hover:bg-blue-500/20 hover:text-white hover:shadow-[0_0_10px_#3b82f6]
            transition-all"
          >
            Cargar
          </button>
        </div>
      </form>
    </section>
  );
};

export default DocumentForm;
