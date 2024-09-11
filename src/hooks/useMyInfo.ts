import { AuthContext } from "@contexts/AuthProvider";
import { useContext } from "react";
import { useNavigate } from "react-router";

export function useMyInfo() {
  const { myInfo, setMyInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const isLoading = myInfo === null;

  const navigateIfDirectAccess = () => {
    // console.log(myInfo);
    if (myInfo === null) {
      navigate("/main");
    }
  };

  return { myInfo, setMyInfo, isLoading, navigateIfDirectAccess };
}
