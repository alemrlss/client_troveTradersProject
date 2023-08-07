// auth.js
import axios from "axios";
import jwt_decode from "jwt-decode";

// Función para iniciar sesión
export const loginBackend = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:3001/auth/loginAdmin", {
      email,
      password,
    });
    if (response.status === 200 || response.status === 201) {
      const { token } = response.data;
      localStorage.setItem("accessTokenAdmin", token);
      return {
        status: response.status,
        message: "LOGGUED!",
      };
    }
  } catch (error) {
    if (error.response.data.statusCode === 403) {
      //PASSWORD INVALID
      return {
        status: error.response.data.statusCode,
        message: "PASSWORD INVALID",
      };
    } else if (error.response.data.statusCode === 404) {
      //USER NOT FOUND
      return {
        status: error.response.data.statusCode,
        message: "USER NOT FOUND",
      };
    }
  }
};

// Función para verificar el estado de autenticación(True=Autorizado. False=NoAutorizado.)
export const isAuthenticated = () => {
  const accessToken = localStorage.getItem("accessTokenAdmin");
  return !!accessToken;
};

//GET TOKEN LOCALSTORAGE
export const getToken = () => {
  const token = localStorage.getItem("accessTokenAdmin");
  return token;
};

//GET ID USER BY LOCALSTORAGE
export const getIdUser = () => {
  const token = getToken();
  if (token) {
    try {
      const decodedToken = jwt_decode(token);

      const userId = decodedToken.id;
      return userId;
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  } else {
    console.log("TOKEN NO VALID");
  }
};

export const getDataUser = () => {
  const token = getToken();
  if (token) {
    try {
      const decodedToken = jwt_decode(token);
      return decodedToken;
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  } else {
    console.log("TOKEN NO VALID");
  }
};
