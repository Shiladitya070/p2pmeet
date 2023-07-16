import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socketIO from "socket.io-client";

function Meeting() {
  const params = useParams();
  const roomId = params.roomId;
  const [socket, setSocket] = useState(null);
  const [videoStream, setVideoStream] = useState();
  const myVideo = useRef(null);
  const otherVideo = useRef(null);
  useEffect(() => {
    const s = socketIO.connect("http://localhost:3000");
    s.on("connect", () => {
      setSocket(s);
      s.emit("join", {
        roomId,
      });
      window.navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then(async (stream) => {
          setVideoStream(stream);
          console.log(stream);
          myVideo.current.srcObject = stream;
        });
    });
  }, []);

  return (
    <div className="min-h-screen">
      <div className="absolute top-0 flex flex-col justify-center items-center ">
        <h1 className="m-2 bg-slate-300 bg-opacity-10 border-2 w-fit p-2 font-mono rounded-lg">
          Room Id: {roomId}
        </h1>
        <div className="flex flex-wrap gap-2 justify-center mx-4">
          <div className="">
            <p>your video</p>
            <video
              style={{ transform: "rotateY(180deg)" }}
              className="rounded-lg"
              ref={myVideo}
              autoPlay
              muted
            />
          </div>
          <div>
            <p>Other video</p>
            <video
              style={{ transform: "rotateY(180deg)" }}
              className="rounded-lg"
              ref={otherVideo}
              autoPlay
              muted
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Meeting;
