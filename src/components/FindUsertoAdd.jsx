import React, { useContext, useState } from 'react'
import { searchUsers, addUserToChat } from "../pages/api/api";
import { v4 as uuidv4 } from "uuid";
import { AuthContext } from "../context/AuthContext";

export default function FindUsertoAdd({chatRoom}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const uniqueId = uuidv4();
  const { userData, setUserData } = useContext(AuthContext);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    const foundUsers = await searchUsers(searchTerm);
    setUsers(foundUsers);
  };


  async function handleAddtoChat (user) {
    const roomId = chatRoom._id
    const userId = user._id
    const username = user.username
    const addUsers = await addUserToChat(roomId, userId, username)
      console.log("Server response:", addUsers);
  }



  return (
    <div className='flex flex-col gap-2'>
      <form className='flex gap-2' onSubmit={handleSearch}>
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
      <ul className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">Current Group Members:</span>
        {Object.entries(chatRoom.name).map(([key, value]) => (
          <span key={key}>
            {value.charAt(0).toUpperCase() + value.substring(1)}
          </span>
        ))}
        <span className="text-sm text-gray-500">Search:</span>
        {users?.map((user) => {
          if (user.username !== userData.user.username) {
            return (
              <li key={user._id}>
                {user.username.charAt(0).toUpperCase() +
                  user.username.substring(1)}{" "}
                <button
                  className="bg-purple-400 text-white p-2 rounded"
                   onClick={() => handleAddtoChat(user)}
                >
                  Add to chat
                </button>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
}
