
import { useState, useEffect } from 'react';
import axios from 'axios';
import RecoverPasswordComponent from "../components/RecoverPassword/RecoverPasswordComponent";
import Footer from '../components/Footer/Footer'
import { getToken } from "../services/Auth";

function recoverPassword() {
  const [user, setUser] = useState(null);
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
          `http://localhost:3001/users/`, 
          config
        );
        setUser(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <RecoverPasswordComponent user={user}/>
    </div>
  );
}

export default recoverPassword;