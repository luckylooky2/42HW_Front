import { useEffect } from "react";
import { useNavigate } from "react-router";
import Loading from "@utils/Loading";

const Redirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("isLogin", "true");
    navigate("/main");
  }, []);

  return <Loading />;
};

export default Redirect;
