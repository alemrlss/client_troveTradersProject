/* eslint-disable react/prop-types */

function Acuerdo({ seller, buyer, setCurrentState }) {
  return (
    <div>
      <h2>Este es el componente de la etapa de ACUERDO</h2>

      {seller && (
        <div className="bg-orange-200 rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-xl mb-2">
            ESTE ES EL COMPONENTE DE ACUERDO. DONDE TANTO COMO EL COMPRADOR COMO
            EL VENDEDOR TIENEN QUE PONERNSE DE ACUEDO Y CHECKEAR EL BOTONSITO DE
            ABAJO... YO SOY EL VENDEDOR
          </h2>
          <h2 className="text-xl mb-2">Tu eres el vendedor</h2>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setCurrentState("pago");
            }}
          >
            {" "}
            Si, como vendedor estoy de acuerdo con este trade{" "}
          </button>
        </div>
      )}

      {buyer && (
        <div className="bg-orange-200 rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-xl mb-2">
            ESTE ES EL COMPONENTE DE ACUERDO. DONDE TANTO COMO EL COMPRADOR COMO
            EL VENDEDOR TIENEN QUE PONERNSE DE ACUEDO Y CHECKEAR EL BOTONSITO DE
            ABAJO... YO SOY EL COMPRADOR
          </h2>
          <h2 className="text-xl mb-2">Tu eres el comprador</h2>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setCurrentState("pago");
            }}
          >
            {" "}
            Si, como comprador estoy de acuerdo con este trade{" "}
          </button>
        </div>
      )}
    </div>
  );
}

export default Acuerdo;
