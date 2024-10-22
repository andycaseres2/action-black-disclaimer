import React, { useRef, useState, useEffect } from 'react';
import Trash from '../Icons/Trash';

const SignaturePad = ({ setSignature, reset, setReset }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.strokeStyle = 'black'; // Color de la firma
    context.lineWidth = 1.5; // Grosor de la línea para mayor precisión
    context.lineJoin = 'round'; // Suavizar las uniones de las líneas
    context.lineCap = 'round'; // Suavizar el final de las líneas
    context.fillStyle = 'white'; // Color de fondo
    context.fillRect(0, 0, canvas.width, canvas.height); // Fondo blanco

    // Prevenir el desplazamiento del canvas
    canvas.style.touchAction = 'none'; // Evitar el scroll en dispositivos táctiles
  }, []);

  const getCanvasPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
      y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top,
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { x, y } = getCanvasPosition(e);
    setLastX(x);
    setLastY(y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasPosition(e);

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(x, y);
    context.stroke();

    setLastX(x);
    setLastY(y);

    // Prevenir el comportamiento de desplazamiento predeterminado en pantallas táctiles
    if (e.touches) {
      e.preventDefault();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;

    // Convertir el canvas en una imagen literal (Blob)
    canvas.toBlob((blob) => {
      if (setSignature) {
        setSignature(blob); // Enviar la imagen literal (Blob) a onSave
      }
    }, 'image/png');
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
    context.fillStyle = 'white'; // Restaura el fondo
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (reset) clearSignature();
    setTimeout(() => setReset(false), 2000);
  }, [reset]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={300} // Aumentar el tamaño del área de firma
        className="border border-gray-300 rounded-lg"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <div className="flex space-x-2 mt-4 w-full justify-end">
        <button onClick={clearSignature} className="bg-red-500 text-white p-2 rounded">
          <Trash />
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
