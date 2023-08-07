/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import { getIdUser } from "../../../services/Auth";
import { HiUser } from "react-icons/hi";
import { GiPadlock } from "react-icons/gi";

function ModalEditUser({ isOpen, closeModal, data, handleSaveChanges }) {
  const handleCloseModal = () => {
    // IMPLEMENTAR LÓGICA PARA MOSTRAR OTRO MODAL PREGUNTANDO SI EL USUARIO ESTÁ SEGURO DE SALIR
    closeModal();
  };

  const [formData, setFormData] = useState({
    name: data.name,
    lastName: data.lastName,
    username: data.username,
    gender: data.gender,
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); //formData que se envia a la peticion!

    axios
      .put(`http://localhost:3001/users/${getIdUser()}`, formData)
      .then((response) => {
        console.log(response.data);
        handleSaveChanges(formData);
      })
      .catch((error) => {
        console.log(error.data);
      });
    closeModal();
  };

  const options = [
    { value: "unknown", label: "Unknown" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  let optionSelected = options[0];
  if (data.gender === options[1].value) {
    optionSelected = options[1];
  }

  if (data.gender === options[2].value) {
    optionSelected = options[2];
  }

  const handleChangeSelect = (selectedOption) => {
    console.log(selectedOption);
    setFormData({
      ...formData,
      gender: selectedOption.value,
    });
  };

  return (
    <article
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${
        isOpen ? "block" : "hidden"
      } `}
    >
      <div className=" bg-primary-500 p-6 rounded-md w-full max-w-md animate-fade-up animate-once animate-duration-1000 animate-delay-0 animate-ease-in-out  ">
        <h1 className="text-4xl mb-4">Editar perfil</h1>
        <div className="flex flex-col">
          <h2 className="text-center text-2xl font-bold p-4">
            Información General
          </h2>
          <form className="flex flex-col items-center" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-1" htmlFor="name">
                <HiUser className="inline-block mr-2" />
                Nombre:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
                placeholder="Ingrese su nombre"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-lg font-medium mb-1"
                htmlFor="lastName"
              >
                <HiUser className="inline-block mr-2" />
                Apellido:
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
                placeholder="Ingrese su apellido"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-lg font-medium mb-1"
                htmlFor="username"
              >
                <HiUser className="inline-block mr-2" />
                Nombre de usuario:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
                placeholder="Ingrese su nombre de usuario"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-lg font-medium mb-1"
                htmlFor="gender"
              >
                <GiPadlock className="inline-block mr-2 text-red-600" />
                Género:
              </label>
              <Select
                defaultValue={optionSelected}
                isClearable
                options={options}
                onChange={handleChangeSelect}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <button
                className="bg-red-600 relative p-3 text-white font-bold m-1"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
              <input
                type="submit"
                className="bg-green-600 relative p-3 text-white font-bold m-1"
                value="Guardar cambios"
              />
            </div>
          </form>
        </div>
      </div>
    </article>
  );
}

export default ModalEditUser;
