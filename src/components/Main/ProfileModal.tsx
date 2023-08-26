import { FC, useCallback, useContext, useState } from "react";
import { AuthContext } from "@utils/AuthProvider";
import CloseButton from "@utils/CloseButton";
import { IUser } from "@typings/db";

interface Props {
  isOpen: boolean | null;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const ProfileModal: FC<Props> = ({ isOpen, setIsOpen }) => {
  const { myInfo, setMyInfo } = useContext(AuthContext);
  const [systemLang, setSystemLang] = useState("");
  const dummy: IUser = {
    id: 0,
    avatar:
      "https://cdn.intra.42.fr/users/e9b5e4a92782d715c9cf44819cce7695/chanhyle.jpg",
    nickname: "chanhyle",
    campus: "Seoul",
    level: 1.3,
    preferredLang: "en",
  };

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <div
        className="absolute w-full h-full z-0"
        style={{
          display: isOpen === null ? "none" : "block",
          animation: `${isOpen ? "slide-up" : "slide-down"} 0.5s ease forwards`,
        }}
        onClick={closeModal}
      />
      <div
        className="absolute w-[80%] h-[85%] bg-gray-100 rounded-xl z-2"
        style={{
          display: isOpen === null ? "none" : "block",
          animation: `${isOpen ? "slide-up" : "slide-down"} 0.5s ease forwards`,
        }}
      >
        <div className="h-full w-full p-6">
          <div className="h-[90%] w-full flex flex-col justify-around">
            <div className="flex h-[20%] w-full">
              <img
                draggable="false"
                className="h-[100%] aspect-square rounded-[100%] bg-[#ffffff] shadow-2xl"
                src={dummy ? dummy.avatar : "default-avatar.jpeg"}
                alt="main-avatar"
              />
              <div className="w-full flex flex-col justify-around">
                <div className="text-center">{dummy.nickname}</div>
                <div className="text-center">🇰🇷 42 {dummy.campus}</div>
                <div className="flex justify-center items-center">
                  <div className="text-center mx-3">
                    Lv {Math.floor(dummy.level)}
                  </div>
                  <div
                    style={{
                      backgroundColor: "#333333",
                      borderRadius: "5px",
                      width: "60%",
                      height: "15px",
                    }}
                  >
                    <div
                      style={{
                        width: isOpen ? `${(dummy.level % 1) * 100}%` : "0%",
                        height: "15px",
                        borderRadius: "5px",
                        backgroundColor: "#4caf50",
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col h-[20%] justify-between">
              <div className="h-[20%]">언어 설정</div>
              <div className="flex flex-col h-[75%] w-full justify-around bg-gray-200 rounded-md p-3">
                <div>
                  <span>배우고 싶은 언어 : </span>
                  <select className="w-20" disabled>
                    {["영어"].map((v) => (
                      <option>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span>시스템 언어 설정 : </span>
                  <select
                    className="w-20"
                    onChange={(e) => setSystemLang(e.target.value)}
                  >
                    {["한국어", "영어"].map((v) => (
                      <option>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-col h-[50%] justify-between">
              <div className="h-[8%]">대화 히스토리</div>
              <div className="h-[90%] overflow-auto justify-around bg-gray-200 rounded-md p-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse dolor neque, pellentesque et varius non, iaculis et
                velit. Sed nulla urna, ornare ac tincidunt condimentum, iaculis
                at turpis. Nullam sed laoreet urna. Vestibulum congue nulla
                vitae placerat rutrum. Praesent a ante a tortor suscipit viverra
                sit amet malesuada diam. Quisque venenatis justo ut mi
                consectetur, vitae ullamcorper diam ultrices. Aliquam ultricies
                luctus dignissim. In hac habitasse platea dictumst. Ut dignissim
                porttitor vulputate. Nunc erat elit, rhoncus in lorem a,
                vestibulum pellentesque est. Fusce porta laoreet lectus, quis
                porttitor turpis ornare eget. Integer malesuada at purus eu
                eleifend. Nullam commodo accumsan placerat. Suspendisse at est
                quis odio blandit posuere. Aliquam placerat quam urna, vel
                tincidunt elit dapibus pulvinar. Aenean vitae nisl blandit,
                efficitur felis non, venenatis risus. Vestibulum purus nulla,
                tristique congue est at, pulvinar gravida sapien. Pellentesque
                sagittis, sem at fringilla finibus, dui nisi vehicula risus, sed
                porta ante velit sit amet turpis. Curabitur augue massa,
                condimentum ac rutrum at, volutpat ac odio. Sed venenatis
                dapibus orci ut porttitor. Nunc dapibus enim eget cursus
                vehicula. Nullam congue tellus eget leo eleifend pellentesque.
                Quisque mi ante, convallis a quam vitae, tincidunt tincidunt
                metus. Pellentesque arcu augue, placerat eget ex eget, placerat
                vulputate sapien. Nulla accumsan porttitor augue ac rutrum.
                Aenean tincidunt quis ligula suscipit tristique. Suspendisse
                faucibus vel eros et semper. Pellentesque ante odio, porta vel
                consectetur sed, maximus in metus. Curabitur lobortis enim ut
                sem mollis, bibendum euismod ante gravida. Vivamus vehicula diam
                eget vehicula rutrum. Aliquam porttitor nibh vel tellus
                suscipit, a egestas purus commodo. Nam quis placerat justo.
                Vivamus ac mauris nisl. Pellentesque at ornare velit, eget
                lacinia risus. Fusce pharetra hendrerit tincidunt. Vivamus sed
                justo tellus. Sed vestibulum dolor quis odio porttitor interdum.
                Nulla vulputate risus non lobortis malesuada. Aenean bibendum
                justo ac mauris convallis, vel rutrum nisi gravida. Donec
                finibus mauris vel fringilla tempus. Aenean quis tortor non
                magna tincidunt feugiat consectetur id quam. Fusce ullamcorper
                vestibulum nulla eget imperdiet. Donec convallis urna nisi, eu
                sagittis nisi gravida mollis. Curabitur dapibus laoreet
                placerat. Duis tincidunt magna sit amet mi volutpat molestie.
                Phasellus consequat enim ut turpis porta aliquam. Nunc consequat
                metus ac sapien hendrerit, id facilisis arcu elementum. Nunc
                placerat laoreet felis, ut placerat enim tincidunt sed. Duis
                malesuada lacus lacus, eu ultrices tellus auctor quis. Mauris
                euismod, nunc vel gravida hendrerit, nulla nisl accumsan lorem,
                eget accumsan risus diam aliquam felis. Vestibulum vel congue
                erat, ut rutrum justo. Sed ut malesuada ligula, ac aliquam urna.
                Praesent placerat odio eu lorem aliquet, at imperdiet odio
                gravida.
              </div>
            </div>
          </div>
          <div className="h-[10%] flex items-center justify-center">
            <button
              className="w-40 h-8 block rounded-md bg-orange-100 hover:bg-orange-200 "
              onClick={closeModal}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfileModal;

// width: `${(dummy.level % 1) * 100}%`,
