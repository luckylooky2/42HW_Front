import { useEffect } from "react";
import { useNavigate } from "react-router";
import { PulseLoader } from "react-spinners";
import qs from "query-string";
import axios from "axios";

const pulseLoaderCss = {
  paddingTop: "20px",
  width: "45px",
  margin: "0 auto",
};

const Redirect = () => {
  const navigate = useNavigate();
  const params = qs.parse(window.location.search);
  useEffect(() => {
    if (Object.keys(params).length !== 0) {
      localStorage.setItem("at", params.token as string);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${params.access_token}`;
    }
    setTimeout(() => {
      navigate("/main");
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col h-full justify-center">
      <div className="px-10 h-1/4" />
      <div className="pt-8 h-1/3">
        <img className="mx-auto" src="login-image.svg" alt="login-image" />
        <PulseLoader
          color={"#808080"}
          size={10}
          aria-label="Loading Spinner"
          data-testid="loader"
          cssOverride={pulseLoaderCss}
        />
      </div>
      <div className="flex justify-center h-1/6"></div>
    </div>
  );
};

export default Redirect;
