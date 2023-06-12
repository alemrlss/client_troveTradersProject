/* eslint-disable react/prop-types */
import { useState } from "react";
import About from "./About";
import Trades from "./Trades";
function ProfileBody({ data }) {
  const profileOptions = {
    about: "about",
    trades: "trades",
  };

  const decorationButton = " border-b-4 border-green-800";

  const [isClicked, setisClicked] = useState(profileOptions.about);

  const [classButtonAbout, setClassButtonAbout] = useState(decorationButton);
  const [classButtonTrades, setClassButtonTrades] = useState("");

  const handleButtons = (e) => {
    setisClicked(e.target.textContent.toLowerCase());

    if (e.target.textContent.toLowerCase() === profileOptions.about) {
      setClassButtonTrades('')
      setClassButtonAbout(decorationButton)
    }
    if (e.target.textContent.toLowerCase() === profileOptions.trades) {
      setClassButtonAbout('')
      setClassButtonTrades(decorationButton)
    }
  };

  return (
    <div className="w-3/4 rounded-r-md flex flex-col p-10">
      <div className="bg-green-200">
        <div className="flex flex-row">
          <h2 className="text-3xl flex-grow">
            {data.name} {data.lastName}
          </h2>
          <button className="bg-orange-300 mr-5 pr-2 pl-2">Edit Profile</button>
        </div>
        <p className="pl-4 text-xl text-gray-600">@{data.username}</p>
        <p className="pl-4 m-6 text-xl">RANKING: 0/5</p>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex pl-2">
          <button
            onClick={handleButtons}
            className={`btn-profile-about p-2${classButtonAbout}`}
          >
            About
          </button>
          <button
            onClick={handleButtons}
            className={`btn-profile-trades p-2${classButtonTrades}`}
          >
            Trades
          </button>
        </div>

        <div className="h-full">
          {isClicked === profileOptions.about && <About />}
          {isClicked === profileOptions.trades && <Trades />}
        </div>
      </div>
    </div>
  );
}

export default ProfileBody;
