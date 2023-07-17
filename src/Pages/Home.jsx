import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [meetingId, SetmeetingId] = useState("");
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate(`/meeting/${meetingId}`);
  };
  console.log("home");
  return (
    <div className="flex min-h-screen justify-center items-center ">
      <div className="shadow-xl flex flex-col bg-slate-500 bg-opacity-20 w-[350px] border-2 rounded-xl p-3 py-4 gap-2 m-2">
        <h1 className="text-4xl ">Welcome to DarkMeet</h1>
        <form
          onSubmit={handleSubmit}
          className="mt-3 flex flex-col font-mono gap-2 "
        >
          <label htmlFor="id" className="">
            Meeting room:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="id"
              value={meetingId}
              onChange={(e) => SetmeetingId(e.target.value)}
              className="grow px-4 py-2 rounded-full outline-none text-black "
              placeholder="Enter meet id"
            />
            <button
              disabled={!meetingId}
              type="submit"
              className="bg-slate-500 p-2 rounded-full"
            >
              join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;
