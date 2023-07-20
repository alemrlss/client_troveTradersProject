/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import About from "./About";
import Trades from "./Trades";
import { FiStar } from "react-icons/fi";
import { getDataUser } from "../../services/Auth";
import ModalEditUser from "../Modals/ModalEditUser/ModalEditUser";
import { useModal } from "../../hooks/useModal";
function ProfileBody({ data }) {
  const profileOptions = {
    about: "about",
    trades: "trades",
  };

  const [userData, setUserData] = useState(data); //data del usuario.

  const handleSaveChanges = (updatedData) => {
    setUserData(updatedData);
  };

  const decorationButton = " border-b-4 border-green-800";
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
    <div className="w-3/4 rounded-r-md flex flex-col p-10">
      <ModalEditUser
        isOpen={isOpenModalEdit}
        closeModal={closeModalEdit}
        data={userData}
        handleSaveChanges={handleSaveChanges}
      />{" "}
      <div className="bg-green-100 p-2">
        <div className="flex flex-row">
          <h2 className="text-3xl flex-grow">
            {userData.name} {userData.lastName}
          </h2>
          {canEdit && (
            <button
              className="bg-orange-300 mr-5 pr-2 pl-2"
              onClick={openModalEdit}
            >
              Edit Profile
            </button>
          )}
        </div>
        <p className="pl-4 text-xl text-gray-600">@{userData.username}</p>
        <div className="mt-12 pb-1 flex items-center justify-center text-3xl">
          <p className="text-gray-600 font-semibold">Ranking:</p>
          <p className="font-bold">0/5</p> <FiStar />
        </div>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex pl-2">
          <button
            onClick={handleButtons}
            className={`btn-profile-about p-2${classButtonAbout}`}
          >
            About
          </button>
          <button
            onClick={handleButtons}
            className={`btn-profile-trades p-2${classButtonTrades}`}
          >
            Trades
          </button>
        </div>

        <div className="h-full">
          {isClicked === profileOptions.about && <About data={userData} />}
          {isClicked === profileOptions.trades && <Trades />}
        </div>
      </div>
    </div>
  );
}

export default ProfileBody;
