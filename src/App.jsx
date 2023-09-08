/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  HOME,
  LOGIN,
  POST,
  PROFILE,
  REGISTER,
  TRADE,
  EMAILVERIFICATION,
  CREARPRODUCTO,
  LANDING,
  VERIFYACCOUNT,
} from "./routes/paths";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Post from "./pages/post";
import Trade from "./pages/trade";
import EmailVerification from "./pages/emailVerification";
import { AuthContextProvider } from "./contexts/authContext";
import PublicRoute from "./components/router/PublicRoute";
import PrivateRoute from "./components/router/PrivateRoute";
import Register from "./pages/register";
import VerifyAccount from "./pages/verifyAccount";
import CrearProducto from "./pages/crearproducto";
import { SocketProvider } from "./contexts/socketContext";

function App() {
  //ESTA PENDIENTE POR ANEXAR LA VALIDEZ DEL TOKEN!!!.

  return (
    <div className="app">
      <SocketProvider>
        <AuthContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<PublicRoute />}>
                <Route path={LANDING} element={<Landing />} />
                <Route path={LOGIN} element={<Login />} />
                <Route path={REGISTER} element={<Register />} />
              </Route>

              <Route path="/" element={<PrivateRoute />}>
                <Route path={HOME} element={<Home />} />
                <Route path={`${PROFILE}/:id`} element={<Profile />} />
                <Route path={`${POST}/:id`} element={<Post />} />
                <Route path={`${TRADE}/:id`} element={<Trade />} />
                <Route
                  path={`${EMAILVERIFICATION}/:token/test`}
                  element={<EmailVerification />}
                />
                <Route path={VERIFYACCOUNT} element={<VerifyAccount />} />

                <Route path={CREARPRODUCTO} element={<CrearProducto />} />
                <Route path="*" element={<h1>404</h1>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthContextProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
