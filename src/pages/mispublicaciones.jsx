import HomeComponent from "../components/Home/HomeComponent";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import { getIdUser } from "../services/Auth";
import MispublicacionesCompontent from "../components/Mispublicaciones/MispublicacionesCompontent";
function MisPublicaciones() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const responseUser = await axios.get(
          `http://localhost:3001/posts/user-posts/${getIdUser()}`
        );
        setPosts(responseUser.data);
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
      {posts && <MispublicacionesCompontent posts={posts} />}
    </div>
  );
}

export default MisPublicaciones;
