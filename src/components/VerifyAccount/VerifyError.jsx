
import { FaCheckCircle, FaHome } from "react-icons/fa";

function VerifyError() {
  const redirectToHome = () => {
    window.location.href = "/"; // Redirige a la página de inicio
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-full sm:max-w-md mx-4">
        <div className="flex items-center justify-center mb-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white mr-2">
            <FaCheckCircle className="text-xl" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold">
            Tu cuenta ha sido verificada previamente.
          </h2>
        </div>
        <p className="text-gray-700 mb-4">
          ¡Felicitaciones! Tu cuenta ha sido verificada y ya puedes disfrutar de
          todos los beneficios de nuestra plataforma.
        </p>
        <div className="flex justify-center mb-4">
          <FaHome className="text-blue-500 w-32 h-32" />
        </div>
        <button
          onClick={redirectToHome}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mt-4 transition-colors duration-300"
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
}

export default VerifyError;
