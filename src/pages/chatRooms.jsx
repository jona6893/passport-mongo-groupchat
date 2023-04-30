import { useState } from "react";
import axios from "axios";
import ChatRoomList from "../components/ChatRoomList";
import Link from "next/link";
import UserSearch from "@/components/UserSearch";

const ChatRooms = () => {
  const [name, setName] = useState("");

 const createChatRoom = async (e) => {
   console.log("createChatRoom");
   e.preventDefault();
   await axios.post(
     "http://localhost:3000/chatroom",
     { name }, // Pass the data object first
     { withCredentials: true } // Then the config object
   );
   setName("");
 };


  return (
    <div className="p-4 w-screen h-screen inset-0 flex justify-center items-center">
      <div className="p-4 bg-gray-100 w-4/6 h-2/3 rounded flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <Link className="bg-slate-400 text-white p-2 rounded" href={"/"}>
            Home
          </Link>
        </div>
        {/*       <form onSubmit={createChatRoom}>
        <input
        type="text"
        placeholder="Chat room name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Create chat room</button>
      </form> */}
        <div className="flex justify-around">
          <ChatRoomList />
          <UserSearch></UserSearch>
        </div>
      </div>
    </div>
  );
};

export default ChatRooms;
