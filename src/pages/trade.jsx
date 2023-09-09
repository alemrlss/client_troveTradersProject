/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line react-hooks/exhaustive-deps
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import TradeComponent from "../components/Trade/TradeComponent";
import { useParams } from "react-router-dom";
import { getDataUser } from "../services/Auth";
import Footer from "../components/Footer/Footer";
function trade() {
  const { id } = useParams();
  const [tradeInfo, setTradeInfo] = useState(null);
  const [postInfo, setPostInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [userData, setUserData] = useState(null);

  const [sellerData, setSellerData] = useState(null);
  const [buyerData, setBuyerData] = useState(null);

  //!idUser de la session!
  const idUser = getDataUser().id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/users/${idUser}/trades/${id}`
        );
        const responsePost = await axios.get(
          `http://localhost:3001/posts/${response.data.postID}`
        );

        const responseUserData = await axios.get(
          `http://localhost:3001/users/${idUser}`
        );

        const responseSellerData = await axios.get(
          `http://localhost:3001/users/${response.data.sellerID}`
        );
        const responseBuyerData = await axios.get(
          `http://localhost:3001/users/${response.data.buyerID}`
        );

        setBuyerData(responseBuyerData.data);
        setSellerData(responseSellerData.data);
        setUserData(responseUserData.data);
        setPostInfo(responsePost.data);
        setTradeInfo(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Error: Trade not found");
        setLoading(false);
      }
    };
    fetchData();

    setLoading(true);
  }, []);

  const options = {
    width: 100,
    height: 100,
  };

  return (
    <>
      {loading && <Loader options={options} />}
      {error && (
        <h1>ES POSIBLE QUE EL TRADE FUE CANCELADO ANTERIORMENTE O NO EXISTE</h1>
      )}
      {tradeInfo && (
        <TradeComponent
          trade={tradeInfo}
          post={postInfo}
          idUser={idUser}
          userData={userData}
          sellerData={sellerData}
          buyerData={buyerData}
        />
      )}

      <Footer />
    </>
  );
}

export default trade;
