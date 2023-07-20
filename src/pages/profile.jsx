/* eslint-disable react-hooks/rules-of-hooks */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../services/Auth";
import Loader from "../components/Loader/Loader";
import ProfileMain from "../components/profile/ProfileMain";

function profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/users/${id}`,
          config
        );
        setLoading(false);
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
      {loading && <Loader options={options} />}
      {data && <ProfileMain data={data} />}
    </div>
  );
}

export default profile;
