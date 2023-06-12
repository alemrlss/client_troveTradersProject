import { useState } from "react";

function About() {
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
      <div className=" w-1/4 h-full flex flex-col p-4 border-r-2 border-gray-400 ">
        <p className="text-3xl pb-2 text-center">Information</p>
        <button
          onClick={handleButtons}
          className={`m-1 text-xl text-gray-600 font-bold ${btnGeneralClass}`}
        >
          General information
        </button>
        <button
          onClick={handleButtons}
          className={`m-1 text-xl text-gray-600 font-bold ${btnWarningClass}`}
        >
          Warnings
        </button>
        <button
          onClick={handleButtons}
          className={`m-1 text-xl text-gray-600 font-bold ${btnLastsPostsClass}`}
        >
          Lasts Posts
        </button>
        <button
          onClick={handleButtons}
          className={`m-1 text-xl text-gray-600 font-bold ${btnRatingsClass}`}
        >
          Ratings
        </button>
      </div>
      <div className="w-3/4">
        {isClicked === optionsAbout.general && <div> General info</div>}
        {isClicked === optionsAbout.warnings && <div> Warnings info</div>}
        {isClicked === optionsAbout.lastsPosts && <div> LastsPosts info</div>}
        {isClicked === optionsAbout.ratings && <div> Ratings info</div>}
      </div>
    </div>
  );
}

export default About;
