/* eslint-disable react-hooks/rules-of-hooks */
import ResultadosComponent from "../components/resultados/resultadosComponent";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import { getIdUser } from "../services/Auth";
import Footer from "../components/Footer/Footer";

function resultados() {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const responsePosts = await axios.get(
          `http://localhost:3001/posts/availables`
        );
        const responseUser = await axios.get(
          `http://localhost:3001/users/${getIdUser()}`
        );
        setPosts(responsePosts.data);
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
      {posts && <ResultadosComponent posts={posts} user={user} />}
    </div>
  );
}

export default resultados;
