import { useState, useEffect } from "react";
import { FaFileImage } from "react-icons/fa";
import axios from "axios";
import { getIdUser } from "../../services/Auth";
function VerifyStep2({
  onNextStep,
  verificationSimulator,
  setVerificationSuccess,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(25);
  const [fileUploaded, setFileUploaded] = useState(false);

  useEffect(() => {
    const animationDuration = 1000; // Duración de la animación en milisegundos
    const interval = 10; // Intervalo de actualización en milisegundos
    const targetProgress = 50; // Porcentaje objetivo de progreso

    let currentProgress = 25;
    const increment = (targetProgress - 25) / (animationDuration / interval);

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileUploaded(true);
  };

  const performDocumentVerification = async () => {
    const formData = new FormData();
    formData.append("document", selectedFile);

    try {
      const response = await axios.post(
        `http://localhost:3001/users/verify/${getIdUser()}/upload-document/${verificationSimulator}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Respuesta de verificación de documento:", response.data);
      setVerificationSuccess(response.data.success);
      onNextStep();
    } catch (error) {
      console.error("Error al verificar el documento:", error);
      // Manejar el error según corresponda
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center mb-4">
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white mr-2">
          2
        </div>
        <h2 className="text-lg sm:text-xl font-semibold">
          Carga la imagen de tu documento en el formulario.
        </h2>
      </div>
      <p className="text-gray-700 mb-4">
        Sube una foto clara y legible de tu documento en formato JPEG o PNG.
      </p>
      <div className="flex justify-center">
        <FaFileImage className="text-blue-500 w-32 h-32" />
      </div>
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleFileUpload}
        className="border p-2 mt-4 w-full"
      />
      {fileUploaded ? (
        <button
          onClick={performDocumentVerification}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mt-4 transition-colors duration-300"
        >
          Siguiente
        </button>
      ) : (
        <button
          className="bg-blue-300 text-white px-4 py-2 rounded cursor-not-allowed w-full mt-4 transition-colors duration-300"
          disabled
        >
          Siguiente
        </button>
      )}
      <div className="relative mt-4">
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

export default VerifyStep2;
