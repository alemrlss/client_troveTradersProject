/* eslint-disable react/prop-types */
import { GiPadlock } from "react-icons/gi";
import { HiUser } from "react-icons/hi";
import { useState } from "react";
import Select from "react-select";
import axios from "axios";
import { getIdUser } from "../../../services/Auth";

function ModalInfoGeneral({ data, closeModal, handleSaveChanges }) {
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
    <div>
      <div className="flex flex-col">
        <h2 className="text-center text-2xl font-bold p-4">
          Información General
        </h2>
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="m-4 flex flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <div className="p-2 text-xl flex">
                <HiUser className="m-1 mr-4" />
                <p>Nombre:</p>
              </div>
              <div className="p-2 text-xl flex">
                <HiUser className="m-1 mr-4" />
                <p>Apellido:</p>
              </div>
              <div className="p-2 text-xl flex">
                <HiUser className="m-1 mr-4" />
                <p>Nombre de usuario:</p>
              </div>
              <div className="p-2 text-xl flex">
                <HiUser className="m-1 mr-4" />
                <p>Género:</p>
              </div>
              <div className="p-2 text-xl flex">
                <GiPadlock className="m-1 mr-4 text-red-600" />
                <p className="text-red-600">Rol:</p>
              </div>
            </div>
            <div className="w-full md:w-2/3 mt-4 md:mt-0 md:ml-4">
              <input
                type="text"
                value={formData.name}
                className="p-2 text-xl text-blue-700 font-semibold"
                onChange={handleChange}
                name="name"
              />
              <input
                type="text"
                value={formData.lastName}
                className="p-2 text-xl text-blue-700 font-semibold"
                onChange={handleChange}
                name="lastName"
              />
              <input
                type="text"
                value={formData.username}
                className="p-2 text-xl text-blue-700 font-semibold"
                onChange={handleChange}
                name="username"
              />
              <Select
                defaultValue={optionSelected}
                isClearable
                options={options}
                onChange={handleChangeSelect}
              />
              <p className="p-2 text-xl text-red-700 font-semibold">
                {data.role}
              </p>
            </div>
          </div>
          <input
            type="submit"
            className="bg-green-600 relative p-3 text-white font-bold m-1"
            value="Guardar cambios"
          />
        </form>
      </div>
    </div>
  );
}

export default ModalInfoGeneral;
