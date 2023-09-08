import React, { FC, SetStateAction, useCallback } from "react";
import CallButton from "./CallButton";
import { SCREEN } from "@utils/constant";

interface Props {
  opponentStatus: boolean;
  isMuted: boolean;
  muteToggle: () => void;
  setScreen: React.Dispatch<SetStateAction<string>>;
}

const InitialScreen: FC<Props> = ({
  opponentStatus,
  isMuted,
  muteToggle,
  setScreen,
}) => {
  const openTopicSelect = useCallback(() => {
    setScreen(SCREEN.TOPIC_SELECT);
  }, []);

  return (
    <>
      <div className="h-[70%] w-[95%] overflow mx-auto">
        <div>
          opponent : {opponentStatus ? "🟢 connected" : "🔴 disconnected"}
          {!opponentStatus && <div>상대방이 연결을 종료하였습니다.</div>}
        </div>
      </div>
      <div className="grid grid-cols-3 max-w-[300px] h-[20%] w-full mx-auto">
        <CallButton
          onClick={openTopicSelect}
          text="topic"
          img="topic.svg"
          disabled={!opponentStatus}
        />
        <CallButton
          onClick={() => {}}
          text="game"
          img="game.svg"
          disabled={!opponentStatus}
        />
        <CallButton
          onClick={muteToggle}
          clicked={isMuted}
          text={isMuted ? "mute off" : "mute"}
          img={isMuted ? "mute-off.svg" : "mute.svg"}
        />
      </div>
    </>
  );
};

export default InitialScreen;
