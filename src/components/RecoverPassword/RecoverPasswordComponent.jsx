import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';


function RecoverPasswordComponent(user) {
    const { token } = useParams();
    const navigate = useNavigate();
    ///????
    const [verificationStatus, setVerificationStatus] = useState("");
    useEffect(() => {
    // Llamar a la función para verificar el token de verificación en el backend
    handleSubmit(token);
  }, [token]); // Agregar token como dependencia para que se ejecute cuando cambie

  const [formData, setformData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (newPassword,confirmPassword) => {
    // Validación de contraseña utilizando una expresión regular
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const isNewPasswordValid = passwordRegex.test(newPassword);
    const isConfirmPasswordValid = passwordRegex.test(confirmPassword);
    return {
      isNewPasswordValid,
      isConfirmPasswordValid,
    };
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  const passwordValidation = validatePassword(formData.newPassword, formData.confirmPassword);

  if (formData.newPassword === "" || formData.confirmPassword === "") {
    setError("Por favor completa todos los campos.");
    return;
  }

  if (!passwordValidation.isNewPasswordValid || !passwordValidation.isConfirmPasswordValid) {
    setError(
      "Las contraseñas deben contener al menos 8 caracteres y contener letras y números."
    );
    return;
  }

  if (formData.newPassword !== formData.confirmPassword) {
    setError("La nueva contraseña debe ser identica.");
    return;
  }

  try {
    const response = await axios.post(
      `http://localhost:3001/auth/edit-password/${user._id}`, 
      {
        id: user._id,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      }
    );
    if (response.data === true) {
      setSuccess('La contraseña ha sido cambiada con exito');
    } 
    if (response.data === false) {
      setError("Contraseña incorrecta. Por favor, intenta de nuevo.");
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        console.log(error);
      } else {
        console.log(error);
      }
    }
  }
};
  return (
    <section className="bg-logo-100 min-h-screen flex items-center justify-center">
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg ">
      <div className="text-center">
        <h2 className="mt-4 text-3xl font-semibold text-gray-900">
          Cambiar la Contraseña.
        </h2>
      </div>
      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="relative mb-4">
          <label
            htmlFor="newPassword"
            className="block text-gray-700 text-sm font-medium"
          >
            Ingresa la nueva contraseña: 
          </label>
          <input
            name="newPassword"
            type={showPassword ? 'text' : 'password'}
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-secondary-100"
            placeholder="Nueva Contraseña"
            required
            value={formData.newPassword}
            onChange={(e) => setformData({ ...formData, newPassword: e.target.value })}
          />
          <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
          </button>
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 text-sm font-medium"
          >
            Ingresa la nueva contraseña de nuevo:
          </label>
          <input
            name="confirmPassword"
            type="password"
            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-secondary-100"
            placeholder="Nueva Contraseña"
            value={formData.confirmPassword}
            onChange={(e) => setformData({ ...formData, confirmPassword: e.target.value })}
            required
          />
        </div>
        <div className='mb-6'>
          <p className="text-red-600">{error}</p>
          <p className='text-green-600'>{success}</p>
        </div>
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-100 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Aceptar
          </button>
        </div>
        <div className='mb-6'>
        </div>
      </form>
    </div>
  </section>
  ) 
}
export default RecoverPasswordComponent