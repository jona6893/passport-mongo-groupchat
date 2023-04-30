import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ChatRoomMessages from "../../components/ChatRoomMessages";
import { AuthContext } from "../../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import FindUsertoAdd from "@/components/FindUsertoAdd";
import { removeUserToChat } from "../api/api";
import Link from "next/link";

const ChatRoom = () => {
  const router = useRouter();
  const { id } = router.query;
  const [chatRoom, setChatRoom] = useState(null);
  const { userData } = useContext(AuthContext);
  const uniqueId = uuidv4();
  const [tglSearch, setTglSearch] = useState(false)

  useEffect(() => {
    const fetchChatRoom = async () => {
      const response = await axios.get(`http://localhost:3000/chatroom/${id}`, {
        withCredentials: true,
      });
      console.log(response);
      setChatRoom(response.data);
    };

    if (id) {
      fetchChatRoom();
    }
  }, [id]);

  if (!chatRoom) {
    return <div>Loading...</div>;
  }

   async function handleRemoveFromChat(user) {
     const roomId = chatRoom._id;
     const userId = userData.user.id;
     const username = userData.user.username;
     const RemoveUser = await removeUserToChat(roomId, userId, username);
     console.log("Server response:", RemoveUser);
     if(RemoveUser.message === "User removed from chat room"){
      router.push("/chatRooms")
     }
   }



  return (
    <div className="p-4 w-screen h-screen inset-0 flex justify-center items-center">
      <div className="p-4 bg-gray-100 w-4/6 rounded h-2/3 relative">
        <div className="flex justify-between items-center">
          <Link
            className="bg-slate-500 text-white p-2 rounded"
            href={"/chatRooms"}
          >
            Go Back
          </Link>
          <h2>
            <span className="text-sm text-gray-500">chatting with: </span>
            {Object.entries(chatRoom.name)
              .filter(([key, value]) => value !== userData.user.username)
              .map(([key, value]) => (
                <span key={key}>
                  {value.charAt(0).toUpperCase() + value.substring(1) + " "}
                </span>
              ))}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTglSearch(!tglSearch)}
              className="bg-purple-400 text-white p-2 rounded"
            >
              Add Users
            </button>
            <button
              className="bg-red-400 text-white p-2 rounded"
              onClick={handleRemoveFromChat}
            >
              Leave Chat
            </button>
          </div>
        </div>
        <ChatRoomMessages chatRoom={chatRoom} />
        {tglSearch && (
          <div className="absolute top-[15%] left-[100%] translate-x-[-100%] bg-white p-4">
            <FindUsertoAdd chatRoom={chatRoom}></FindUsertoAdd>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
