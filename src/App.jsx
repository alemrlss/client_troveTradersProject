/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import { useEffect, useState } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/home";
import {isAuthenticated} from './services/Auth'
import Signup from "./pages/signup";



function App() {
  const [isAuth, setIsAuth] = useState(undefined);

  useEffect(() => {
    // Verifica la autenticación al cargar la aplicación
    const token = isAuthenticated()
    if(token) { 
      setIsAuth(true)
    } else { 
      setIsAuth(false)
    }
  }, []);
//ESTA PENDIENTE POR ANEXAR LA VALIDEZ DEL TOKEN!!!. 


  const handleLogin = () => {
    // Maneja el evento de inicio de sesión exitoso y actualiza el estado de autenticación
    setIsAuth(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  return (
    <div className="app">

        <BrowserRouter>
          <Routes>
          <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login handleLogin={handleLogin} />} />

            <Route
              element={
                <ProtectedRoute
                  isAuthorized={isAuth || localStorage.getItem('isAuthenticated')}
                  redirectTo="/login"
                />
              }
            >
              <Route path="/home" element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
