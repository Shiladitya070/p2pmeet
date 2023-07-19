import React, { useEffect, useRef, useState } from "react";

function VideoCompo({ stream, audioStream, user }) {
  const videoRef = useRef();
  const audioRef = useRef();
  const [mute, setMute] = useState(false);
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
    <div className="flex flex-col justify-center items-center mx-2">
      <h1 className=" font-mono ">{user}</h1>

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
          <div className="flex flex-col justify-center items-center ">
            <video className="rounded-lg m-2" ref={videoRef} autoPlay muted />
            <button
              onClick={() => setMute(!mute)}
              className="bg-slate-400 rounded-md p-1"
            >
              {mute ? "unmute" : "mute"}
            </button>

            <audio
              style={{ background: "none" }}
              className="relative bottom-10"
              ref={audioRef}
              controls
              muted={mute}
              hidden
              autoPlay
            />
          </div>
        </>
      )}
    </div>
  );
}

export default VideoCompo;
