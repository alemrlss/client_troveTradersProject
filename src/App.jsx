/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HOME, LOGIN, REGISTER } from "./routes/paths";
import Login from "./pages/login";
import Home from "./pages/home";
import { AuthContextProvider } from "./contexts/authContext";
import PublicRoute from "./components/router/PublicRoute";
import PrivateRoute from "./components/router/PrivateRoute";
import Register from "./pages/register";

function App() {
  //ESTA PENDIENTE POR ANEXAR LA VALIDEZ DEL TOKEN!!!.

  return (
    <div className="app">
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicRoute />}>
              <Route path={LOGIN} element={<Login />} />
              <Route path={REGISTER} element={<Register />} />
            </Route>


            <Route path="/" element={<PrivateRoute />}>
              <Route path={HOME} element={<Home />} />
            </Route>

   
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
