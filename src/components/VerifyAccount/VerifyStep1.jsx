/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaIdCard } from "react-icons/fa";

function VerifyStep1({ onNextStep }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const animationDuration = 1000; // Duración de la animación en milisegundos
    const interval = 10; // Intervalo de actualización en milisegundos
    const targetProgress = 25; // Porcentaje objetivo de progreso

    let currentProgress = 0;
    const increment = targetProgress / (animationDuration / interval);

    const animationInterval = setInterval(() => {
      if (currentProgress < targetProgress) {
        currentProgress += increment;
        setProgress(currentProgress);
      } else {
        clearInterval(animationInterval);
      }
    }, interval);

    return () => {
      clearInterval(animationInterval);
    };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center mb-4">
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-secondary-100 text-white mr-2">
          1
        </div>
        <h2 className="text-lg sm:text-xl font-semibold">
          Selecciona un documento de identidad válido.
        </h2>
      </div>
      <p className="text-gray-700 mb-4">
        Escoge un documento oficial que contenga tu fotografía y datos
        personales. Ej. Cédula o Pasaporte
      </p>
      <div className="flex justify-center">
        <FaIdCard className="text-gray-300 w-32 h-32" />
      </div>
      <button
        onClick={onNextStep}
        className="bg-secondary-100 text-white px-4 py-2 rounded hover:bg-blue-00 w-full mt-4 transition-colors duration-300"
      >
        Siguiente
      </button>
      <div className="relative mt-4">
        <div className="flex h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-secondary-200 rounded"
            style={{ width: `${progress}%` }} // Barra de progreso con animación
          ></div>
        </div>
      </div>
    </div>
  );
}

export default VerifyStep1;
