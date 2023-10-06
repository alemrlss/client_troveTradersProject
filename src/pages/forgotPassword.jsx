import { useState, useEffect } from 'react';
import axios from 'axios';
import ForgotPassword from '../components/ForgotPassword/ForgotPassword';
import Footer from '../components/Footer/Footer'
import { getToken } from "../services/Auth";

function forgotPassword() {
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
        <ForgotPassword user={user}/>
    </div>
  )
}

export default forgotPassword