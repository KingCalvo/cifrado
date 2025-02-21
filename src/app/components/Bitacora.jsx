const Bitacora = ({ resultText, onClear }) => {
  return (
    <div className="mt-4 bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-96 mx-auto text-white overflow-auto">
      <h1 className="text-2xl font-bold text-white mb-4">Bitacora</h1>
      <pre className="text-slate-300">{resultText}</pre>
      <div className="flex justify-center mt-4">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
          onClick={onClear}
        >
          Limpiar Log
        </button>
      </div>
    </div>
  );
};

export default Bitacora;
