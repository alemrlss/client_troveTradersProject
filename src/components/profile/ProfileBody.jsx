/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { getDataUser } from "../../services/Auth";
import ModalEditUser from "../Modals/ModalEditUser/ModalEditUser";
import { useModal } from "../../hooks/useModal";
import img from "../../assets/img/logoAlejandro.png";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import axios from "axios";
import { Link } from "react-router-dom";
import { BsCamera, BsNutFill } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import { FaLock, FaUserEdit, FaUserShield } from "react-icons/fa"; // O cualquier otro icono de react-icons que necesites
import { Navigate } from "react-router-dom";
function ProfileBody({ data, user }) {
  const profileOptions = {
    about: "about",
    trades: "trades",
  };

  const [userData, setUserData] = useState(data); //data del usuario.
  const idUser = getDataUser().id;

  console.log(userData);
  const handleSaveChanges = (updatedData) => {
    setUserData(updatedData);
  };

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const handleMenuClick = (e) => {
    // Obtener la posición del icono
    const iconPosition = e.currentTarget.getBoundingClientRect();

    // Calcular la posición del menú a la izquierda del icono
    const top = iconPosition.bottom + window.scrollY;
    const left = iconPosition.left + window.scrollX - menuWidth; // Resta el ancho del menú

    // Actualizar el estado del menú y su posición
    setIsMenuVisible(!isMenuVisible);
    setMenuPosition({ top, left });
  };

  const [arePrivateDataHidden, setArePrivateDataHidden] = useState(false);

  // Antes de devolver el JSX, calcula el ancho del menú
  const menuWidth = 300; // Cambia esto al ancho deseado para tu menú

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

  function formatTimestamp(timestamp) {
    const options = { year: "numeric", month: "long" };
    return new Date(timestamp).toLocaleDateString("es-ES", options);
  }
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async () => {
    if (selectedImage) {
      if (selectedImage) {
        // Crear un objeto FormData
        const formData = new FormData();
        formData.append("imageProfile", selectedImage);

        try {
          // Realizar la solicitud POST para cargar la imagen
          const response = await fetch(
            `http://localhost:3001/users/${getDataUser().id}/imageProfile`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (response.ok) {
            // La imagen se ha cargado correctamente
            // Actualizar la imagen de perfil en tu estado
            // Cambiar setIsEditingImage(false) para ocultar el formulario de carga
            setIsEditingImage(false);
            window.location.reload();
          } else {
            // Manejar el caso en que la carga de imagen falla
            console.error("Error al cargar la imagen");
          }
        } catch (error) {
          // Manejar errores de red u otros errores
          console.error("Error de red:", error);
        }
      }
    }
  };
  const handleEditImageClick = () => {
    setIsEditingImage(true);
  };

   //!Verificacion de cuenta bloqueada:
   const [redirectToCompletionBlocked, setRedirectToCompletionBlocked] =
   useState(!user.blocked);

 useEffect(() => {
   if (!user.redirectToCompletionBlocked) {
     setRedirectToCompletionBlocked(true);
   }
 }, [user.redirectToCompletionBlocked]);

 if (!redirectToCompletionBlocked) {
   return <Navigate to="/bloqueado" />;
 }
 
  //!Verificacion de terminar el registro:
  const [redirectToCompletion, setRedirectToCompletion] = useState(
    user.registrationCompleted
  );
  useEffect(() => {
    // Verificar si registrationCompleted es false
    if (!user.registrationCompleted) {
      // Redirigir al formulario de completar información
      setRedirectToCompletion(true);
    }
  }, [user.registrationCompleted]);

  if (!redirectToCompletion) {
    return <Navigate to="/registro" />;

    
  }
  
  return (
    <div className="">
      <div>
        {/* Mensaje de verificación de correo electrónico */}
        {!verificationEmailUser && (
          <div className=" text-sm flex items-center justify-center">
            <p className="text-sm">
              Por favor, verifica tu correo electrónico para acceder a todas las
              funciones de la aplicación.
            </p>

            {emailSend && (
              <p className="text-secondary-100 underline font-bold text-lg py-2 ml-2 animate-fade animate-once animate-duration-500 animate-delay-0 animate-ease-linear">
                ¡Correo enviado con éxito a: {user.email}!
              </p>
            )}
            {!emailSend && (
              <button
                className="bg-secondary-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2"
                onClick={handleSendEmailVerification}
              >
                Enviar correo de verificación
              </button>
            )}
          </div>
        )}
      </div>
      <div className="container mx-auto pb-5 mb-14 mt-2 animate-fade animate-once animate-duration-500 animate-delay-0 animate-ease-linear">
        <ModalEditUser
          isOpen={isOpenModalEdit}
          closeModal={closeModalEdit}
          data={userData}
          handleSaveChanges={handleSaveChanges}
        />
        <div className="md:flex no-wrap md:-mx-2 ">
          <div className="w-full md:w-3/12 md:mx-2">
            {/*TARJETA IZUIQERDA. */}
            <div className="bg-white p-3 border-t border-r border-b border-l ">
              <div className=" flex justify-center items-center">
                <img
                  className="border-solid rounded-full h-64 w-64"
                  src={
                    data.imageProfile
                      ? `http://localhost:3001/image/profile/${data.imageProfile}`
                      : img
                  }
                  alt="Imagen de Perfil"
                />
              </div>

              <div className="flex justify-between">
                <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                  @{userData.username}
                </h1>
                {canEdit && (
                  <button
                    data-tooltip-id="my-tooltip-agregar-imagen"
                    data-tooltip-content="Agregar imagen de perfil"
                    onClick={handleEditImageClick}
                    className="bg-transparent p-2 flex justify-end items-center text-black rounded-full hover:bg-gray-300"
                  >
                    <BsCamera size={18} />
                  </button>
                )}

                <Tooltip
                  id="my-tooltip-agregar-imagen"
                  style={{
                    backgroundColor: "rgba(141, 61, 58, 0.8)",
                    color: "#fff",
                  }}
                />
              </div>
              {isEditingImage ? (
                <div className="flex flex-col items-center space-y-1 m-1 p-1 bg-gray-100 rounded-lg animate-fade-down animate-duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                    className="border border-gray-300 w-5/6"
                  />
                  <button
                    onClick={handleImageUpload}
                    className="bg-secondary-100 w-3/6 hover:opacity-90 text-white font-bold py-1 rounded"
                  >
                    Cargar imagen
                  </button>
                </div>
              ) : null}

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
                  <span className="ml-auto text-sm">{finalFormattedDate}</span>
                </li>
              </ul>
            </div>

            <div className="my-4"></div>
          </div>

          <div className="w-full md:w-9/12 mx-2 h-64 border-t border-r border-l">
            {/*INFORMACION USUARIO. */}
            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="flex items-center justify-between space-x-2 font-semibold text-gray-900 leading-8">
                <div className="flex items-center">
                  {" "}
                  <span className="text-primary-200">
                    <svg
                      className="h-8"
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
                  <span className=" ml-2 tracking-wide">
                    Informacion del Usuario:
                  </span>
                </div>
                {canEdit && (
                  <button
                    onClick={handleMenuClick}
                    className="bg-transparent p-2 flex justify-end items-center text-black rounded-full hover:bg-gray-300"
                  >
                    <BsNutFill size={18} />
                  </button>
                )}

                {isMenuVisible && (
                  <div
                    className="bg-white z-50 absolute shadow-md rounded-md animate-fade-down animate-duration-500"
                    style={{
                      top: `${menuPosition.top}px`,
                      left: `${menuPosition.left}px`,
                      width: `${menuWidth}px`, // Establece el ancho del menú
                    }}
                  >
                    <ul>
                      <li>
                        <Link to={`/edit-password/${idUser}`}>
                          <button className="py-2 px-4 text-gray-800 hover:bg-gray-200 w-full text-left flex items-center">
                            <FaLock className="mr-2" /> Cambiar contraseña.
                          </button>
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setIsMenuVisible(false);
                          }}
                          className="py-2 px-4 text-gray-800 hover:bg-gray-200 w-full text-left flex items-center"
                        >
                          <FaUserEdit className="mr-2" /> Editar perfil
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setArePrivateDataHidden(!arePrivateDataHidden);
                            setIsMenuVisible(false);
                          }}
                          className={`py-2 px-4 hover:bg-gray-200 w-full text-left flex items-center ${
                            arePrivateDataHidden
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          <FaUserShield className="mr-2" />
                          {arePrivateDataHidden
                            ? "Mostrar Datos confidenciales"
                            : "Ocultar Datos confidenciales"}
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
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
                    <div className={`px-4 py-2`}>{userData.gender}</div>{" "}
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">
                      Numero Telefonico:
                    </div>
                    <div
                      className={`px-4 py-2 ${
                        arePrivateDataHidden ? "text-red-500" : ""
                      }`}
                    >
                      {arePrivateDataHidden ? "********" : userData.phone}
                    </div>{" "}
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Direccion:</div>
                    <div
                      className={`px-4 py-2 ${
                        arePrivateDataHidden ? "text-red-500" : ""
                      }`}
                    >
                      {arePrivateDataHidden ? "********" : userData.address}
                    </div>{" "}
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Email</div>
                    <div
                      className={`px-4 py-2 ${
                        arePrivateDataHidden ? "text-red-500" : ""
                      }`}
                    >
                      {arePrivateDataHidden ? "********" : userData.email}
                    </div>
                  </div>
                </div>
              </div>
              {user.isVerify ? null : (
                <div className="bg-red-100 border borde r-red-400 my-2 text-red-700 px-4 py-3 rounded  flex flex-col justify-center">
                  <strong className="font-bold text-center">
                    Usuario no verificado
                  </strong>
                  <span className="text-xs text-center">
                    Debes verificar tu cuenta para acceder a todas las acciones
                    de la aplicacion, previamente debes estar verificado por
                    correo
                  </span>
                  <div className="flex justify-center">
                    <Link
                      to={`/verify-account`}
                      className="bg-secondary-300 text-white mt-2 px-4 py-1 w-auto text-base rounded-md text-center"
                    >
                      Verificar Cuenta
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="my-4"></div>
            <div className="bg-white p-3 shadow-sm rounded-sm border-l border-r border-b">
              <div className="grid grid-cols-2">
                <div>
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                    <span className="text-primary-200">
                      <svg
                        className="h-8"
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
                    {userData.tradesFinished.length > 0 ? (
                      userData.tradesFinished.slice(-5).map((trade) => (
                        <li key={trade._id} className="text-sm">
                          <p>{trade.titlePost}</p>
                          <p className="text-xs text-gray-500">
                            {formatTimestamp(trade.createdAt)}
                          </p>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-gray-500">
                        El usuario no ha realizado ningun trade...{" "}
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                    <span className="text-primary-200">
                      <svg
                        className="h-8"
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
                    {userData.ratings.length > 0 ? (
                      userData.ratings.slice(-5).map((rating) => (
                        <li key={rating._id} className="text-sm">
                          <div className="text-xs">
                            {rating.rating}/5 - {rating.comment}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {formatTimestamp(rating.timestamp)}
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-gray-500">
                        Nadie ha calificado al usuario..
                      </li>
                    )}
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
