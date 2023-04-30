import React, { useContext, useState } from "react";
import {
  searchUsers,
  startDirectChat,
  checkDirectChat,
} from "../pages/api/api";
import { AuthContext } from "../context/AuthContext"
import { useRouter } from "next/router";


const UserSearch = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const { userData, setUserData } = useContext(AuthContext);
  const router = useRouter(); // Add this line


  const handleSearch = async (e) => {
    e.preventDefault();
    if(searchTerm !== ""){
      const foundUsers = await searchUsers(searchTerm);
      setUsers(foundUsers);
    }
  };

const handleStartChat = async (user) => {
    try {
        const currentUser = userData.user;
        let chatRoom;
        console.log(user.username);
        
    // Check if a chat room already exists between the two users
    const existingChatRoom = await checkDirectChat(currentUser.id, user._id);

    if (existingChatRoom) {
      // If a chat room exists, use it
      chatRoom = existingChatRoom;
    } else {
      // If not, create a new chat room
      const chatRoomResponse = await startDirectChat(
        currentUser.id,
        user._id,
        currentUser.username,
        user.username
      );
      chatRoom = chatRoomResponse;
    }

    console.log("Chatroom response:", chatRoom);

    if (chatRoom._id) {
      router.push(`/chatroom/${chatRoom._id}`);
    } else {
      console.error("Error starting chat:", chatRoom);
    }
  } catch (error) {
    console.error("Error starting chat:", error);
  }
};


  return (
    <div className="flex flex-col gap-2">
      <form className="flex gap-2" onSubmit={handleSearch}>
        <input
          type="text"
          className="border border-gray-500 p-1 rounded"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          placeholder="Search for users"
        />
        <button className="bg-slate-500 text-white p-2 rounded" type="submit">
          Search
        </button>
      </form>
      <ul>
        {users?.map((user) => (
          <li key={user._id}>
            {user.username.charAt(0).toUpperCase() + user.username.substring(1)}{" "}
            <button
              className="bg-purple-400 text-white p-2 rounded"
              onClick={() => handleStartChat(user)}
            >
              Start Chat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
