import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socketIO from "socket.io-client";
import VideoCompo from "../Components/VideoCompo";

export default function Meeting() {
  const params = useParams();
  const roomId = params.roomId;
  const [myVideo, setMyVideo] = useState();
  const [otherVideo, setOtherVideo] = useState();
  const [socket, setSocket] = useState(null);
  const [isInMeeting, setIsInMeeting] = useState(false);

  console.log("rendering meeting");
  console.log("📩", process.env.REACT_APP_SERVER);
  useEffect(() => {
    const s = socketIO.connect(process.env.REACT_APP_SERVER);
    s.emit("join", {
      roomId,
    });
    if (s) {
      console.log("connection done", s);
      setSocket(s);
    }
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then(async (stream) => {
        setMyVideo(stream);
      });

    s.on("localDescription", async ({ description }) => {
      console.log("localDescription");
      // Receiving video -
      let pc = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      });
      console.log("pc made");
      pc.setRemoteDescription(description);
      pc.ontrack = (e) => {
        setOtherVideo(new MediaStream([e.track]));
        console.log("added remote video");
      };

      s.on("iceCandidate", ({ candidate }) => {
        pc.addIceCandidate(candidate);
        console.log("add ice candidate");
      });

      pc.onicecandidate = ({ candidate }) => {
        s.emit("iceCandidateReply", { candidate });
        console.log("ice candidate reply");
      };

      await pc.setLocalDescription(await pc.createAnswer());
      s.emit("remoteDescription", { description: pc.localDescription });
      console.log("set local description");
    });
  }, []);
  const createOffer = () => {
    // sending pc
    let pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });
    console.log("pc created", pc);
    // pc.onicecandidate = ({ candidate }) => {
    //   // socket.emit("iceCandidate", { candidate });
    //   console.log(candidate);
    //   console.log("emmied iceCandidate");
    // };
    console.log("🥺", myVideo.getVideoTracks());
    pc.addTrack(myVideo.getVideoTracks()[0]);
    console.log("myvideo added ");
    pc.onicecandidate = ({ candidate }) => {
      socket.emit("iceCandidate", { candidate });
      console.log("emmied iceCandidate");
    };

    pc.onnegotiationneeded = async () => {
      console.log("onnegotiationneeded");
      try {
        await pc.setLocalDescription(await pc.createOffer());
        console.log(pc.localDescription);
        socket.emit("localDescription", { description: pc.localDescription });
      } catch (err) {
        console.error(err);
      }
    };

    socket.on("remoteDescription", async ({ description }) => {
      await pc.setRemoteDescription(description);
    });
    socket.on("iceCandidateReply", ({ candidate }) => {
      pc.addIceCandidate(candidate);
    });
    setIsInMeeting(true);
  };
  const mainVideo = (
    <div className="min-h-screen flex justify-center ">
      <div className="absolute top-0 flex flex-col justify-center items-center ">
        <h1 className="m-2 bg-slate-300 bg-opacity-10 border-2 w-fit p-2 font-mono rounded-lg">
          Room Id: {roomId}
        </h1>
        <div className="flex flex-wrap gap-2 justify-center items-center mx-4">
          <VideoCompo stream={myVideo} name="your name" />

          {otherVideo ? (
            <VideoCompo stream={otherVideo} name={"hello"} />
          ) : (
            <h1>Waiting for others</h1>
          )}
        </div>
      </div>
      {!isInMeeting && (
        <button
          onClick={createOffer}
          className="absolute bottom-0 bg-blue-600 p-2 rounded-md m-4"
        >
          start meeting
        </button>
      )}
    </div>
  );

  return mainVideo;
}
