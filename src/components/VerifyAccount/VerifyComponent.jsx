import { useState, useEffect, useContext } from "react";

import VerifyIntro from "./VerifyIntro";
import VerifyStep1 from "./VerifyStep1";
import VerifyStep2 from "./VerifyStep2";
import VerifyStep3 from "./VerifyStep3";
import VerifyStep4 from "./VerifyStep4";
import { getIdUser } from "../../services/Auth";
import axios from "axios";
import Loader from "../Loader/Loader";
import VerifyEmailError from "./VerifyEmailError";
import VerifyError from "./VerifyError";
import { Link } from "react-router-dom";
import { SocketContext } from "../../contexts/socketContext";

function VerifyComponent() {
  const socket = useContext(SocketContext);

  const [currentStep, setCurrentStep] = useState("intro"); // Inicialmente, muestra el componente VerifyIntro
  const [emailVerification, setEmailVerification] = useState(null);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [verificationSuccess, setVerificationSuccess] = useState();

  const [verificationSimulator, setVerificationSimulator] = useState(false); // SIMULACION DE LA VERIFICACION DE CUENTA.

  //!CAMBIAR A TRUE SI QUIERES QUE EL SIMULADOR APRUEBE LA VERIFICACION
  //~CAMBIAR A FALSE SI QUIERES QUE NO LA APRUEBE

  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);

  //!UseEffect para la escucha de las notificaciones
  useEffect(() => {
    if (socket) {
      socket.on("newNotification", (payload) => {
        // Manejar la notificación recibida desde el servidor
        const msgHTML = (
          <Link to={payload.target}>
            <b>{payload.msgNotification}</b>
          </Link>
        );
        showAndHideNotification(
          payload.msgNotification,
          msgHTML,
          payload.bgColor
        );
      });
    }
    return () => {
      if (socket) {
        socket.off("newNotification");
      }
    };
  }, []);

  //!UseEffect para cuando una notificacion cambie se renderize
  useEffect(() => {
    // Timer para eliminar las notificaciones después de 2 segundos
    let timer;

    if (notifications.length > 0) {
      timer = setTimeout(() => {
        setNotifications([]);
        setShowNotification(true);
      }, 2500);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [notifications]);

  //!Funcion para mostrar las notificaciones
  const showAndHideNotification = (msg, messageHTML, bgColor) => {
    // ~Verificar si la notificación ya existe en el estado de notificaciones
    const notificationExists = notifications.some(
      (notification) => notification.msg === msg
    );
    if (!notificationExists) {
      setShowNotification(true);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { msg, messageHTML, bgColor },
      ]);
    }
  };
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3001/users/" + getIdUser()
        );

        setData(response.data);
        setLoading(false);
        setEmailVerification(response.data.verificationEmail);
        setVerification(response.data.isVerify);
      } catch (error) {
        console.error("Error fetching verification status:", error);
      }
    };

    fetchVerificationStatus();
  }, []);
  const steps = {
    intro: (
      <VerifyIntro
        onNextStep={() => handleNextStep("step1")}
        verificationSimulator={verificationSimulator}
        setVerificationSimulator={setVerificationSimulator}
      />
    ),
    step1: <VerifyStep1 onNextStep={() => handleNextStep("step2")} />,
    step2: (
      <VerifyStep2
        onNextStep={() => handleNextStep("step3")}
        setVerificationSuccess={setVerificationSuccess}
        verificationSimulator={verificationSimulator}
      />
    ),
    step3: <VerifyStep3 onNextStep={() => handleNextStep("step4")} />,
    step4: (
      <VerifyStep4
        onIntroStep={() => handleNextStep("intro")}
        verificationSuccess={verificationSuccess}
      />
    ),
  };

  const handleNextStep = (step) => {
    setCurrentStep(step);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading && <Loader />}
      {data && emailVerification && !verification ? (
        <div className="p-6 bg-white rounded shadow-md w-full sm:max-w-md mx-4">
          {steps[currentStep]}
        </div>
      ) : null}
      {data && emailVerification === false && <VerifyEmailError />}
      {data && verification === true && <VerifyError />}
      {showNotification && (
        <div className="fixed top-4 right-4 space-y-4">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className={`${notification.bgColor} text-gray-800 p-4 rounded-md shadow-md`}
            >
              {notification.messageHTML}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VerifyComponent;
