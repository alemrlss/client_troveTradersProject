import { FaExclamationTriangle, FaEnvelope } from "react-icons/fa";
import { getIdUser } from "../../services/Auth";
function VerifyEmailError() {
  const redirectToProfile = (profile) => {
    window.location.href = "/profile/" + profile; // Redirige a la página de inicio
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-full sm:max-w-md mx-4">
        <div className="flex items-center justify-center mb-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white mr-2">
            <FaExclamationTriangle className="text-xl" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold">
            Aún no has verificado tu correo electrónico.
          </h2>
        </div>
        <p className="text-gray-700 mb-4">
          Para verificar tu cuenta, es necesario primero verificar tu correo
          electrónico. Asegúrate de haber recibido el correo de verificación y
          sigue las instrucciones para activar tu cuenta.
        </p>
        <div className="flex justify-center mb-4">
          <FaEnvelope className="text-blue-500 w-32 h-32" />
        </div>
        <button
          onClick={() => {
            redirectToProfile(getIdUser());
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mt-4 transition-colors duration-300"
        >
          Ir al perfil para verificar mi correo
        </button>
      </div>
    </div>
  );
}

export default VerifyEmailError;
