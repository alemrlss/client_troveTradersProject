import { useState } from "react";
import General from "./About/General";
import Warnings from "./About/Warnings";
import LastsPosts from "./About/LastsPosts";
import Ratings from "./About/Ratings";

// eslint-disable-next-line react/prop-types
function About({data}) {
  const optionsAbout = {
    general: "general information",
    warnings: "warnings",
    lastsPosts: "lasts posts",
    ratings: "ratings",
  };
  const [isClicked, setIsClicked] = useState(optionsAbout.general);

  const isActive = " text-blue-700 underline";

  const [btnGeneralClass, setBtnGeneral] = useState(isActive);
  const [btnWarningClass, setBtnWarningClass] = useState("");
  const [btnLastsPostsClass, setBtnLastsPostsClass] = useState("");
  const [btnRatingsClass, setBtnRatingsClass] = useState("");

  const handleButtons = (e) => {
    setIsClicked(e.target.textContent.toLowerCase());

    if (e.target.textContent.toLowerCase() === optionsAbout.general) {
      setBtnGeneral(isActive);
      setBtnWarningClass("");
      setBtnLastsPostsClass("");
      setBtnRatingsClass("");
    }

    if (e.target.textContent.toLowerCase() === optionsAbout.warnings) {
      setBtnGeneral("");
      setBtnWarningClass(isActive);
      setBtnLastsPostsClass("");
      setBtnRatingsClass("");
    }

    if (e.target.textContent.toLowerCase() === optionsAbout.lastsPosts) {
      setBtnGeneral("");
      setBtnWarningClass("");
      setBtnLastsPostsClass(isActive);
      setBtnRatingsClass("");
    }

    if (e.target.textContent.toLowerCase() === optionsAbout.ratings) {
      setBtnGeneral("");
      setBtnWarningClass("");
      setBtnLastsPostsClass("");
      setBtnRatingsClass(isActive);
    }
  };

  return (
    <div className="m-2 h-full flex bg-orange-200">
      <div className=" w-1/4 h-full flex flex-col p-4 border-r-2 border-gray-400 text-gray-600 ">
        <p className="text-3xl pb-2 text-center text-black">Information</p>
        <button
          onClick={handleButtons}
          className={`m-1 text-xl font-bold  ${btnGeneralClass}`}
        >
          General information
        </button>
        <button
          onClick={handleButtons}
          className={`m-1 text-xl font-bold ${btnWarningClass}`}
        >
          Warnings
        </button>
        <button
          onClick={handleButtons}
          className={`m-1 text-xl font-bold ${btnLastsPostsClass}`}
        >
          Lasts Posts
        </button>
        <button
          onClick={handleButtons}
          className={`m-1 text-xl  font-bold ${btnRatingsClass}`}
        >
          Ratings
        </button>
      </div>
      <div className="w-3/4">
        {isClicked === optionsAbout.general && <General data={data} />}
        {isClicked === optionsAbout.warnings && <Warnings />}
        {isClicked === optionsAbout.lastsPosts && <LastsPosts />}
        {isClicked === optionsAbout.ratings && <Ratings />}
      </div>
    </div>
  );
}

export default About;
