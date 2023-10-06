import CrearProductoComponent from "../components/crearproducto/CrearProductoComponent";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import { getIdUser } from "../services/Auth";
function CrearProducto() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const responseUser = await axios.get(
          `http://localhost:3001/users/${getIdUser()}`
        );
        setUser(responseUser.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el post:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    width: 100,
    height: 100,
  };
  return (
    <div className="min-h-screen">
      {loading && <Loader options={options} />}
      {user && <CrearProductoComponent user={user} />}
    </div>
  );
}

export default CrearProducto;
