import { useState, useEffect } from "react";

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

function VerifyComponent() {
  const [currentStep, setCurrentStep] = useState("intro"); // Inicialmente, muestra el componente VerifyIntro
  const [emailVerification, setEmailVerification] = useState(null);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [verificationSuccess, setVerificationSuccess] = useState();

  const [verificationSimulator, setVerificationSimulator] = useState(false); // SIMULACION DE LA VERIFICACION DE CUENTA.

  //!CAMBIAR A TRUE SI QUIERES QUE EL SIMULADOR APRUEBE LA VERIFICACION
  //~CAMBIAR A FALSE SI QUIERES QUE NO LA APRUEBE

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
    </div>
  );
}

export default VerifyComponent;
