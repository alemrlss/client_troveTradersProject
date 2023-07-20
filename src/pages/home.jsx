import HomeComponent from "../components/Home/HomeComponent";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
function Home() {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3001/posts/availables")
      .then((response) => {
        // !La respuesta de la solicitud GET se encuentra en la variable "response"
        setLoading(false);
        setPosts(response.data);
      })
      .catch((error) => {
        // !Manejo de errores en caso de que ocurra un problema en la solicitud GET
        console.error(error);
      });
  }, []);
  const options = {
    width: 100,
    height: 100,
  };
  return (
    <>
      {loading && <Loader options={options} />}
      {posts && <HomeComponent posts={posts} />}
    </>
  );
}

export default Home;
