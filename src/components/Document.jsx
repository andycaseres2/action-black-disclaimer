import React, { useState, useRef } from 'react';
import ArrowLeft from '../Icons/ArrowLeft';

const Document = ({ onCapture, setViewDocument, viewDocument }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [temporaryImage, setTemporaryImage] = useState(null); // Guardar temporalmente la URL de la imagen para vista previa
  const [capturedFile, setCapturedFile] = useState(null); // Guardar el archivo literal
  const inputFileRef = useRef(null); // Crear una referencia para el input

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCapturedFile(file); // Guardar el archivo literal
      const reader = new FileReader();
      reader.onloadend = () => {
        setTemporaryImage(reader.result); // Guardar la URL para la vista previa
      };
      reader.readAsDataURL(file); // Leer la imagen como URL de datos para vista previa
    }
  };

  const clearCapture = () => {
    setTemporaryImage(null); // Limpiar la vista previa
    setCapturedFile(null); // Limpiar el archivo capturado
    if (inputFileRef.current) {
      inputFileRef.current.value = ''; // Limpiar el input de tipo file
    }
  };

  const handleSave = () => {
    if (capturedFile && onCapture) {
      onCapture(capturedFile); // Enviar el archivo literal al ejecutar "Save"
    }
    setViewDocument(false); // Ocultar la vista de documento
  };

  return (
    <div className={`${viewDocument ? 'flex' : 'hidden'} w-full justify-center items-center flex-col p-10`}>
      <div className="flex justify-start items-center w-full">
        <ArrowLeft action={() => setViewDocument(false)} design="cursor-pointer" width={40} height={40} />
      </div>
      <label className="block text-sm font-medium text-gray-700 mb-10">
        Capture ID Document
      </label>
      <input
        type="file"
        accept="image/*"
        capture="environment" // Utiliza la cámara trasera
        onChange={handleCapture}
        ref={inputFileRef} // Asignar el ref al input
        className="border border-gray-300 p-2 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {temporaryImage && (
        <div className="mt-4 flex justify-center items-center w-full flex-col">
          <h3 className="text-sm font-medium text-gray-700">Preview:</h3>
          <div className="flex justify-center items-center relative py-4">
            <img src={temporaryImage} className="w-full h-full" alt="Captured ID" />
            <button onClick={clearCapture} className="bg-red-500 text-white py-2 rounded mt-2 absolute -top-2 -right-4 px-4">
              X
            </button>
          </div>
          <div>
            <button onClick={handleSave} className="bg-indigo-500 text-white py-2 rounded mt-2 px-4">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Document;
