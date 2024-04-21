import React, { useRef, useState, useEffect } from 'react';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isQuestionDone, setIsQuestionDone] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const startInterview = () => {
    setIsInterviewStarted(true);
    playVideo();
  };

  const playVideo = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    }
  };

  const playNextVideo = () => {
    const nextQuestion = currentQuestion+1;
    
    setCurrentQuestion(nextQuestion);
    const nextVideoId = `Q${nextQuestion}`;
    const nextVideo = document.getElementById(nextVideoId);

    if (nextVideo) {
      // Hide current video
      videoRef.current.style.display = 'none';
      
      // Show and play next video
      nextVideo.style.display = 'block';
      nextVideo.play();
    }
  };

  const handleSpeakClick = () => {
    fetch('http://localhost:8000/run-python-script')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.message === 'Question over') {
          setCurrentQuestion(currentQuestion => currentQuestion + 1);
          setIsQuestionDone(true);
          
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3030/api/send_data');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      console.log(event.data);
      if (event.data === 'Question over') {
        setIsQuestionDone(true);
      }
    };

    return () => {
      // ws.close();
      // console.log('Disconnected from WebSocket');
    };
  }, []);

  useEffect(() => {
    if (isQuestionDone) {
      playNextVideo();
    }
  }, [isQuestionDone]);

  return (
    <div>
      <h1>Interview Video Player</h1>
      {!isInterviewStarted && (
        <button onClick={startInterview}>Start Interview</button>
      )}
      <button onClick={handleSpeakClick}>Speak</button>
      <video
        ref={videoRef}
        controls={false}
        width="640"
        height="360"
        style={{ display: isQuestionDone ? 'none' : 'block' }}
        onEnded={() => setIsInterviewStarted(false)} // Reset interview status when video ends
      >
        <source src="/Q1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <video
        id="Q2"
        src="/Q2.mp4"
        controls={false}
        width="640"
        height="360"
        style={{ display: 'none' }}
      />
      <video
        id="Q3"
        src="/Q3.mp4"
        controls={false}
        width="640"
        height="360"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default VideoPlayer;
