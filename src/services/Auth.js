// auth.js
import axios from "axios";

// Función para iniciar sesión
export const login = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:3001/auth/login", {
      email,
      password,
    });
    console.log(response);
    if (response.status === 200 || response.status === 201) {
      const { token } = response.data;
      localStorage.setItem("accessToken", token);
      return true;
    }
  } catch (error) {
    if (error.response.data.statusCode === 403) {
      console.log("PASSWORD INVALID");
      return false;
    } else if (error.response.data.statusCode === 404) {
      console.log("USUARIO NO EXISTE");
      return false;
    }
  }
};

// Función para cerrar sesión
export const logout = () => {
  localStorage.removeItem("accessToken");
};

// Función para verificar el estado de autenticación(True=Autorizado. False=NoAutorizado.)
export const isAuthenticated = () => {
  const accessToken = localStorage.getItem("accessToken");
  return !!accessToken;
};
