/* eslint-disable react/prop-types */
import { FcHighPriority } from "react-icons/fc";
import img from "../../assets/defaultProfile.png";
import { useState } from "react";
function SidebarProfile({ data }) {
  const [userData, setUserData] = useState(data);
  return (
    <div className="w-1/4 bg-white rounded-l-md border-solid border-black border-2 flex flex-col">
      <img
        className="h-1/4 m-10 mr-20  ml-20 border-solid border-black border-4 rounded-full"
        src={
          userData.imageProfile
            ? `http://localhost:3001/image/profile/${userData.imageProfile}`
            : img
        }
        alt=""
      />

      <div className="p-8">
        <h2 className="text-black p-1">Opcion #1</h2>
      </div>

      <div className=" flex items-center justify-center text-3xl">
        <FcHighPriority className="m-3" />
        <p className="text-red-600 font-semibold">Not Verified</p>
      </div>
    </div>
  );
}

export default SidebarProfile;
