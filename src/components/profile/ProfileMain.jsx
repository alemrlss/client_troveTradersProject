/* eslint-disable react/prop-types */

import ProfileBody from "./ProfileBody";
import SidebarProfile from "./SidebarProfile";

function ProfileMain({ data }) {
  return (
    <div>
      <div className="p-16 bg-green-300 h-screen">
        <div className=" h-full shadow-2xl bg-white flex rounded-md">
          <SidebarProfile data={data} />
          <ProfileBody data={data} />
        </div>
      </div>
    </div>
  );
}

export default ProfileMain;
