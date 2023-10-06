/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
function RegistroComponent({ user }) {
  const [formData, setFormData] = useState({
    gender: "",
    phone: "",
    address: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phonePattern = /^\d{11}$/;
    if (!phonePattern.test(formData.phone)) {
      alert("El teléfono debe tener 11 números.");
      return;
    }
    if (formData.address.length > 60) {
      alert("La dirección no puede tener más de 60 caracteres.");
      return;
    }
    console.log(`Enviando datos... ${formData}`);
    try {
      // Envía los datos al backend utilizando Axios
      await axios.post(
        `http://localhost:3001/users/${user._id}/completeRegister`,
        formData
      );

      // Establece un mensaje de éxito
      setSuccessMessage("Registro completado con éxito.");
    } catch (error) {
      console.error("Error al completar el registro:", error);
      setErrorMessage("Ocurrió un error al completar el registro.");
    }
  };

  if (user.registrationCompleted) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="mx-auto max-w-lg p-6 flex flex-col bg-white shadow-xl ">
        <h2 className="text-2xl font-bold mb-4">Completar Registro</h2>
        {successMessage && (
          <div className="bg-green-200 text-green-800 p-3 mb-4 rounded-md">
            {successMessage}
            <Link
              to={"/home"}
              className="text-green-700 font-semibold ml-2 hover:underline focus:outline-none"
            >
              Ir al Inicio
            </Link>
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-200 text-red-800 p-3 mb-4 rounded-md">
            {errorMessage}
          </div>
        )}
        <p className="text-gray-600 mb-4">
          Antes de comenzar a disfrutar de los beneficios de la aplicación, es
          necesario completar el registro.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block text-gray-700 font-semibold"
            >
              Género:
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md bg-white text-gray-800 focus:outline-none focus:border-primary-500"
            >
              <option value="">Seleccione</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-gray-700 font-semibold"
            >
              Teléfono:
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="Ej: 04129642465"
              maxLength="11"
              pattern="\d{11}"
              title="El teléfono debe tener 11 números."
              className="w-full px-3 py-2 border rounded-md bg-white text-gray-800 focus:outline-none focus:border-primary-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="address"
              className="block text-gray-700 font-semibold"
            >
              Dirección:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              maxLength="60"
              placeholder="Av 12 con calle 79...."
              className="w-full px-3 py-2 border rounded-md bg-white text-gray-800 focus:outline-none focus:border-primary-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-secondary-100 text-white font-semibold py-2 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Completar Registro
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistroComponent;
