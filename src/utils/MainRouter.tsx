import React, { useState } from "react";
import { Routes, Route } from "react-router";
import Main from "@pages/Main";
import Waiting from "@pages/Waiting";
import Call from "@pages/Call";
import Setting from "@pages/Setting";
import NotFound from "@pages/NotFound";
import Profile from "@pages/Profile";

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
