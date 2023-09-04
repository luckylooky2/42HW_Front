import { useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import Loading from "@utils/Loading";
import BasicButton from "@utils/BasicButton";
import { SocketContext } from "@utils/SocketProvider";
import { AuthContext } from "@utils/AuthProvider";
import { StreamContext } from "@utils/StreamProvider";
import Peer from "simple-peer";
import { CustomPeer } from "@utils/StreamProvider";

const Waiting = () => {
  const navigate = useNavigate();
  const { myInfo } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const { stream, setStream, peer, setPeer } = useContext(StreamContext);

  console.log(stream, peer);

  const cancelWaiting = useCallback(() => {
    navigate("/main");
  }, []);

  const getUserMedia = useCallback(async () => {
    let newStream;
    try {
      newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // const peer: CustomPeer = new Peer({
      //   initiator: false,
      //   trickle: false,
      //   stream: newStream,
      // });

      setStream(newStream);
      console.log("get audio");
    } catch (e) {
      alert("마이크 설정을 허용해주시기 바랍니다.");
      navigate("/");
    }
  }, []);

  useEffect(() => {
    getUserMedia();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("registerSingle", { nickname: myInfo?.nickname });

      socket.on("matching", (data: any) => {
        console.log("matching");
        setPeer(
          new Peer({
            initiator: data.initiator,
            // trickle: false,
            stream: stream,
          })
        );
        setTimeout(() => {
          navigate("/call");
        }, 3000);
      });
    }

    return () => {
      socket?.off("matching");
    };
  }, [socket, stream]);

  return (
    <Loading text="상대방을 찾는 중입니다.">
      <div className="my-auto">
        <BasicButton onClick={cancelWaiting} text="매칭 취소하기" />
      </div>
    </Loading>
  );
};

export default Waiting;
