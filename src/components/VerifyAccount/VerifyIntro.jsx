/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaFileAlt } from "react-icons/fa";

import { getDataUser } from "../../services/Auth";

function VerifyIntro({
  onNextStep,
  verificationSimulator,
  setVerificationSimulator,
}) {
  const name = getDataUser().name;
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [expandedStep, setExpandedStep] = useState(null);

  const toggleVerificationForm = () => {
    setShowVerificationForm(!showVerificationForm);
    setExpandedStep(null); // Oculta los pasos cuando se muestra el formulario
    onNextStep();
  };

  const toggleStep = (stepIndex) => {
    setExpandedStep(expandedStep === stepIndex ? null : stepIndex);
  };

  const toggleVerificationSimulator = () => {
    // Cambiar el estado del simulador al hacer clic en el botón de switch
    setVerificationSimulator(!verificationSimulator);
  };

  const steps = [
    {
      title: "Selecciona un documento de identidad válido.",
      details:
        "Escoge un documento oficial que contenga tu fotografía y datos personales.(ej: Cedula, Pasaporte)",
    },
    {
      title: "Carga la imagen de tu documento en el formulario.",
      details:
        "Sube una foto clara y legible de tu documento en formato JPEG o PNG.",
    },
    {
      title: "Espera a que el sistema realice la verificación.",
      details:
        "Nuestro sistema analizará la imagen utilizando la inteligencia artificial para verificar la autenticidad del documento cargado.",
    },
    {
      title: "Recibirás una respuesta instantanea con el resultado.",
      details:
        "La inteligencia artificial procesará rápidamente el documento y te notificara por la plataforma y por correo electronico el resultado de la verificacion",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-start mb-4">
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={verificationSimulator}
              onChange={toggleVerificationSimulator}
            />
            <div
              className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner ${
                verificationSimulator ? "bg-blue-500" : ""
              } transition-colors duration-300 ease-in-out ${
                verificationSimulator ? "bg-blue-600" : ""
              }`}
            ></div>
            <div
              className={`absolute inset-y-0 left-0 w-6 h-6 transition-transform duration-300 ease-in-out transform ${
                verificationSimulator
                  ? "translate-x-full bg-blue-500 border-blue-500"
                  : ""
              } bg-white border rounded-full shadow-md`}
            ></div>
          </div>
        </label>
      </div>
      <div className="flex items-center justify-center mb-4">
        <FaFileAlt className="text-blue-500 w-8 h-8 mr-2" />
        <h2 className="text-lg sm:text-xl font-semibold">
          ¡Verificación de tu Cuenta!
        </h2>
      </div>
      <p className="text-gray-700 mb-4">
        <strong>{name}</strong>, antes de comenzar a comprar y vender objetos
        coleccionables, necesitamos verificar tu identidad. Esto nos ayuda a
        mantener un entorno seguro para todos los usuarios.
      </p>
      <div className="flex flex-col space-y-2">
        {steps.map((step, index) => (
          <div
            key={index}
            onClick={() => toggleStep(index)}
            className={`p-2 rounded cursor-pointer ${
              expandedStep === index ? "bg-blue-200" : "bg-white"
            }`}
          >
            <div className="flex items-center">
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white mr-2">
                {index + 1}
              </div>
              <div>{step.title}</div>
            </div>
            {expandedStep === index && (
              <div className="text-gray-500 mt-2 animate-flip-down animate-duration-300 animate-delay-0">
                {step.details}
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={toggleVerificationForm}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mt-4 transition-colors duration-300"
      >
        Comenzar con la Verificación
      </button>
    </div>
  );
}

export default VerifyIntro;
