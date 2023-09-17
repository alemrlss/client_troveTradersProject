import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../services/Auth";
import Footer from "../components/Footer/Footer";
import EditPassword from "../components/EditPassword/EditPassword";


function editPassword() {
  const [data, setData] = useState(null);
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
          `http://localhost:3001/users/${id}`,
          config
        );
        setData(response.data);
      } catch (error) {
        console.log(error); //PROGRAMAR ERROR.
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = {
    width: 100,
    height: 100,
  };

  return (
    <div>
      {data && <EditPassword data={data}/>}
      <Footer/>
    </div>
  )
}

export default editPassword