/* eslint-disable react/prop-types */
import { GiPadlock } from "react-icons/gi";
import { HiUser } from "react-icons/hi";
import { useState } from "react";
import Select from "react-select";
function ModalInfoGeneral({ data }) {
  const [formData, setFormData] = useState({
    name: data.name,
    lastName: data.lastName,
    username: data.username,
    gender: data.gender,
  });

  console.log(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("enviando...");
    console.log(formData);
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
          General Information
        </h2>
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="m-4 flex">
            <div className="w-2/4 ">
              <div className="p-2 text-xl flex">
                <HiUser className="m-1 mr-4" />
                <p>Name:</p>
              </div>
              <div className="p-2 text-xl flex">
                <HiUser className="m-1 mr-4" />
                <p>Last name:</p>
              </div>
              <div className="p-2 text-xl flex">
                <HiUser className="m-1 mr-4" />
                <p>Username:</p>
              </div>
              <div className="p-2 text-xl flex">
                <HiUser className="m-1 mr-4" />
                <p>Gender:</p>
              </div>
              <div className="p-2 text-xl flex">
                <GiPadlock className="m-1 mr-4 text-red-600" />
                <p className="text-red-600">Role:</p>
              </div>
            </div>
            <div className="w-2/4">
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
                className="p-2 text-xl text-blue-700 font-semibold "
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
            value="Save changes"
          />
        </form>
      </div>
    </div>
  );
}

export default ModalInfoGeneral;
