import { AuthContext } from "@utils/AuthProvider";
import { SocketContext } from "@utils/SocketProvider";
import { StreamContext } from "@utils/StreamProvider";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { API_URL } from "@utils/constant";

const Call = () => {
  const { myInfo } = useContext(AuthContext);
  const { stream, peer } = useContext(StreamContext);
  const { socket } = useContext(SocketContext);
  const myVideo = useRef<any>(null);
  const otherVideo = useRef<any>(null);

  console.log(peer, socket);

  useEffect(() => {
    if (myVideo.current) myVideo.current.srcObject = stream;

    if (peer) {
      peer.on("signal", (data) => {
        socket?.emit("joinCaller", {
          signal: data,
          name: myInfo?.nickname,
        });
      });

      peer.on("stream", (currentStream) => {
        otherVideo.current.srcObject = currentStream;
      });

      socket?.on("callAccepted", (data) => {
        peer.signal(data.signal);
      });
    }

    console.log(myVideo);

    return () => {
      //   peer?.off("signal");
    };
  }, [peer, socket]);

  return (
    <>
      <video width={100} height={100} playsInline autoPlay ref={myVideo} />
      <video width={100} height={100} playsInline autoPlay ref={otherVideo} />
      <button
        onClick={() => {
          const tracks = stream.current.getTracks();
          console.log(tracks);
          tracks[1].stop();
          //   tracks[1].play();
        }}
      >
        toggle
      </button>
    </>
  );
};

export default Call;
