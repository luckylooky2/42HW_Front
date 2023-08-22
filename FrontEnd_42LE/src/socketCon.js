import React, { useState, createContext, useEffect, useRef, } from "react";
import { io } from "socket.io-client";
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io('http://52.78.125.103:3001');


const SocketCon = ({ children }) => {
	const [socketId, setSocketId] = useState('');
	const [stream, setStream] = useState();
	const [call, setCall] = useState({});
	const [callAccepted, setCallAccepted] = useState(false);
	const [name, setName] = useState('');
	// const [callEnded, setCallEnded] = useState(false);

	const myVideo = useRef();
	const userVideo = useRef();
	const connectionRef = useRef();

	/**
	 * @name getUserCamera
	 * @bref 내 카메라를 가져옴
	 * @promise 카메라 실행
	 * @url https://solbel.tistory.com/1912
	 */
	const getUserCamera = () => {
		navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(( e ) => {
			setStream(e);
			let video = myVideo.current
			video.srcObject = e;
			const playPromise = video.play();
			if (playPromise !== undefined)
				playPromise.then((_) => { }).catch((error) => { });
		}).catch((error) => {console.log(error)})
	}

	const socketOnHandle = () => {
		socket.on("connect", (payload) => { console.log("connect"); setSocketId(socket.id); })

		socket.on('callUser', (payload) => {
			console.log('socket callUser')
			// payload = {to : param, from: socketId, signal: data}
			setCall( {on: true, from: payload.from, signal : payload.signal});
		})
	}

	useEffect(() => {
		getUserCamera();
		socketOnHandle();
	}, [myVideo])

	const answerCall = () => {
		console.log('ft ?? answerCall');
		setCallAccepted(true);
		const peer = new Peer({ initiator: false, stream: stream  });

		peer.on('signal', (data) => {
			var payload;
			payload = {to : call.from, signal: data}
			console.log('answerCall signal', payload);
			socket.emit('answerCall',  payload);
		})

		peer.on('stream', (currentStream) => {
			console.log('answerCall stream', currentStream);
			userVideo.current.srcObject = currentStream;
		});

		peer.signal(call.signal);

		connectionRef.current = peer;
	}


	const callUser = (param) => {
		console.log('ft ?? callUser', param);
		const peer = new Peer({initiator: true, stream: stream  });

		peer.on('signal', (data) => {
			var payload;

			payload = {to : param, from: socketId, signal: data,}
			console.log('callUser signal', payload);
			socket.emit('callUser', payload);
		});
		peer.on('stream', (currentStream) => {
			console.log('callUser stream', currentStream);
			userVideo.current.srcObject = currentStream;
		});

		socket.on('callAccepted', (payload) => {
			console.log('callUser callAccepted', payload);
			setCallAccepted(true);
			//payload = {to : call.from, signal: data}
			peer.signal(payload.signal)
		})

		connectionRef.current = peer;
	}

	return (
		<SocketContext.Provider value={{
			socketId,
			myVideo,
			userVideo,
			call,
			callAccepted,
			answerCall,
			callUser,
		}}>
			{children}
		</SocketContext.Provider>
	)
}


export { SocketCon, SocketContext };