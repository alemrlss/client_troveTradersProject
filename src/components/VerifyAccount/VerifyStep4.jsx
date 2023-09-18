/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function VerifyStep4({ onIntroStep, verificationSuccess }) {
  const [progress, setProgress] = useState(75);
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    const animationDuration = 1000; // Duración de la animación en milisegundos
    const interval = 10; // Intervalo de actualización en milisegundos
    const targetProgress = 100; // Porcentaje objetivo de progreso

    let currentProgress = 75;
    const increment = (targetProgress - 75) / (animationDuration / interval);

    const animationInterval = setInterval(() => {
      if (currentProgress < targetProgress) {
        currentProgress += increment;
        setProgress(currentProgress);
      } else {
        clearInterval(animationInterval);
        setVerificationComplete(true); // Fin de la animación de progreso
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
          4
        </div>
        <h2 className="text-lg sm:text-xl font-semibold">
          Recibirás una respuesta instantánea con el resultado.
        </h2>
      </div>
      <p className="text-gray-700 mb-4">
        La inteligencia artificial procesará rápidamente el documento y te
        notificará por la plataforma y por correo electrónico el resultado de la
        verificación.
      </p>
      {verificationComplete && (
        <div className=" top-0 left-0 right-0 bottom-0 flex items-center justify-center animate-fade animate-duration-1000 animate-delay-0">
          {verificationSuccess ? (
            <FaCheckCircle className="text-green-500 w-32 h-32" />
          ) : (
            <FaTimesCircle className="text-red-500 w-32 h-32" />
          )}
        </div>
      )}
      <div className="relative mt-4"></div>
      {verificationComplete && (
        <div className="text-center mt-4 animate-fade animate-duration-1000 animate-delay-0">
          {verificationSuccess ? (
            <>
              <p className="text-green-500 font-semibold">
                Tu cuenta ha sido verificada con éxito.
              </p>
              <p>
                Ahora tendrás acceso a comprar y vender en toda la aplicación.
              </p>
            </>
          ) : (
            <>
              <p className="text-red-500 font-semibold">
                No se pudo verificar el documento.
              </p>
              <p>
                Por favor, verifica que el documento sea legible y esté en
                formato JPEG o PNG.
              </p>
            </>
          )}
          {verificationSuccess ? (
            <button className="bg-secondary-100 mb-2 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 transition-colors duration-300">
              <Link to="/home"> Finalizar</Link>
            </button>
          ) : (
            <button
              onClick={() => {
                onIntroStep();
              }}
              className="bg-secondary-100 mb-2 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 transition-colors duration-300"
            >
              Volver a la introduccion
            </button>
          )}
        </div>
      )}
      <div className="flex h-2 bg-gray-200 rounded">
        <div
          className={`h-full ${
            verificationComplete
              ? verificationSuccess
                ? "bg-green-500"
                : "bg-red-500"
              : "bg-blue-500"
          } rounded`}
          style={{ width: `${progress}%` }} // Barra de progreso con animación
        ></div>
      </div>
    </div>
  );
}

export default VerifyStep4;
