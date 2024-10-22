import React, { useState } from 'react';
import SignaturePad from './SignaturePad';
import Document from './Document';
import html2canvas from 'html2canvas'; // Importar html2canvas

const FormFlatiron = () => {
  const [viewDocument, setViewDocument] = useState(false);
  const [reset, setReset] = useState(false);
  const [signature, setSignature] = useState(null);
  const [formImageURL, setFormImageURL] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phoneNumber: '',
    email: '',
    signed_contract_file: '',
    user_identification_file: '',
    action_auto_branch_id: 50,
  });


  const resetForm = () => {
    setReset(true);
    setFormData({
      first_name: '',
      last_name: '',
      phoneNumber: '',
      email: '',
      signed_contract_file: '',
      user_identification_file: '',
      action_auto_branch_id: 50,
    });
  };

  const validateForm = () => {
    const requiredFields = [
      'first_name',
      'last_name',
      'phoneNumber',
      'email',
      'signed_contract_file',
      'user_identification_file',
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        return false; // Si algún campo requerido está vacío, retorna false
      }
    }
    return true; // Todos los campos están completos
  };

    const validateFormForNext = () => {
    const requiredFields = [
      'first_name',
      'last_name',
      'phoneNumber',
      'email',
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        return false; // Si algún campo requerido está vacío, retorna false
      }
    }
    return true; // Todos los campos están completos
  };

  const handleSignatureSave = async (formImage) => {
    await setFormData({
      ...formData,
      signed_contract_file : formImage, // Guardar la firma en el estado
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
   const urlBase = import.meta.env.PUBLIC_URL_BASE;
    if (validateForm()) {
      const formDataToSend = new FormData();

      // Agrega los datos de texto
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('action_auto_branch_id', formData.action_auto_branch_id);

      // Agrega los archivos
      formDataToSend.append('signed_contract_file', formData.signed_contract_file);
      formDataToSend.append('user_identification_file', formData.user_identification_file);

      try {
        const response = await fetch(`${urlBase}api/expedite/v1/glofox-contract-signatures`, {
          method: 'POST',
          body: formDataToSend,
        });

        if (response.ok) {
          console.log('Datos enviados con éxito');
          resetForm();
        } else {
          console.error('Error en la solicitud');
          // Aquí puedes manejar el error
        }
      } catch (error) {
        console.error('Error en la conexión', error);
      }
    } else {
      console.log('Por favor, completa todos los campos.');
    }
  };

   // Captura de imagen del formulario usando html2canvas
   // Captura de imagen del formulario usando html2canvas
  const captureFormImage = async () => {
    const formElement = document.getElementById('form');
    if (formElement) {
      const canvas = await html2canvas(formElement);
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const imageURL = URL.createObjectURL(blob); // Crear una URL temporal para la imagen
          setFormImageURL(imageURL); // Guardar la URL en el estado
          resolve(blob);
        }, 'image/png');
      });
    }
  };


  const handleNext = async () => {
    // Capturar imagen del formulario antes de guardar la firma
    const formImageBlob = await captureFormImage();
    
    // Guardar la imagen como parte del archivo firmado
    await handleSignatureSave(formImageBlob);
    
    setViewDocument(true);
  };


  const handleAction = () => {
    if (validateForm()) {
     handleSubmit();
    } else {
      handleNext();
    }
  };

  const handleIDCapture = (idDocument) => {
    setFormData({
      ...formData,
      user_identification_file: idDocument, // Guarda la imagen del documento de identidad en el estado
    });
  };



  return (
    <div id="form" className="w-full flex flex-col justify-center items-start py-4">
      <div className="flex items-center px-4">
        <img src="/logo_usa.png" alt="logo_usa" />
      </div>
      <Document setViewDocument={setViewDocument} onCapture={handleIDCapture} viewDocument={viewDocument} />
      <div  className={`${viewDocument ? 'hidden' : 'flex'} flex-col w-fill px-10 mx-auto p-6 bg-white text-base`}>
      <div className="flex items-center mb-4">
        <label className="block  font-medium text-gray-700 mr-2">
          I
        </label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First Name"
          className="border-b border-gray-300 p-2 rounded-none focus:outline-none focus:border-b-2 focus:border-indigo-500 flex-1"
        />
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          className="border-b border-gray-300 p-2 rounded-none focus:outline-none focus:border-b-2 focus:border-indigo-500 flex-1 ml-2"
        />
      </div>

      <div className="flex items-center mb-4">
        <label className="block  font-medium text-gray-700 mr-2">
          Phone number
        </label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border-b border-gray-300 p-2 rounded-none focus:outline-none focus:border-b-2 focus:border-indigo-500 flex-1"
        />
      </div>

      <div className="flex items-center mb-4">
        <label className="block  font-medium text-gray-700 mr-2">
          E-mail
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
            className="border-b border-gray-300 p-2 rounded-none focus:outline-none focus:border-b-2 focus:border-indigo-500 flex-1"
            required
        />
      </div>

      <div className="mb-4">
        <p className="text-gray-700">
          <strong>Assumption of Risk:</strong> I acknowledge and understand that I bear sole responsibility for any risks associated with my engagement in the training activities inside the club.
        </p>
      </div>

      <div className="mb-4">
        <p className="text-gray-700">
          <strong>Release and Waiver:</strong> I hereby release, discharge, and waive any claims against Action Black Flatiron LLC, agreeing not to initiate any legal proceedings.
        </p>
      </div>

      <div className="flex flex-col items-start gap-4 mb-4">
        <label className="block  font-medium text-gray-700 mr-2">
          By affixing my signature hereto, I attest that I have thoroughly reviewed and comprehended:
        </label> 
        <SignaturePad reset={reset} setReset={setReset} setSignature={setSignature} />
      </div>

      <div className="mb-4">
        <p className="text-gray-700">
          Additional: I accept the general regulation of Action Black services
        </p>
      </div>

      <div className="flex items-center mb-4">
        <label className="block  font-medium text-gray-700 mr-2">
          Process manager Andre Scott
        </label>
      </div>

      <div className="flex items-center mb-4">
        <label className="block  font-medium text-gray-700 mr-2">
          Country USA 
        </label>
     
      </div>
       <div className="w-full flex justify-end py-2">
        <button disabled={validateFormForNext() && signature ? false : true} onClick={handleAction} className="w-1/3 bg-indigo-600 text-white p-2 rounded-lg mt-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300">
          {validateForm() ? 'Submit' : 'Next'}
        </button>
        </div>
        
          {/* {formImageURL && (
        <div className="mt-4">
          <img src={formImageURL} alt="Captura del formulario" className="border border-gray-300" />
        </div>
      )} */}
      </div>
    </div>   
  );
};

export default FormFlatiron;
