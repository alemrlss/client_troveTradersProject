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
  ANTIGUEDADES,
  MUSICA,
  CARTAS,
  TECNOLOGIA,
  COMICS,
  JUGUETES,
  DEPORTE,
  LIBROS,
  OTROS,
  FORGOT,
  RESULTADO,
} from "./routes/paths";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Forgot from "./pages/forgot";
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

import { SocketProvider } from "./contexts/socketContext";

function App() {
  //ESTA PENDIENTE POR ANEXAR LA VALIDEZ DEL TOKEN!!!.

  return (
    <div className="app">
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicRoute />}>
              <Route path={LANDING} element={<Landing />} />
              <Route path={LOGIN} element={<Login />} />
              <Route path={REGISTER} element={<Register />} />
              <Route path={FORGOT} element={<Forgot />} />
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
              <Route path={ANTIGUEDADES} element={<CategoriaAntiguedades />} />
              <Route path={MUSICA} element={<CategoriaMusica />} />
              <Route path={CARTAS} element={<CategoriaCartas />} />
              <Route path={TECNOLOGIA} element={<CategoriaTecnologia />} />
              <Route path={COMICS} element={<CategoriaComics />} />
              <Route path={JUGUETES} element={<CategoriaJuguetes />} />
              <Route path={DEPORTE} element={<CategoriaDeporte />} />
              <Route path={LIBROS} element={<CategoriaLibros />} />
              <Route path={OTROS} element={<CategoriaOtros />} />
              <Route path="*" element={<h1>404</h1>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
