import axios from "axios";
import { useState } from "react";

function LoginComponent() {
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
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

    axios
      .post("http://localhost:3001/auth/login", {
        email: formData.email,
        password: formData.password,
      })
      .then((response) => {
        //RESPUESTA CORRECTA
        console.log(response);
      })
      .catch((err) => {
        const status = err.response.data.statusCode;
        // MANEJAR AQUI EL ERROR DE USUARIO NO ENCONTRADO Y CLAVE INCORRECTA
        if (err.response) {
          if (status === 404) {
            setError("User Not Found");
          } else if (status === 403) {
            setError("Password Incorrect");
          } else {
            setError("Error during login");
          }
        } else {
          setError("Connection error");
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
    <div>
      <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
        <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl shadow-blue-400  ring-2 ring-gray-700 lg:max-w-xl">
          <div className="flex flex-row items-center">
            <h1 className="w-3/4 text-4xl font-bold text-center text-blue-500 underline uppercase decoration-slice">
              Sign in
            </h1>
          </div>

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800"
              >
                Email
              </label>
              <input
                name="email"
                onChange={handleInputChange}
                type="email"
                className="block w-full px-4 py-2 mt-2 text-bacl bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800"
              >
                Password
              </label>
              <input
                name="password"
                onChange={handleInputChange}
                type="password"
                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              <p className="text-red-500">{error}</p>
            </div>
            <a href="#" className="text-xs text-blue-500 hover:underline">
              Forget Password?
            </a>
            <div className="mt-6">
              <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                Login
              </button>
            </div>
          </form>

          <p className="mt-8 text-xs font-light text-center text-gray-700">
            {" "}
            Dont have an account?{" "}
            <a href="#" className="font-medium text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
