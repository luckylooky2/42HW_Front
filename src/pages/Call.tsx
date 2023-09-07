import { AuthContext } from "@contexts/AuthProvider";
import { SocketContext } from "@contexts/SocketProvider";
import { StreamContext } from "@contexts/StreamProvider";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";
import CallButton from "@components/Call/CallButton";
import Timer from "@components/Call/Timer";
import MicrophoneSoundChecker from "@components/Call/MicrophoneSoundChecker";

const Call = () => {
  const navigate = useNavigate();
  const [opponentStatus, setOpponentStatus] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const { myInfo } = useContext(AuthContext);
  const { streamInfo } = useContext(StreamContext);
  const { socket } = useContext(SocketContext);
  const opponentVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance>(
    streamInfo.stream &&
      new Peer({
        initiator: streamInfo.initiator,
        trickle: false,
        stream: streamInfo.stream,
      })
  );
  const peer = peerRef.current;

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
        if (opponentVideo.current)
          if ("srcObject" in opponentVideo.current)
            opponentVideo.current.srcObject = currentStream;
        // else
        // opponentVideo.current.src =
        // window.URL.createObjectURL(currentStream);
      });

      peer.on("error", () => {
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
      stopMicrophone();
    };
  }, [peer, socket]);

  useEffect(() => {
    if (peer === null) {
      alert("메인 페이지를 통해 접근해주세요");
      navigate("/main");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", preventClose);

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);

  const preventClose = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    const result = window.confirm();
    if (result) {
      alert("통화가 종료되었습니다. 메인 화면으로 이동합니다.");
      navigate("/");
    }
    e.returnValue = result ? true : false;
  }, []);

  const muteToggle = useCallback(() => {
    const tracks = streamInfo.stream?.getAudioTracks();
    if (tracks) tracks[0].enabled = !tracks[0].enabled;
    setIsMuted((prev) => !prev);
  }, [streamInfo]);

  const stopMicrophone = useCallback(() => {
    const tracks = streamInfo.stream?.getAudioTracks();
    if (tracks) tracks[0].stop();
  }, [streamInfo]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="h-[15%] flex flex-col justify-evenly">
        <div className="text-4xl">chanhyle</div>
        <Timer opponentStatus={opponentStatus} />
        <video width={0} height={0} playsInline autoPlay ref={opponentVideo} />
        <ToastContainer />
      </div>
      <div className="h-[65%] w-full flex flex-col justify-center">
        <div className="h-[70%] w-[95%] overflow mx-auto">
          <MicrophoneSoundChecker />
          <div>
            opponent : {opponentStatus ? "🟢 connected" : "🔴 disconnected"}
            {!opponentStatus && <div>상대방이 연결을 종료하였습니다.</div>}
          </div>
        </div>
        <div className="grid grid-cols-3 max-w-[300px] h-[20%] w-full mx-auto">
          <CallButton
            onClick={() => {
              peer?.send("hello?");
            }}
            text="topic"
            img="topic.svg"
            disabled={!opponentStatus}
          />
          <CallButton
            onClick={() => {
              peer?.send("hello?");
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
        <CallButton
          onClick={() => {
            peer?.destroy();
            console.log("hang up");
            const tracks = streamInfo.stream?.getAudioTracks();
            if (tracks) tracks[0].stop();
            setIsMuted(true);
            navigate("/");
          }}
          type="hang-up"
          img="hang-up.svg"
        />
      </div>
    </div>
  );
};

export default Call;
