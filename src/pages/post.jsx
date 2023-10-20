/* eslint-disable react-hooks/rules-of-hooks */
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getIdUser } from "../services/Auth";
import Loader from "../components/Loader/Loader";
import PostComponent from "../components/Post/PostComponent";
import axios from "axios";

function post() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchPost = async () => {
      try {
        const responsePosts = await axios.get(
          `http://localhost:3001/posts/${id}`
        );
        const responseUser = await axios.get(
          `http://localhost:3001/users/${getIdUser()}`
        );
        setPost(responsePosts.data);
        setUser(responseUser.data);
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
  return <div className="overflow-y-hidden">
    {loading && <Loader options={options}/>}
    {post && <PostComponent post={post} user={user}/>}
  </div>;
}

export default post;
