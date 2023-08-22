import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

function VerifyStep3({ onNextStep }) {
  const [progress, setProgress] = useState(50);
  const [verificationInProgress, setVerificationInProgress] = useState(true);

  useEffect(() => {
    const animationDuration = 8000; // Duración de la simulación de verificación en milisegundos
    const interval = 10; // Intervalo de actualización en milisegundos
    const targetProgress = 75; // Porcentaje objetivo de progreso

    let currentProgress = 50;
    const increment = (targetProgress - 50) / (animationDuration / interval);

    const animationInterval = setInterval(() => {
      if (currentProgress < targetProgress) {
        currentProgress += increment;
        setProgress(currentProgress);
      } else {
        clearInterval(animationInterval);
        setVerificationInProgress(false); // Fin de la simulación de verificación
        onNextStep(); // Avanzar automáticamente al paso 4 después de 4 segundos
      }
    }, interval);

    return () => {
      clearInterval(animationInterval);
    };
  }, [onNextStep]);

  return (
    <div>
      <div className="flex items-center justify-center mb-4">
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white mr-2">
          3
        </div>
        <h2 className="text-lg sm:text-xl font-semibold">
          Espera a que el sistema realice la verificación.
        </h2>
      </div>
      <p className="text-gray-700 mb-4">
        Nuestro sistema analizará la imagen utilizando la inteligencia
        artificial para verificar la autenticidad del documento cargado.
      </p>
      {verificationInProgress ? (
        <div className="flex items-center flex-col">
          
          <FaSpinner className="animate-spin text-blue-500 w-32 h-32 mt-8" />
          <p className="text-xs text-gray-500 mt-4">Esto puede tardar unos minutos...</p>
        </div>
      ) : null}
      <div className="relative mt-6">
        <div className="flex h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-blue-500 rounded"
            style={{ width: `${progress}%` }} // Barra de progreso con animación
          ></div>
        </div>
      </div>
    </div>
  );
}

export default VerifyStep3;
