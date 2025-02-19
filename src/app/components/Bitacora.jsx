
const Bitacora = ({resultText}) => {
  return (
    <div className="mt-4 bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-96 mx-auto text-white overflow-auto" >
        <h1 className="text-2xl font-bold text-white" >Bitacora</h1>
        <pre className="text-slate-300" >{resultText}</pre>
    </div>
  )
}

export default Bitacora