/* eslint-disable react/prop-types */
import axios from "axios";
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
    <li>
      <button
        onClick={getRequestsUser}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Solicitudes

      </button>
    </li>
  );
}

export default RequestsComponent;
