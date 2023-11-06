/* eslint-disable react/prop-types */
import { useState, useContext, useEffect } from "react";
import React from "react";
import axios from "axios";
import { SocketContext } from "../../contexts/socketContext";
import { getIdUser } from "../../services/Auth";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

function PostComponent({ post }) {
  const socket = useContext(SocketContext);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [seller, setSeller] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [isPostAvailable, setIsPostAvailable] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const [error, setError] = useState("");

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
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${getIdUser()}`
        );
        if (response) {
          const data = await response.json();
          setIsVerify(data.isVerify);
        } else {
          console.log("elses");
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    };

    fetchData();
  }, []);

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
        "Ya este producto se encuentra en las solicitudes del vendedor";
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
        target: `/profile/${buyer._id}`,
      });

      sendNotification(
        post.author_id,
        message,
        `bg-orange-600`,
        `/profile/${buyer._id}`
      );

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
        "✅ - La solicitud de compra ha sido enviada con exito";
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
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  function formatDate(dateString) {
    const formattedDate = format(new Date(dateString), "MMMM d, yyyy", {
      locale: es,
    });
    const formattedMonth = capitalizeFirstLetter(formattedDate.split(" ")[0]);
    const finalFormattedDate = `${formattedMonth} ${formattedDate
      .split(" ")
      .slice(1)
      .join(" ")}`;

    return finalFormattedDate;
  }

  function cantidadImagenes(photoCount) {
    switch (photoCount) {
      case 1:
        return "w-full h-64";
      case 2:
        return "w-1/2  h-64";
      case 3:
        return "w-1/3  h-64";
      case 4:
        return "w-1/4  h-64";
      default:
        return "w-full  h-64";
    }
  }

  const imagesFromPost = post.photos.map((photo, index) => ({
    original: `http://localhost:3001/images/posts/${photo}`,
    thumbnail: `http://localhost:3001/images/posts/${photo}`, // You can use the same image for the thumbnail if needed
  }));

  return (
    <div className="bg-white my-10">
      {isPostAvailable ? (
        <div className="mx-10">
          <div className="flex flex-wrap gap-x-8 lg:px-8 justify-center items-center">
            <ImageGallery
              items={imagesFromPost}
              additionalClass="lg:max-w-2xl lg:w-2/3"
            />
            <div className="lg:w-1/6 border-grey-500 border-2 p-5 rounded-lg shadow-2xl">
              <h2 className="text-2xl text-center font-bold">{post.title}</h2>
              <p className="text-3xl text-center tracking-tight text-green-600">
                ${post.price}
              </p>
              <p className="text-xl tracking-tight text-gray-900 font-bold">
                Fecha de Publicacion:
              </p>
              <p className="text-xl tracking-tight text-gray-900 capitalize">
                {formatDate(post.createdAt)}
              </p>
              <p className="text-xl tracking-tight text-gray-900 font-bold">
                Categoria:
              </p>
              <p className="text-xl tracking-tight text-gray-900 capitalize">
                {post.category}
              </p>
              {!isConfirming ? (
                <button
                  onClick={() => {
                    if (!isVerify) {
                      alert(
                        "No puedes comprar ningun producto si tu cuenta no esta verificada"
                      );
                      return;
                    }

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
                  type="submit"
                  className="mt-4 flex w-full items-center justify-center rounded-md border border-transparent
                   bg-secondary-100 px-8 py-3 text-xl font-bold text-white hover:opacity-90 focus:outline-none 
                   focus:ring-2 focus:ring-secondary-600 focus:ring-offset-2"
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
                    className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded mt-4 mr-2"
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
              <div>
                <h2 className="mt-5 text-xl tracking-tight font-semibold text-center">
                  Descripcion del producto:
                </h2>
                <p className="text-base mt-1 text-gray-900">
                  {post.description}
                </p>
              </div>
            </div>
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
