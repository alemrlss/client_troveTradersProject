import { useState } from "react";
import { loginBackend } from "../../services/Auth";
import { useAuthContext } from "../../contexts/authContext";
import { Link } from "react-router-dom";

function LoginComponent() {
  const { login } = useAuthContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

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
    <section className="bg-primary-100 opacity- min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
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
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium"
            >
              Contraseña
            </label>
            <input
              name="password"
              onChange={handleInputChange}
              type="password"
              className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-secondary-100"
              placeholder="Tu Contraseña"
              required
            />
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-100 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
      </div>
    </section>
  );
}

export default LoginComponent;
