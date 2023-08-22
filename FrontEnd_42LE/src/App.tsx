import React from 'react';
import './App.css';

import VideoPlayer from './components/VideoPlayer';


function App() {
	console.log("app console");
	return (
		<div className="App">
			<header className="App-header">
				<VideoPlayer />
			</header>
		</div>
	);
}

export default App;
