/* eslint-disable react/prop-types */
import "../Modal.css";
import { FiX } from "react-icons/fi";
import { useState } from "react";
import ModalInfoGeneral from "./ModalInfoGeneral";
import ModalProfileImage from "./ModalProfileImage";

function ModalEditUser({ isOpen, closeModal, data, handleSaveChanges }) {
  const handleCloseModal = () => {
    //IMPLEMENTAR LOGICA PARA HACER OTRO MODAL DICIENDO QUE SI ESTA SEGURO DE SALIR MODAL
    closeModal();
  };

  const editOptions = {
    infoGeneral: "info general",
    profileImage: "image profile",
  };

  const decorationButton = " border-b-4 border-blue-800";

  const [isClicked, setisClicked] = useState(editOptions.infoGeneral);
  const [classButtonInfoGeneral, setClassButtonInfoGeneral] =
    useState(decorationButton);
  const [classButtonProfileImage, setClassButtonProfileImage] = useState("");
  const handleButtons = (e) => {
    setisClicked(e.target.textContent.toLowerCase());

    if (e.target.textContent.toLowerCase() === editOptions.infoGeneral) {
      setClassButtonProfileImage("");
      setClassButtonInfoGeneral(decorationButton);
    }
    if (e.target.textContent.toLowerCase() === editOptions.profileImage) {
      setClassButtonProfileImage(decorationButton);
      setClassButtonInfoGeneral("");
    }
  };
  return (
    <article className={`modal ${isOpen && "is-open"}`}>
      <div className="modal-container">
        <FiX className="modal-close w-8 h-8" onClick={handleCloseModal} />
        <h1 className="text-4xl  mb-4">Editar</h1>
        <div className="modal-navbar flex">
          <button
            onClick={handleButtons}
            className={`p-1 ${classButtonInfoGeneral}`}
          >
            Info General
          </button>
          <button
            onClick={handleButtons}
            className={`p-1 ${classButtonProfileImage}`}
          >
            Image Profile
          </button>
        </div>
        <div>
          {isClicked === editOptions.infoGeneral && (
            <ModalInfoGeneral
              data={data}
              closeModal={closeModal}
              handleSaveChanges={handleSaveChanges}
            />
          )}
          {isClicked === editOptions.profileImage && (
            <ModalProfileImage data={data} />
          )}
        </div>
      </div>
    </article>
  );
}

export default ModalEditUser;
