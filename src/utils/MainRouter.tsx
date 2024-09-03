import Call from "@pages/Call";
import Main from "@pages/Main";
import NotFound from "@pages/NotFound";
import Profile from "@pages/Profile";
import Setting from "@pages/Setting";
import Waiting from "@pages/Waiting";
import React, { useState } from "react";
import { Routes, Route } from "react-router";

const MainRouter = () => {
  const [isLoading] = useState(true);

  return (
    <Routes>
      <Route path="/main" Component={Main} />
      <Route path="/profile" Component={Profile} />
      <Route path="/setting" Component={Setting} />
      <Route path="/waiting" Component={Waiting} />
      <Route path="/call" Component={Call} />
      <Route path="*" element={<NotFound isLoading={isLoading} />} />
    </Routes>
  );
};

export default MainRouter;
