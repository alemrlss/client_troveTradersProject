/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { HiUser } from "react-icons/hi";


function General({ data }) {
  return (
    <div className="flex flex-col">
      <h2 className="text-center text-2xl font-bold p-4">
        General Information
      </h2>
      <div className="m-4 flex">
        <div className="w-2/4 ">
          <div className="p-2 text-2xl flex">
            <HiUser className="m-1 mr-4" />
            <p>Name:</p>
          </div>
          <div className="p-2 text-2xl flex">
            <HiUser className="m-1 mr-4" />
            <p>Last name:</p>
          </div>
          <div className="p-2 text-2xl flex">
            <HiUser className="m-1 mr-4" />
            <p>Username:</p>
          </div>
          <div className="p-2 text-2xl flex">
            <HiUser className="m-1 mr-4" />
            <p>Gender:</p>
          </div>
          <div className="p-2 text-2xl flex">
            <HiUser className="m-1 mr-4" />
            <p>Role:</p>
          </div>
        </div>
        <div className="w-2/4">
          <p className="p-2 text-2xl text-blue-700 font-semibold">{data.name}</p>
          <p className="p-2 text-2xl text-blue-700 font-semibold">
            {data.lastName}
          </p>
          <p className="p-2 text-2xl text-blue-700 font-semibold">
            {data.username}
          </p>
          <p className="p-2 text-2xl text-blue-700 font-semibold">
            {data.gender}
          </p>
          <p className="p-2 text-2xl text-blue-700 font-semibold">{data.role}</p>
        </div>
      </div>
    </div>
  );
}

export default General;
