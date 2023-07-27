/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import About from "./About";
import Trades from "./Trades";
import { FiStar } from "react-icons/fi";
import { getDataUser } from "../../services/Auth";
import ModalEditUser from "../Modals/ModalEditUser/ModalEditUser";
import { useModal } from "../../hooks/useModal";
import { FcHighPriority } from "react-icons/fc";
import img from "../../assets/defaultProfile.png";

function ProfileBody({ data }) {
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

  useEffect(() => {
    if (userData._id === getDataUser().id) {
      setCanEdit(true);
    }
  }, [userData._id]);

  return (

    <div class="container mx-auto my-5 p-5">
        <ModalEditUser
        isOpen={isOpenModalEdit}
        closeModal={closeModalEdit}
        data={userData}
        handleSaveChanges={handleSaveChanges}
        />
        <div class="md:flex no-wrap md:-mx-2 ">
            <div class="w-full md:w-3/12 md:mx-2">
                {/*TARJETA IZUIQERDA. */}
                <div class="bg-white p-3 border-t-4 border-primary-100">
                    <div class="image overflow-hidden">
                    <img className="height: 200px margin: 0 border-solid rounded-full" src={data.imageProfile ? `http://localhost:3001/image/profile/${data.imageProfile}` : img} alt="Imagen de Perfil"/>
                    </div>
                    <h1 class="text-gray-900 font-bold text-xl leading-8 my-1">{userData.username}</h1>
                    <h3 class="text-gray-600 font-lg text-semibold leading-6">Usuario no verificado</h3>
                    <p class="text-sm text-gray-500 hover:text-gray-600 leading-6">Descripcion sobre verificar usuario, etc....</p>
                    <ul
                        class="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                        <li class="flex items-center py-3">
                            {/*PONER A FUNCIONAR ESTO O BORRARLO */}
                            <span>Estado</span>
                            <span class="ml-auto"><span
                                    class="bg-red-500 py-1 px-2 rounded text-white text-sm">USUARIO NO VERIFICADO</span></span>
                        </li>
                        <li class="flex items-center py-3">
                            {/*PONER A FUNCIONAR ESTO O BORRARLO */}
                            <span>Miembro desde</span>
                            <span class="ml-auto">Julio 25, 2023</span>
                        </li>
                        <li class="flex items-center py-3">
                            
                            <span>Test</span>
                            <span class="ml-auto">Info</span>
                        </li>
                        <li class="flex items-center py-3">
                            
                            <span>Test</span>
                            <span class="ml-auto">Info</span>
                        </li>
                    </ul>
                </div>

                <div class="my-4"></div>

            </div>

            <div class="w-full md:w-9/12 mx-2 h-64">
                {/*INFORMACION USUARIO. */}
                <div class="bg-white p-3 shadow-sm rounded-sm">
                    <div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                        <span clas="text-green-500">
                            <svg class="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </span>
                        <span class="tracking-wide">Informacion del Usuario:</span>
                    </div>
                    <div class="text-gray-700">
                        <div class="grid md:grid-cols-2 text-sm">
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Nombre:</div>
                                <div class="px-4 py-2">{userData.name}</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Apellido</div>
                                <div class="px-4 py-2">{userData.lastName}</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Genero:</div>
                                <div class="px-4 py-2">{userData.gender}</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Numero Telefonico:</div>
                                <div class="px-4 py-2">0412-1696399</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Direccion:</div>
                                <div class="px-4 py-2">Test</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Email</div>
                                <div class="px-4 py-2">
                                    <a class="text-blue-800" href="mailto:jane@example.com">kevin@ejemplo.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {canEdit && (
                    <button className="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4" onClick={openModalEdit}>Editar Perfil</button>
                     )}
                </div>

                <div class="my-4"></div>

                <div class="bg-white p-3 shadow-sm rounded-sm">

                    <div class="grid grid-cols-2">
                        <div>
                            <div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                                <span clas="text-green-500">
                                    <svg class="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </span>
                                <span class="tracking-wide">Ultimos Trades</span>
                            </div>
                            <ul class="list-inside space-y-2">
                                <li>
                                    <div class="text-teal-600">Trade 1</div>
                                    <div class="text-gray-500 text-xs">Julio 2023</div>
                                </li>
                                <li>
                                    <div class="text-teal-600">Trade 2</div>
                                    <div class="text-gray-500 text-xs">Julio 2023</div>
                                </li>
                                <li>
                                    <div class="text-teal-600">Trade 3</div>
                                    <div class="text-gray-500 text-xs">Julio 2023</div>
                                </li>
                                <li>
                                    <div class="text-teal-600">Trade 4</div>
                                    <div class="text-gray-500 text-xs">Julio 2023</div>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                                <span clas="text-green-500">
                                    <svg class="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path fill="#fff"
                                            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                    </svg>
                                </span>
                                <span class="tracking-wide">Ratings</span>
                            </div>
                            <ul class="list-inside space-y-2">
                                <li>
                                    <div class="text-teal-600">Ejemplo</div>
                                    <div class="text-gray-500 text-xs">Marzo 2020 </div>
                                </li>
                                <li>
                                    <div class="text-teal-600">4/5</div>
                                    <div class="text-gray-500 text-xs">Marzo 2020 </div>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                                <span clas="text-green-500">
                                    <svg class="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path fill="#fff"
                                            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                    </svg>
                                </span>
                                <span class="tracking-wide">Warnings</span>
                            </div>
                            <ul class="list-inside space-y-2">
                                <li>
                                    <div class="text-teal-600">Ejemplo</div>
                                    <div class="text-gray-500 text-xs">Marzo 2020 </div>
                                </li>
                                <li>
                                    <div class="text-teal-600">4/5</div>
                                    <div class="text-gray-500 text-xs">Marzo 2020 </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

  );
}

export default ProfileBody;
