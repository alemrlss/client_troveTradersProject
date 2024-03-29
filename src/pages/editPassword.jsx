import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../services/Auth";
import Footer from "../components/Footer/Footer";
import EditPassword from "../components/EditPassword/EditPassword";


function editPassword() {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/users/${id}`, config);
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  const options = {
    width: 100,
    height: 100,
  };

  return (
    <div>
      <EditPassword user={user}/>
    </div>
  )
}

export default editPassword