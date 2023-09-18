import React from "react";

const InitialScreen = () => {
  return (
    <div className="flex justify-center w-full h-full p-5">
      <div className="bg-gray-100 w-full h-full max-w-[350px] mx-auto rounded-lg overflow-auto">
        <div className="p-5">
          <div>
            <p>
              <div>Start talking!</div>
              <div>What is your name?</div>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialScreen;
