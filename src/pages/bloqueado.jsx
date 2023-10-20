import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

function Bloqueado() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-4xl text-red-600">
        <FaExclamationCircle />
      </div>
      <h1 className="text-2xl font-bold mt-4 text-red-600">
        ¡Usuario Bloqueado!
      </h1>
      <p className="text-gray-700 mt-2">
        Tu cuenta ha sido bloqueada debido a presunta actividad sospechosa o de estafa.
      </p>
      <p className="text-gray-700 mt-2">
        Si crees que esto es un error o deseas más información, por favor contáctanos:
      </p>
      <a
        href="mailto:soportealcliente@trovetraders.com"
        className="text-primary-500 font-semibold hover:underline mt-2"
      >
        soportealcliente@trovetraders.com
      </a>
    </div>
  );
}

export default Bloqueado;
