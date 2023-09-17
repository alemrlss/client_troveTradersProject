import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getDataUser } from '../../services/Auth';

function EditPassword(data) {
  const [userData, setUserData] = useState(data);
  const idUser = getDataUser().id

  const [formData, setformData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [response, setResponse] = useState('');

  const handleInputChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password === "" || formData.newPassword === "" || formData.confirmPassword === "") {
      setError("Por favor completa todos los campos.");
      return;
    }
  
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las claves no son iguales.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:3001/users/edit-password",
        {
          password: formData.password,
          email: userData.data.email
        }
      );
          /*Si la clave es correcta*/
      if (response.data === true) {
        const updateResponse = await axios.put(
          'http://localhost:3001/users/',
          {
            password: formData.NewPassword,
          }
        );
        console.log('La clave ha sido cambiada:', updateResponse.data);
      } else {
        setError("Ha sucedido un error. Intenta de nuevo.");
        console.log('Respuesta API:', response.data);
      }
    } catch (error) {
        setError("Error, intenta de nuevo.");
        console.log('Respuesta API:', response.data);
    }

    const validatePassword = (password) => {
      // Validación de contraseña utilizando una expresión regular
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return passwordRegex.test(password);
    };
  };


  return (
      <section className="bg-logo-100 py-10">
      <div className="flex flex-col items-center justify-center px-6 mx-auto g:py-0 ">
        <div className="w-full bg-primary-100 rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0 ">
          {" "}
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            {" "}
            {/*Panel principal*/}
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Cambiar la contraseña.
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {" "}
              {/*Contraseña ACTUAL*/}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Tu contraseña actual:
                </label>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  type="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="..."
                />
              </div>
              {/*Contraseña NUEVA*/}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Tu nueva contraseña.
                </label>
                <input
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  type="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="..."
                />
              </div>
               {/*Contraseña CONFIRMADA*/}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Repite tu nueva contraseña.
                </label>
                <input
                  name="confirmPassword"
                  onChange={handleInputChange}
                  value={formData.confirmPassword}
                  type="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="..."
                />
              </div>
              <div className="space-y-4 md:space-y-6">
              <p className="text-red-600">{error}</p>
                <button className="w-full text-white bg-secondary-100 hover:bg-secondary-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                  Acceder
                </button>
                <Link to={`/profile/${idUser}`} className='text-sm font-light text-secondary-200 hover:underline'>Regresar al perfil.</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  ) 
}

export default EditPassword