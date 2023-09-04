import { AuthContext } from "@utils/AuthProvider";
import { SocketContext } from "@utils/SocketProvider";
import { StreamContext } from "@utils/StreamProvider";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { API_URL } from "@utils/constant";
import Peer from "simple-peer";

const Call = () => {
  const { myInfo } = useContext(AuthContext);
  const { stream, initiator, opponent } = useContext(StreamContext);
  const { socket } = useContext(SocketContext);
  const myVideo = useRef<any>(null);
  const otherVideo = useRef<any>(null);

  const peer = new Peer({
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
