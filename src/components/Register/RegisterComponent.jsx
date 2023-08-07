import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterComponent() {
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [sucess, setSucess] = useState("");

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
        password: formData.password,
      })
      .then((response) => {
        console.log(response);
        setSucess(
          `${formData.name} ${formData.lastName} registrado con éxito. Redireccionando al Login..`
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
    setformData({ ...formData, [name]: value });
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
    <section className="bg-white">
      {" "}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 mt-6 text-2xl font-semibold text-gray-900"
        >
          <img
            className="w-20 h-20 mr-2"
            src="src\assets\img\logo.png"
            alt="logo"
          />
          TroveTraders
        </a>{" "}
        {/*Panel principal*/}
        <div className="w-full bg-primary-200 rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0 mb-6">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              {" "}
              Crear Cuenta
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              action="#"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Nombre:
                </label>
                <input
                  type="name"
                  name="name"
                  id="name"
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Tu nombre"
                  required=""
                  autoComplete="off"
                />
              </div>
              <div>
                <label
                  htmlFor="lastname"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Apellido:
                </label>
                <input
                  type="lastname"
                  name="lastName"
                  id="lastName"
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Tu apellido"
                  required=""
                  autoComplete="off"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Tu Correo
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="correo@correo.com"
                  required=""
                />
              </div>
              <div>
                {" "}
                {/*Arreglar esto el match de ambas contrase;as*/}
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required=""
                />
              </div>
              <div className="flex items-start">
                {" "}
                {/*Una funcion que revise si este checkbox esta presionado, o eliminarlo si no lo necesitamos*/}
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                    required=""
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-light text-gray-500">
                    Acepto los
                    <a
                      className="font-medium text-primary-600 hover:underline "
                      href="#"
                    >
                      {" "}
                      Terminos y Condiciones
                    </a>
                  </label>{" "}
                  {/*Hacer esto*/}
                </div>
              </div>{" "}
              {/*Boton*/}
              <p className="text-red-500">{error}</p>
              <p className="text-green-500">{sucess}</p>
              <button
                type="submit"
                className="w-full text-white bg-primary-100 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Crear una cuenta
              </button>
              <p className="text-sm font-light text-gray-500">
                Ya tienes una cuenta?
                <a
                  href="/login"
                  className="font-medium text-primary-600 hover:underline"
                >
                  {" "}
                  Conectate aqui
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegisterComponent;
