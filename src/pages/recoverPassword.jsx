import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import RecoverPasswordComponent from "../components/RecoverPassword/RecoverPasswordComponent";
import { getToken } from "../services/Auth";

function recoverPassword() {
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

  return (
    <div>
      <RecoverPasswordComponent user={user}/>
    </div>
  );
}

export default recoverPassword;