import { useEffect } from "react";
import { useNavigate } from "react-router";
import qs from "query-string";
import axios from "axios";
import Loading from "@utils/Loading";

const Redirect = () => {
  const params = qs.parse(window.location.search);
  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(params).length !== 0) {
      localStorage.setItem("at", params.token as string);
      axios.defaults.headers.common["Authorization"] = `Bearer ${params.token}`;
      localStorage.setItem("isLogin", "true");
      navigate("/main");
    } else navigate("/login");
  }, []);

  return <Loading />;
};

export default Redirect;
