/* eslint-disable react/prop-types */
import axios from "axios";
import { AiFillTags } from "react-icons/ai";
function RequestsComponent({ openModal, setRequests, id }) {

 
  const getRequestsUser = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${id}/requests`);
      const data = response.data;

     const reversedData = data.requests.reverse();
      setRequests(reversedData);
      console.log(data.requests)
      openModal();
    } catch (error) {
      console.error("Error al obtener las solicitudes:", error);
    }
  };


  return (

      <button
        onClick={getRequestsUser}
        className="text-secondary-100 p-3"
      >
        <AiFillTags className="h-6 w-6"/>

      </button>
  );
}

export default RequestsComponent;
