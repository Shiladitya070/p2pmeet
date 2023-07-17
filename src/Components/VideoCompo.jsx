import React, { useEffect, useRef } from "react";

function VideoCompo({ stream, name }) {
  const videoRef = useRef();
  useEffect(() => {
    if (videoRef && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [videoRef, stream]);
  return (
    <div className="flex flex-col justify-center items-center">
      <video
        style={{ transform: "rotateY(180deg)" }}
        className="rounded-lg m-2"
        ref={videoRef}
        autoPlay
        muted={false}
      />
      <h1 className=" font-mono ">{name}</h1>
    </div>
  );
}

export default VideoCompo;
