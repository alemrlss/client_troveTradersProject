/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
function TradeComponent({ trade, idUser }) {
  const [seller, setSeller] = useState(false);
  const [buyer, setBuyer] = useState(false);

  useEffect(() => {
    if (idUser === trade.sellerID) {
      setSeller(true);
      console.log("seller");
    } else if (idUser === trade.buyerID) {
      setBuyer(true);
      console.log("buyer");
    }
  }, [idUser, trade]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Trade Details</h1>
      {seller && (
        <div className="bg-orange-200 rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-xl mb-2">Esta es la ventana del vendedor</h2>
          <p>
            Aquí tendrás acceso a todas las funcionalidades relacionadas con el
            trade como la negociación, el pago y el envío.
          </p>
        </div>
      )}
      {buyer && (
        <div className="bg-gray-600 rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-xl mb-2">Esta es la ventana del comprador</h2>
          <p>
            Aquí podrás realizar la compra del artículo y coordinar los detalles
            con el vendedor.
          </p>
        </div>
      )}
      {!seller && !buyer && (
        <div className="bg-red-100 rounded-lg shadow-md p-4">
          <h2 className="text-xl mb-2">No tienes roles para este TRADEO</h2>
          <p>No tienes los permisos necesarios para acceder a esta página.</p>
        </div>
      )}
    </div>
  );
}

export default TradeComponent;
