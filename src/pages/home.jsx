import HomeComponent from "../components/Home/HomeComponent";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import Loader from "../components/Loader/Loader";
import { SocketContext } from "../contexts/socketContext";
import NavBar from '../components/NavBar/NavBar'
function Home() {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3001/posts")
      .then((response) => {
        // !La respuesta de la solicitud GET se encuentra en la variable "response"
        setLoading(false);
        setPosts(response.data);
      })
      .catch((error) => {
        // !Manejo de errores en caso de que ocurra un problema en la solicitud GET
        console.error(error);
      });
  }, [socket]);
  const options = {
    width: 100,
    height: 100,
  };
  return (
    <>
      <NavBar />
      {loading && <Loader options={options} />}
      {posts && <HomeComponent posts={posts} />}
    </>
  );
}

export default Home;
