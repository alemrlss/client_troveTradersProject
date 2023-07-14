/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import TradeComponent from "../components/Trade/TradeComponent";
import { useParams } from "react-router-dom";
import { getDataUser } from "../services/Auth";
function trade() {
  const { id } = useParams();
  const [tradeInfo, setTradeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //!idUser de la session!
  const idUser = getDataUser().id;

  useEffect(() => {
    console.log("ha");
    axios
      .get(`http://localhost:3001/users/${idUser}/trades/${id}`)
      .then((response) => {
        // !La respuesta de la solicitud GET se encuentra en la variable "response"
        setLoading(false);
        setTradeInfo(response.data);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Error: Trade not found");
        setLoading(false);
      });

    setLoading(true);
  }, []);

  const options = {
    width: 100,
    height: 100,
  };

  return (
    <>
      {loading && <Loader options={options} />}
      {error && <h1>{error} PROGRAMAR ESTA PARTE QUE ES CUANDO EL TRADE NO SE ENCUENTRA</h1>}
      {tradeInfo && <TradeComponent trade={tradeInfo} idUser={idUser} />}
    </>
  );
}

export default trade;
