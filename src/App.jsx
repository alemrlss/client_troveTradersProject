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
  VERIFYACCOUNT,
  ANTIGUEDADES,
  MUSICA,
  CARTAS,
  TECNOLOGIA,
  COMICS,
  JUGUETES,
  DEPORTE,
  LIBROS,
  OTROS,
  RECOVERPASSWORD,
  FORGOTPASSWORD,
  EDITPASSWORD,
  RESULTADO,
  MISPUBLICACIONES,
  REGISTRO,
  BLOQUEADO
} from "./routes/paths";
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
import EditPassword from "./pages/editPassword";
import ForgotPassword from "./pages/forgotPassword";
import RecoverPassword from "./pages/recoverPassword";
import VerifyAccount from "./pages/verifyAccount";
import CrearProducto from "./pages/crearproducto";
import CategoriaAntiguedades from "./pages/categoriaAntiguedades";
import CategoriaMusica from "./pages/categoriaMusica";
import CategoriaCartas from "./pages/categoriaCartas";
import CategoriaTecnologia from "./pages/categoriaTecnologia";
import CategoriaComics from "./pages/categoriaComics";
import CategoriaJuguetes from "./pages/categoriaJuguetes";
import CategoriaDeporte from "./pages/categoriaDeporte";
import CategoriaLibros from "./pages/categoriaLibros";
import CategoriaOtros from "./pages/categoriaOtros";
import Resultados from "./pages/resultados";
import Registro from "./pages/registro";
import Bloqueado from "./pages/bloqueado";

import { SocketProvider } from "./contexts/socketContext";
import Mispublicaciones from "./pages/mispublicaciones";
import NotFound from "./components/NotFound/NotFound";

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
              <Route path={FORGOTPASSWORD} element={<ForgotPassword />} />
              <Route
                path={`${RECOVERPASSWORD}/:token/test`}
                element={<RecoverPassword />}
              />
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
              <Route path={RESULTADO} element={<Resultados />} />
              <Route path={CREARPRODUCTO} element={<CrearProducto />} />
              <Route path={VERIFYACCOUNT} element={<VerifyAccount />} />
              <Route path={`${EDITPASSWORD}/:id`} element={<EditPassword />} />
              <Route path={ANTIGUEDADES} element={<CategoriaAntiguedades />} />
              <Route path={MUSICA} element={<CategoriaMusica />} />
              <Route path={CARTAS} element={<CategoriaCartas />} />
              <Route path={TECNOLOGIA} element={<CategoriaTecnologia />} />
              <Route path={COMICS} element={<CategoriaComics />} />
              <Route path={JUGUETES} element={<CategoriaJuguetes />} />
              <Route path={DEPORTE} element={<CategoriaDeporte />} />
              <Route path={LIBROS} element={<CategoriaLibros />} />
              <Route path={OTROS} element={<CategoriaOtros />} />
              <Route path={MISPUBLICACIONES} element={<Mispublicaciones />} />
              <Route path={REGISTRO} element={<Registro />} />
              <Route path={BLOQUEADO} element={<Bloqueado />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
