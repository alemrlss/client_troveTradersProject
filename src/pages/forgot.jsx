import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import ForgotPassword from '../components/ForgotPassword/forgotPassword'
import Footer from '../components/Footer/Footer'
import { getToken } from "../services/Auth";

function forgot() {
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
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);


  return (
    <div>
        <ForgotPassword user={user}/>
        <Footer/>
    </div>
  )
}

export default forgot