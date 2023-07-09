/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {HOME, LOGIN, PROFILE, SIGNUP, LANDING} from "./routes/paths";
import Login from "./pages/login";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Signup from "./pages/signup";
import Landing from "./pages/landing";
import { AuthContextProvider } from "./contexts/authContext";
import PublicRoute from "./components/router/PublicRoute";
import PrivateRoute from "./components/router/PrivateRoute";

function App() {
  //ESTA PENDIENTE POR ANEXAR LA VALIDEZ DEL TOKEN!!!.

  return (
    <div className="app">
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicRoute />}>
              <Route path={LANDING} element={<Landing/>}/>
              <Route path={LOGIN} element={<Login />} />
              <Route path={SIGNUP} element={<Signup />} />
            </Route>


            <Route path="/" element={<PrivateRoute />}>
              <Route path={HOME} element={<Home />} />
              <Route path={`${PROFILE}/:id`} element={<Profile/>}/>
            </Route>

   
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
