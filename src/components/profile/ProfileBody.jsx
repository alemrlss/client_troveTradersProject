/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { getDataUser } from "../../services/Auth";
import ModalEditUser from "../Modals/ModalEditUser/ModalEditUser";
import { useModal } from "../../hooks/useModal";
import img from "../../assets/defaultProfile.png";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import axios from "axios";
import { Link } from "react-router-dom";

function ProfileBody({ data, user }) {
  const profileOptions = {
    about: "about",
    trades: "trades",
  };

  const [userData, setUserData] = useState(data); //data del usuario.

  const handleSaveChanges = (updatedData) => {
    setUserData(updatedData);
  };

  const decorationButton = "border-b-4 border-green-800";
  const [isClicked, setisClicked] = useState(profileOptions.about);
  const [classButtonAbout, setClassButtonAbout] = useState(decorationButton);
  const [classButtonTrades, setClassButtonTrades] = useState("");
  const [canEdit, setCanEdit] = useState(false);

  const [verificationEmailUser] = useState(user.verificationEmail);
  const [emailSend, setEmailSend] = useState(false);

  const [isOpenModalEdit, openModalEdit, closeModalEdit] = useModal(false);
  const handleButtons = (e) => {
    setisClicked(e.target.textContent.toLowerCase());

    if (e.target.textContent.toLowerCase() === profileOptions.about) {
      setClassButtonTrades("");
      setClassButtonAbout(decorationButton);
    }
    if (e.target.textContent.toLowerCase() === profileOptions.trades) {
      setClassButtonAbout("");
      setClassButtonTrades(decorationButton);
    }
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  console.log(userData.createdAt);
  const formattedDate = format(new Date(userData.createdAt), "MMMM d, yyyy", {
    locale: es,
  });
  const formattedMonth = capitalizeFirstLetter(formattedDate.split(" ")[0]);
  const finalFormattedDate = `${formattedMonth} ${formattedDate
    .split(" ")
    .slice(1)
    .join(" ")}`;

  useEffect(() => {
    if (userData._id === getDataUser().id) {
      setCanEdit(true);
    }
  }, [userData._id]);

  const handleSendEmailVerification = async () => {
    try {
      // Realizar la solicitud al endpoint del backend para enviar el correo de verificación
      const response = await axios.post(
        "http://localhost:3001/auth/verification-email",
        {
          email: user.email,
        }
      );

      // Manejar la respuesta del backend si es necesario (por ejemplo, mostrar una notificación de éxito)
      console.log(response.data);
      setEmailSend(true);
    } catch (error) {
      // Manejar el error si ocurriera algún problema con la solicitud al backend
      console.error(
        "Error al enviar el correo de verificación:",
        error.message
      );
    }
  };

  return (
    <div>
      <div>
        {/* Mensaje de verificación de correo electrónico */}
        {!verificationEmailUser && (
          <div className="ml-8 text-sm flex items-center">
            <p className="text-sm">
              Por favor, verifica tu correo electrónico para acceder a todas las
              funciones de la aplicación.
            </p>

            {emailSend && (
              <p className="text-green-600 font-bold text-lg">
                ¡Correo enviado con éxito a: {user.email}!
              </p>
            )}
            {!emailSend && (
              <button
                className="bg-primary-100 hover:bg-primary-200 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2"
                onClick={handleSendEmailVerification}
              >
                Enviar correo de verificación
              </button>
            )}
          </div>
        )}
      </div>
      <div className="container mx-auto my-5 p-5 animate-fade animate-once animate-duration-500 animate-delay-0 animate-ease-linear">
        <ModalEditUser
          isOpen={isOpenModalEdit}
          closeModal={closeModalEdit}
          data={userData}
          handleSaveChanges={handleSaveChanges}
        />
        <div className="md:flex no-wrap md:-mx-2 ">
          <div className="w-full md:w-3/12 md:mx-2">
            {/*TARJETA IZUIQERDA. */}
            <div className="bg-white p-3 border-t-4 border-primary-100">
              <div className="image overflow-hidden">
                <img
                  className="height: 200px margin: 0 border-solid rounded-full"
                  src={
                    data.imageProfile
                      ? `http://localhost:3001/image/profile/${data.imageProfile}`
                      : img
                  }
                  alt="Imagen de Perfil"
                />
              </div>
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                {userData.username}
              </h1>
              <h3 className="text-gray-600 font-lg text-semibold leading-6">
                Usuario no verificado
              </h3>
              <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">
                Descripcion sobre verificar usuario, etc....
              </p>
              <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                <li className="flex items-center py-3">
                  <span>Estado</span>
                  <span className="ml-auto">
                    {userData.isVerify ? (
                      <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
                        Verificado
                      </span>
                    ) : (
                      <span className="bg-red-500 py-1 px-2 rounded text-white text-sm">
                        No Verificado
                      </span>
                    )}
                  </span>
                </li>
                <li className="flex items-center py-3">
                  <span>Rating</span>
                  <span className="ml-auto">
                    <span className="bg-yellow-500 py-1 px-2 rounded text-white text-sm">
                      {userData.rating}/5
                    </span>
                  </span>
                </li>
                <li className="flex items-center py-3">
                  <span>Miembro desde</span>
                  <span className="ml-auto">{finalFormattedDate}</span>
                </li>
              </ul>
            </div>

            <div className="my-4"></div>
          </div>

          <div className="w-full md:w-9/12 mx-2 h-64">
            {/*INFORMACION USUARIO. */}
            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <span className="text-primary-200">
                  <svg
                    className="h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <span className="tracking-wide">Informacion del Usuario:</span>
              </div>
              <div className="text-gray-700">
                <div className="grid md:grid-cols-2 text-sm">
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Nombre:</div>
                    <div className="px-4 py-2">{userData.name}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Apellido</div>
                    <div className="px-4 py-2">{userData.lastName}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Genero:</div>
                    <div className="px-4 py-2">{userData.gender}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">
                      Numero Telefonico:
                    </div>
                    <div className="px-4 py-2">????????</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Direccion:</div>
                    <div className="px-4 py-2">?????????</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Email</div>
                    <div className="px-4 py-2">{userData.email}</div>
                  </div>
                </div>
              </div>
              {canEdit && (
                <button
                  className="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4"
                  onClick={openModalEdit}
                >
                  Editar Perfil.
                </button>
              )}
              <Link to={"/forgot-password"}>
                <button className="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">
                  Cambiar contraseña.
                </button>
              </Link>
            </div>

            <div className="my-4"></div>

            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="grid grid-cols-2">
                <div>
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                    <span className="text-primary-200">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </span>
                    <span className="tracking-wide">Ultimos Trades</span>
                  </div>
                  <ul className="list-inside space-y-2">
                    <li>
                      <div>Trade 1</div>
                      <div className="text-gray-500 text-xs">Julio 2023</div>
                    </li>
                    <li>
                      <div>Trade 2</div>
                      <div className="text-gray-500 text-xs">Julio 2023</div>
                    </li>
                    <li>
                      <div>Trade 3</div>
                      <div className="text-gray-500 text-xs">Julio 2023</div>
                    </li>
                    <li>
                      <div>Trade 4</div>
                      <div className="text-gray-500 text-xs">Julio 2023</div>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                    <span className="text-primary-200">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path
                          fill="#fff"
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                        />
                      </svg>
                    </span>
                    <span className="tracking-wide">Ratings</span>
                  </div>
                  <ul className="list-inside space-y-2">
                    <li>
                      <div>Ejemplo</div>
                      <div className="text-gray-500 text-xs">Marzo 2020 </div>
                    </li>
                    <li>
                      <div>4/5</div>
                      <div className="text-gray-500 text-xs">Marzo 2020 </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileBody;
