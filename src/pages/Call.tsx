import { AuthContext } from "@contexts/AuthProvider";
import { SocketContext } from "@contexts/SocketProvider";
import { StreamContext } from "@contexts/StreamProvider";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { useNavigate } from "react-router";
import CallButton from "@components/Call/CallButton";
import Timer from "@components/Call/Timer";
import MicrophoneSoundChecker from "@utils/MicrophoneSoundChecker";
import InitialScreen from "@components/Call/InitialScreen";
import { SCREEN } from "@utils/constant";
import TopicSelect from "@components/Call/TopicSelect";
import { TURN_URL, TURN_USERNAME, TURN_PASSWORD } from "@utils/constant";

const Call = () => {
  const navigate = useNavigate();
  const [opponentStatus, setOpponentStatus] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [screen, setScreen] = useState(SCREEN.INIT);
  const { myInfo } = useContext(AuthContext);
  const { streamInfo } = useContext(StreamContext);
  const { socket } = useContext(SocketContext);
  const opponentVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance>(
    streamInfo.stream &&
      new Peer({
        initiator: streamInfo.initiator,
        trickle: true,
        stream: streamInfo.stream,
        config: {
          iceServers: [
            {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302",
              ],
            },
            {
              urls: `turn:${TURN_URL}`,
              username: TURN_USERNAME,
              credential: TURN_PASSWORD,
            },
          ],
        },
      })
  );
  const peer = peerRef.current;
  console.log("my : ", streamInfo.stream);
  console.log(streamInfo);

  // TODO : 좌우 반전, 마이크 mute
  useEffect(() => {
    if (peer) {
      peer.on("signal", (data) => {
        socket?.emit("joinSingle", {
          signal: data,
          name: myInfo?.nickname,
          opponent: streamInfo.opponent,
        });
      });

      peer.on("stream", (currentStream) => {
        console.log("others :", currentStream);
        if (opponentVideo.current)
          //   // if ("srcObject" in opponentVideo.current)
          opponentVideo.current.srcObject = currentStream;
        // else
        // opponentVideo.current.src =
        // window.URL.createObjectURL(currentStream);
      });

      peer.on("error", (err) => {
        console.log(err);
        setOpponentStatus(false);
        console.log("opponent left");
      });

      peer.on("close", () => {
        console.log("Peer 연결이 종료되었습니다.");
        setOpponentStatus(false);
      });

      peer.on("data", (data) => console.log(data));

      socket?.on("peerConnection", (data) => {
        peer.signal(data.signal);
      });
    }

    return () => {
      socket?.off("peerConnection");
    };
  }, [peer, socket]);

  useEffect(() => {
    if (peer === null) {
      navigate("/main");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", preventClose);

    return () => {
      window.removeEventListener("beforeunload", preventClose);
      stopMicrophone();
    };
  }, []);

  const preventClose = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = true;
  }, []);

  const muteToggle = useCallback(() => {
    const tracks = streamInfo.stream?.getAudioTracks();
    if (tracks) tracks[0].enabled = !tracks[0].enabled;
    setIsMuted((prev) => !prev);
  }, [streamInfo]);

  const hangUp = useCallback(() => {
    peer?.destroy();
    console.log("hang up");
    const tracks = streamInfo.stream?.getAudioTracks();
    if (tracks) tracks[0].stop();
    setIsMuted(true);
    navigate("/");
  }, [peer, streamInfo]);

  const stopMicrophone = useCallback(() => {
    const tracks = streamInfo.stream?.getAudioTracks();
    if (tracks) tracks[0].stop();
  }, [streamInfo]);

  const openTopicSelect = useCallback(() => {
    setScreen(SCREEN.TOPIC_SELECT);
  }, []);

  const closeTopicSelect = useCallback(() => {
    setScreen(SCREEN.INIT);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="h-[15%] flex flex-col justify-evenly">
        <video
          width={1}
          height={1}
          playsInline
          autoPlay
          muted={false}
          ref={opponentVideo}
        />
        <div className="text-4xl">{streamInfo.opponentNickname}</div>
        <Timer opponentStatus={opponentStatus} />
        <MicrophoneSoundChecker />
      </div>
      <div className="h-[65%] w-full flex flex-col justify-center">
        <div className="h-[75%] w-[95%] overflow mx-auto">
          {screen === SCREEN.INIT && (
            <InitialScreen opponentStatus={opponentStatus} />
          )}
          {screen === SCREEN.TOPIC_SELECT && <TopicSelect />}
        </div>
        <div className="grid grid-cols-3 max-w-[300px] h-[25%] w-full mx-auto">
          <CallButton
            onClick={
              screen === SCREEN.TOPIC_SELECT
                ? closeTopicSelect
                : openTopicSelect
            }
            text={screen === SCREEN.TOPIC_SELECT ? "return" : "topic"}
            img={screen === SCREEN.TOPIC_SELECT ? "return.svg" : "topic.svg"}
            disabled={!opponentStatus}
          />
          <CallButton
            onClick={() => {
              peer?.send("hello");
            }}
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
      </div>
      <div className="flex justify-center h-[10%]">
        <CallButton onClick={hangUp} type="hang-up" img="hang-up.svg" />
      </div>
    </div>
  );
};

export default Call;
