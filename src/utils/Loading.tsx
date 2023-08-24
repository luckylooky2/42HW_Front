import { PulseLoader } from "react-spinners";

const Loading = () => {
  const pulseLoaderCss = {
    paddingTop: "20px",
    width: "45px",
    margin: "0 auto",
  };

  return (
    <div className="flex flex-col h-full justify-center">
      <div className="px-10 h-1/4" />
      <div className="pt-8 h-1/3">
        <img className="mx-auto" src="login-image.svg" alt="loading" />
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

export default Loading;
