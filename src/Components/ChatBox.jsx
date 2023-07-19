import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import socketIO from "socket.io-client";

function ChatBox({ roomId, socket }) {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState();
  const [text, setText] = useState("");
  const s = socket;
  useEffect(() => {
    if (s) {
      toast.success("got socket ");
      s.on("message", () => {
        toast.success("Message");
      });
    }
  }, []);

  const sendText = (e) => {
    e.preventDefault();
    if (!user) {
      const name = prompt("Please enter your name:");
      if (name) {
        if (name.trim() === "") {
          return toast.error("empty name");
        }
      } else {
        toast.error("Set a username");
        return;
      }
      setUser(name);
      return null;
    }
    if (text.trim() !== "" && user) {
      s.emit("message", { roomId, user, text });

      setText("");
    } else {
      toast.error("empty message or user");
    }
    console.log(messages);
  };

  return (
    <div className=" container flex flex-col min-h-[200px] items-center m-1 bg-slate-600 rounded-md shadow-md border text-white border-slate-600-800 p-1">
      <h1 className="m-1 border-b w-fit p-2 font-mono ">Room Id: {roomId}</h1>
      <ul className="flex flex-col flex-grow w-full break-all gap-1">
        {messages.map((message, i) => (
          <li className="bg-slate-900 w-full bg-opacity-20 p-1 " key={i}>
            <span className="font-bold">{message.user}</span> : {message.text}
          </li>
        ))}
      </ul>
      <form
        onSubmit={sendText}
        className="bottom-0 text-white mx-6 w-full flex p-1 gap-1 rounded-md "
      >
        <input
          type="text"
          name="id"
          rows="1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="grow border-b-2 outline-none bg-transparent resize-none overflow-hidden "
          placeholder="text here..."
        />
        <button
          disabled={!text}
          type="submit"
          className="bg-slate-400 text-slate-50 font-bold p-2 rounded-md"
        >
          send
        </button>
      </form>
    </div>
  );
}

export default ChatBox;
