
import React from "react";
import ChangePassword from "./ChangePassword";
import UpdateProfile from "./UpdateProfile";

const Settings = () => {
  return (
    <div className="m-4">
      <UpdateProfile />
      <ChangePassword />
    </div>
  );
};

export default Settings;
