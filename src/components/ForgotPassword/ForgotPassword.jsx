import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';


function ForgotPassword(user, data) {
  const [emailSend, setEmailSend] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState('');

  const [formData, setformData] = useState({
    email: ""
  });

  const handleInputChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const handleSendEmailRecovery = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/recovery-email/",
        {
          email: formData.email,
        }
      );
      console.log(response.data);
      setEmailSend(true);
      setSuccess('El correo de recuperacion se ha enviado con exito.');
    } catch (error) {
      console.error("Error al enviar el correo de recuperacion:", error.message);
    }

    if (formData.email === "") {
      setError("Por favor introduce tu correo.");
      return;
    }
  };

  return (
    <section className="bg-logo-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <img
            className="mx-auto w-20 h-20"
            src="src/assets/img/logoAlejandro.png"
            alt="Logo"
          />
          <h2 className="mt-4 text-3xl font-semibold text-gray-900">
            Recuperar contraseña.
          </h2>
        </div>
            <form className="mt-6">
              <div className="mb-4">
                  <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-medium"
                >
                  Correo Electrónico
                </label>
                <input
                  name="email"
                  onChange={handleInputChange}
                  type="email"
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-secondary-100"
                  placeholder="Tu correo"
                />
                <p className="mt-5 text-sm font-light text-gray-500">Ingresa tu correo electrónico para encontrar tu cuenta.</p>
                <p className="mt-5 text-sm font-light text-red-500">{error}</p>
                <p className="mt-5 text-sm font-light text-green-500">{success}</p>
              </div>
              <div>
                <button type="button" onClick={handleSendEmailRecovery} className="mb-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-100 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Enviar Correo
                </button>
                <Link to ='/login'>
                  <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-100 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Cancelar
                  </button>
                </Link>
              </div>
                
            </form>
          </div>
    </section>
  )
}

export default ForgotPassword