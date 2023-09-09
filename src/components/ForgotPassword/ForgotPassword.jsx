import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';


function ForgotPassword(user, data) {
  const [verificationEmailUser] = useState(user.verificationEmail);
  const [emailSend, setEmailSend] = useState(false);

  const handleSendEmailRecovery = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/recovery-email",
        {
          email: user.email,
        }
      );
      console.log(response.data);
      setEmailSend(true);
    } catch (error) {
      console.error(
        "Error al enviar el correo de verificación:",
        error.message
      );
    }
  };

  return (
    <section className="bg-logo-100 ">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 ">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
          <img className="w-20 h-20 mr-2" src="src\assets\img\logo2.jpg" alt="logo"/>
          TroveTraders
        </a>
        <div className="w-full bg-primary-100 rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0 ">
          {" "}
          {/*Background*/}
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            {" "}
            {/*Panel principal*/}
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Recupera tu cuenta.
            </h1>
            <form className="space-y-4 md:space-y-6">
              {" "}
              {/*Email y Contraseña*/}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Correo
                </label>
                <input
                  name="email"
                  type="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Tu correo"
                />
                <p className="mt-5 text-sm font-light text-gray-500">Ingresa tu correo electrónico para encontrar tu cuenta.</p>
              </div>
              <div>
                <button type="button" onClick={handleSendEmailRecovery} className="mb-5 w-full text-white bg-secondary-100 hover:bg-secondary-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                  Enviar Correo
                </button>
                <Link to ='/login'>
                  <button className="w-full text-white bg-secondary-100 hover:bg-secondary-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Cancelar
                  </button>
                </Link>
              </div>
                
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ForgotPassword