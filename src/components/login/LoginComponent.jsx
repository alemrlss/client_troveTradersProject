import { useState } from "react";
import { loginBackend } from "../../services/Auth";
import { useAuthContext } from "../../contexts/authContext";
import { Link } from "react-router-dom";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { RiAdminFill } from "react-icons/ri";

function LoginComponent() {
  const { login } = useAuthContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones del frontend
    if (!validateEmail(formData.email)) {
      setError("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError(
        "La contraseña debe contener al menos 8 caracteres y contener letras y números."
      );
      return;
    }

    loginBackend(formData.email, formData.password).then((res) => {
      if (res.status === 200 || res.status === 201) {
        login();
      } else {
        setError(res.message);
      }
    });
  };

  const validateEmail = (email) => {
    // Validación de correo electrónico utilizando una expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Validación de contraseña utilizando una expresión regular
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <section className="bg-logo-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg ">
        <div className="text-center">
          <img
            className="mx-auto w-20 h-20"
            src="src/assets/img/logoAlejandro.png"
            alt="Logo"
          />
          <h2 className="mt-4 text-3xl font-semibold text-gray-900">
            Iniciar Sesión
          </h2>
        </div>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium"
            >
              Correo Electrónico
            </label>
            <input
              name="email"
              onChange={handleInputChange}
              type="email"
              className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-secondary-100"
              placeholder="Tu correo"
              required
            />
          </div>
          <div className="relative mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                name="password"
                onChange={handleInputChange}
                type={showPassword ? "text" : "password"}
                className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-secondary-100"
                placeholder="Tu Contraseña"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
              </button>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-red-600">{error}</p>
            <Link
              to="/forgot-password"
              className="text-sm font-light text-secondary-200 hover:underline"
            >
              Has olvidado la contraseña?
            </Link>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-100 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Acceder
            </button>
          </div>
        </form>
        <p className="mt-4 text-sm font-light text-gray-500">
          No tienes cuenta?{" "}
          <Link
            to="/register"
            className="font-medium text-secondary-200 hover:underline"
          >
            Regístrate
          </Link>
        </p>
        <Link to="http://localhost:5174/login" target="_blank">
          <button className="fixed top-4 right-4 bg-secondary-100 text-white py-4 px-4 rounded-full hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <RiAdminFill size={24} />{" "}
          </button>
        </Link>
      </div>
    </section>
  );
}

export default LoginComponent;
