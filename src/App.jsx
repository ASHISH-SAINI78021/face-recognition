import {useRef,useEffect} from 'react'
import './App.css'
import * as faceapi from 'face-api.js'

function App(){
  const videoRef = useRef(null);
  const canvasRef = useRef(null); 

  const detectMyFace = async()=> {
    setInterval(async() => {
      const detections = await faceapi.detectAllFaces(videoRef.current , new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

    const detectionsForSize = faceapi.resizeResults(detections , {width : videoRef.current.width , height : videoRef.current.height});

    // canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
    canvasRef.current.width = videoRef.current.width;
    canvasRef.current.height = videoRef.current.height;

    faceapi.draw.drawDetections(canvasRef.current , detectionsForSize , {withScore : true});
    faceapi.draw.drawFaceLandmarks(canvasRef.current , detectionsForSize , {drawLines : true});
    faceapi.draw.drawFaceExpressions(canvasRef.current, detectionsForSize);
    }, 1000);
    
  }
  const loadModals = async()=> {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      detectMyFace();
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(()=> {
    const init = async()=> {
      const stream = await navigator.mediaDevices.getUserMedia({video : true});
      videoRef.current.srcObject = stream;
      videoRef.current.width = 500;
      videoRef.current.height = 300;
    }
    init();
    videoRef && loadModals();
  } , [videoRef]);

  return (
    <div className="myapp">
    <h1>Face Detection</h1>
      <div className="hello">
        
      <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
      <canvas ref={canvasRef} width="940" height="650"
      className="appcanvas"/>
      </div>
     
    </div>
    )

}

export default App;