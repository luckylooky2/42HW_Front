import { AuthContext } from "@contexts/AuthProvider";
import { SocketContext } from "@contexts/SocketProvider";
import { StreamContext } from "@contexts/StreamProvider";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { API_URL } from "@utils/constant";
import Peer from "simple-peer";

const Call = () => {
  // peer 객체에서 찾아봐서 connection 여부에 따라 설정하자
  const [isConnected, setIsConnected] = useState(false);
  const { myInfo } = useContext(AuthContext);
  const { stream, initiator, opponent } = useContext(StreamContext);
  const { socket } = useContext(SocketContext);
  const myVideo = useRef<any>(null);
  const otherVideo = useRef<any>(null);

  const peer =
    stream &&
    new Peer({
      initiator: initiator,
      trickle: false,
      stream: stream,
    });

  useEffect(() => {
    if (myVideo.current) myVideo.current.srcObject = stream;

    if (peer) {
      peer.on("signal", (data) => {
        socket?.emit("joinSingle", {
          signal: data,
          name: myInfo?.nickname,
          opponent: opponent,
        });
      });

      peer.on("stream", (currentStream) => {
        otherVideo.current.srcObject = currentStream;
      });

      socket?.on("peerConnection", (data) => {
        peer.signal(data.signal);
      });
    }

    return () => {
      socket?.off("peerConnection");
    };
  }, [peer, socket]);

  useEffect(() => {}, [isConnected]);

  return (
    <>
      <video width={100} height={100} playsInline autoPlay ref={myVideo} />
      <video width={100} height={100} playsInline autoPlay ref={otherVideo} />
      <button
        onClick={() => {
          const tracks = stream?.getTracks();
          //   console.log(tracks);
          //   tracks[1].stop();
        }}
      >
        mute
      </button>
    </>
  );
};

export default Call;
