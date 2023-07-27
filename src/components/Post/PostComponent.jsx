/* eslint-disable react/prop-types */
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { SocketContext } from "../../contexts/socketContext";
import { getIdUser } from "../../services/Auth";
import { Link } from "react-router-dom";

function PostComponent({ post }) {
  const socket = useContext(SocketContext);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [seller, setSeller] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [isPostAvailable, setIsPostAvailable] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    setIsPostAvailable(post.currentState === "disponible");
    if (socket) {
      socket.on("newNotification", (payload) => {
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

    const fetchSellerInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/users/${post.author_id}`
        );
        setSeller(response.data);
      } catch (error) {
        console.error("Error al obtener información del vendedor:", error);
      }
    };

    fetchSellerInfo();

    return () => {
      if (socket) {
        socket.off("newNotification");
      }
    };
  }, [post.author_id]);

  useEffect(() => {
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

  const showAndHideNotification = (msg, messageHTML, bgColor) => {
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

  const getBuyerInfo = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${id}`);
      return response.data || { name: "Private Accouunt", _id: "Not ID" };
    } catch (error) {
      return `Ha ocurrido un error: ${error}`;
    }
  };

  const sendNotification = (authorId, msgNotification, bgColor, target) => {
    if (socket) {
      socket.emit("notification", {
        authorId,
        msgNotification,
        bgColor,
        target,
      });
    }
  };

  const handleConfirmClick = async () => {
    if (hasRequested) {
      const msgError =
        "Ya este producto se encuentra en las soliciudes del vendedor";
      const msgErrorHTML = (
        <p>
          <b>{msgError}</b>
        </p>
      );
      showAndHideNotification(msgError, msgErrorHTML, "bg-orange-400");
      return;
    }

    const buyer = await getBuyerInfo(getIdUser());
    const message = `😾 ${buyer.name} te ha solicitado comprar tu producto: "${post.title}".`;

    try {
      await axios.post("http://localhost:3001/notifications", {
        sellerId: post.author_id,
        message,
        target: `/profile/${buyer._id}`
      });

      sendNotification(post.author_id, message, `bg-orange-600`, `/profile/${buyer._id}`);

      await axios.post(
        `http://localhost:3001/users/${post.author_id}/requests`,
        {
          message,
          sellerID: post.author_id,
          buyerID: buyer._id,
          postID: post._id,
          nameBuyer: buyer.name,
          nameSeller: seller.name,
          titlePost: post.title,
        }
      );

      const msgConfirmation =
        "✅ La solicitud de compra ha sido enviada con exito";
      const msgConfirmationHTML = (
        <p>
          <b>{msgConfirmation}</b>
        </p>
      );
      showAndHideNotification(
        msgConfirmation,
        msgConfirmationHTML,
        "bg-green-400"
      );
      setIsConfirming(false);
      setIsButtonDisabled(true);

      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 2000);
    } catch (error) {
      console.error("Error al confirmar la compra:", error);
    }
  };

  const hasRequestedFunction = (sellerID) => {
    axios
      .get(`http://localhost:3001/users/${sellerID}/requests`)
      .then((response) => {
        const requests = response.data.requests;
        if (requests.length === 0) return;

        const hasRequested = requests.some(
          (request) =>
            request.postID === post._id && request.sellerID === post.author_id
        );
        setHasRequested(hasRequested);
      })
      .catch((error) => {
        console.error("Error al obtener las solicitudes del comprador:", error);
      });
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString(undefined, options);
    return formattedDate;
  }

  return (
    <div className="min-h-screen bg-gray-200 p-4">
      {isPostAvailable ? (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <p className="text-gray-400 text-sm mb-2">
            Creado: {formatDate(post.createdAt)}
          </p>
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-500 mb-2 flex items-center">
            <span className="mr-2">
              {seller && (
                <img
                  src={`http://localhost:3001/image/profile/${seller.imageProfile}`}
                  alt="Foto del vendedor"
                  className="w-8 h-8 rounded-full"
                />
              )}
            </span>
            <span>
              {seller ? (
                <Link to={`/profile/${seller._id}`}>
                  {" "}
                  <span className="text-gray-900 font-medium hover:text-blue-500">
                    {seller.name} {seller.lastName}
                  </span>
                </Link>
              ) : (
                <span className="text-gray-400">Vendedor no disponible</span>
              )}
            </span>
          </p>
          <p className="text-gray-600 mb-4">{post.description}</p>
          <p className="text-gray-800 text-lg font-bold mb-4">
            Precio: {post.price}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {post.photos.map((photo, index) => (
              <img
                key={index}
                src={`http://localhost:3001/images/posts/${photo}`}
                alt={`Photo ${index}`}
                className="rounded shadow w-full h-72 object-cover"
              />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            {!isConfirming ? (
              <button
                onClick={() => {
                  hasRequestedFunction(post.author_id);

                  if (post.author_id === getIdUser()) {
                    const msgError = "No puedes comprar tu propio producto.";
                    const msgErrorHTML = (
                      <p className="text-xl">
                        <b>{msgError}</b>
                      </p>
                    );
                    showAndHideNotification(
                      msgError,
                      msgErrorHTML,
                      "bg-red-300"
                    );
                    return;
                  }

                  setIsConfirming(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 text-2xl rounded"
                disabled={isButtonDisabled}
              >
                Comprar
              </button>
            ) : (
              <div>
                <button
                  onClick={() => {
                    handleConfirmClick();
                    setIsConfirming(false);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 mr-2"
                  disabled={isButtonDisabled}
                >
                  Confirmar compra
                </button>
                <button
                  onClick={() => {
                    setIsConfirming(false);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-2xl text-red-500 font-bold">
            Este post no está disponible actualmente.
          </h1>
        </div>
      )}

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

export default PostComponent;