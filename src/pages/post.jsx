/* eslint-disable react-hooks/rules-of-hooks */
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "../components/NavBar/NavBar";
import Loader from "../components/Loader/Loader";
import PostComponent from "../components/Post/PostComponent";
import axios from "axios";

function post() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { id } = useParams();


  const [loading, setLoading] = useState(false);

  const [post, setPost] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/posts/${id}`);
        setPost(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el post:", error);
      }
    };

    fetchPost();
  }, [id]);

  const options = {
    width: 100,
    height: 100,
  };
  return <div>
    <NavBar/>
    {loading && <Loader options={options}/>}
    {post && <PostComponent post={post}/>}
  </div>;
}

export default post;
