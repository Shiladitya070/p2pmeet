import React, { useEffect, useRef } from "react";

function VideoCompo({ stream, audioStream, name }) {
  const videoRef = useRef();
  const audioRef = useRef();
  useEffect(() => {
    if (videoRef && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [videoRef, stream]);
  useEffect(() => {
    if (audioRef && audioRef.current) {
      audioRef.current.srcObject = audioStream;
    }
  }, [audioRef, audioStream]);

  return (
    <div className="flex flex-col justify-center items-center">
      {!audioStream ? (
        <video
          style={{ transform: "rotateY(180deg)" }}
          className="rounded-lg m-2"
          ref={videoRef}
          muted
          autoPlay
        />
      ) : (
        <>
          <video
            style={{ transform: "rotateY(180deg)" }}
            className="rounded-lg m-2 bg-red-700 p-2"
            ref={videoRef}
            autoPlay
            muted
          />
          <audio ref={audioRef} controls autoplay />
        </>
      )}
      <h1 className=" font-mono ">{name}</h1>
    </div>
  );
}

export default VideoCompo;
