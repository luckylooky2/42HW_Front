import React, { useContext, useState } from "react";
import { SocketContext } from "../socketCon";

const VideoPlayer = () => {
	const { socketId, myVideo, userVideo,

		call,
		callAccepted,
		answerCall,
		callUser
	} = useContext(SocketContext);

	const [callSocketId, setCallSocketId] = useState("");

	const handleChange = (e) => { 
		setCallSocketId(e.target.value);
	};
	function Button({ disabled, children }) {
		return <button disabled={disabled}>{children}</button>;
	  }
	
	
	console.log("user : ", myVideo, userVideo, socketId);
	return (
		<div>
			<div>
				<p>내 Video</p>
				<video playsInline ref={myVideo} autoPlay />
				<p>socket id : '{socketId}'</p>
			</div>
			<div>
				<p>상대 Video</p>
				<video playsInline ref={userVideo} autoPlay />
			</div>

			<div>
				<button onClick={() => {callUser(callSocketId)} }>부르기</button>
				
				<input value={callSocketId} onChange={ (e) => {handleChange(e)} } />

			</div>
				<div>
					<p> 상대편 : {call.from}   </p>
					<button onClick={() => {answerCall()}}>
						Answer
					</button>
				</div>
		</div>
	)
}

export default VideoPlayer