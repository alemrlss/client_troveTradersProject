/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import { useState } from "react";
import ProtectedRoute from './routes/ProtectedRoute'
import Home from './pages/home'


function App() {

  const [isAuthorized, setIsAuthorized] = useState(false);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          
          <Route element={<ProtectedRoute isAuthorized={isAuthorized} redirectTo="/login"/>}>
              <Route path="/home" element={<Home/>}/>
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
