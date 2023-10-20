import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";

function RegisterComponent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones del frontend
    if (!validateEmail(formData.email)) {
      setError("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    if (
      !validatePassword(formData.password) ||
      !validatePassword(formData.confirmPassword)
    ) {
      setError(
        "La contraseña debe contener al menos 8 caracteres y contener letras y números."
      );
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(
        "Las contraseñas no coinciden. Por favor, verifica y vuelve a intentarlo."
      );
      return;
    }

    axios
      .post("http://localhost:3001/auth/register", {
        email: formData.email,
        name: formData.name,
        lastName: formData.lastName,
        username: formData.username,
        password: formData.password,
      })
      .then((response) => {
        console.log(response);
        setSuccess(
          `${formData.name} ${formData.lastName} registrado con éxito. Redireccionando al inicio de sesión..`
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((error) => {
        if (error.response.data.statusCode === 402) {
          setError("Ya existe un usuario con ese correo electrónico.");
        }
      });
  };

  const handleInputChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    <section className="bg-logo-100  min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <img
            className="mx-auto w-20 h-20"
            src="src/assets/img/logoAlejandro.png"
            alt="Logo"
          />
          <h2 className="mt-4 text-3xl font-semibold text-gray-900">
            Crear Cuenta
          </h2>
        </div>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-medium"
              >
                Nombre:
              </label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleInputChange}
                className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-secondary-200"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-gray-700 text-sm font-medium"
              >
                Apellido:
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                onChange={handleInputChange}
                className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-secondary-200"
                placeholder="Tu apellido"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium"
              >
                Tu Correo
              </label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
                className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-secondary-200"
                placeholder="correo@correo.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-gray-700 text-sm font-medium"
              >
                Nombre de Usuario:
              </label>
              <input
                type="text"
                name="username"
                id="username"
                onChange={handleInputChange}
                className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-secondary-200"
                placeholder="Tu nombre de usuario"
                required
              />
            </div>
          </div>
          <div className="relative grid grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-medium"
              >
                Contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                onChange={handleInputChange}
                placeholder="••••••••"
                className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-secondary-200"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
              </button>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 text-sm font-medium"
              >
                Confirmar Contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                onChange={handleInputChange}
                placeholder="••••••••"
                className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-secondary-200"
                required
              />
            </div>
          </div>
          <div className="mb-1 flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                aria-describedby="terms"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-light text-gray-500">
                Acepto los{" "}
                <a
                  className="font-medium text-secondary-200 hover:underline"
                  href="#"
                >
                  Términos y Condiciones
                </a>
              </label>
            </div>
          </div>
          <p className="text-red-500 m-2">{error}</p>
          <p className="text-green-700 m-2">{success}</p>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-100 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Crear una cuenta
            </button>
          </div>
        </form>
        <p className="mt-4 text-sm font-light text-gray-500">
          Ya tienes una cuenta?{" "}
          <a
            href="/login"
            className="font-medium text-secondary-200 hover:underline"
          >
            Conéctate aquí
          </a>
        </p>
      </div>
    </section>
  );
}

export default RegisterComponent;
