import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socketIO from "socket.io-client";
import VideoCompo from "../Components/VideoCompo";
import { toast } from "react-hot-toast";
import ChatBox from "../Components/ChatBox";

export default function Meeting() {
  const params = useParams();
  const roomId = params.roomId;
  const [myVideo, setMyVideo] = useState();
  const [otherVideo, setOtherVideo] = useState();
  const [otherAudio, setOtherAudio] = useState();
  const [socket, setSocket] = useState(null);
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [user, setUser] = useState();
  console.log("rendering meeting");
  console.log("📩", process.env.REACT_APP_SERVER);
  useEffect(() => {
    const s = socketIO.connect(process.env.REACT_APP_SERVER);
    let localUser = localStorage.getItem("user");
    console.log("💖💖", localUser);

    console.log("💖", user);
    if (!localUser) {
      let name = prompt("Please enter your name");
      if (name.trim() !== "") {
        localStorage.setItem("user", name.trim());
        setUser(name.trim());
      } else {
        toast.error("Please enter a valid name");
      }
    } else {
      setUser(localUser);
      toast.success(`Welcome back ${localUser}`);
    }

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
      toast("Someone joined", {
        icon: "🎉",
      });

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
        const track = e.track;
        // toast.success("new track");
        if (track.kind === "video") {
          setOtherVideo(new MediaStream([track]));
          console.log("video added");
        } else if (track.kind === "audio") {
          setOtherAudio(new MediaStream([track]));
          console.log("audio added");
        }
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
      // createOffer();
    });
  }, []);
  const createOffer = () => {
    // sending pc
    toast.success("Meeting start");
    let pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });
    console.log("pc created", pc);

    console.log("🥺", myVideo.getAudioTracks());
    pc.addTrack(myVideo.getVideoTracks()[0]);
    pc.addTrack(myVideo.getAudioTracks()[0]);

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
    <>
      <VideoCompo user={user} stream={myVideo} self={true} name="your name" />

      {otherVideo ? (
        <VideoCompo
          stream={otherVideo}
          audioStream={otherAudio}
          self={false}
          name={"hello"}
        />
      ) : (
        <h1>Waiting for others</h1>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex justify-center ">
      <div className="absolute min-h-screen top-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 content-baseline">
        <div className="flex flex-col md:flex-row col-span-3 justify-center items-baseline">
          {mainVideo}
        </div>
        {user ? (
          <ChatBox
            roomId={roomId}
            socket={socket}
            user={user}
            setUser={setUser}
          />
        ) : (
          <p>new username</p>
        )}
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
}
