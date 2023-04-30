import React, { useState, useEffect, useContext } from "react";
import axios from "../../axiosConfig";
import { AuthContext } from "../context/AuthContext";
import Link from "next/link";

const ChatRoomList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const { userData, setUserData } = useContext(AuthContext);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get(
          `/chatrooms/user/${userData.user.id}`,
          {
            withCredentials: true,
          }
        );
        setChatRooms(response.data);
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      }
    };

    if (userData?.user) {
      fetchChatRooms();
    }
  }, [userData]);

  return (
    <div>
      <h2 className="mb">Chat's:</h2>
      <ul className="grid gap-2">
        {chatRooms.map((chatRoom) => (
          <Link
            className="bg-slate-300 p-2 rounded hover:bg-slate-400 hover:text-white"
            href={`/chatroom/${chatRoom._id}`}
          >
            {chatRoom.name.map((name, index) => (
              <React.Fragment key={name}>
                {name !== userData.user.username && (
                  <>
                    {name.charAt(0).toUpperCase() + name.substring(1)}
                    {index !== chatRoom.name.length - 1 && ", "}
                  </>
                )}
              </React.Fragment>
            ))}
          </Link>
        ))}

        {/* {chatRooms.map((chatRoom) => (
          <Link className="bg-slate-300 p-2 rounded hover:bg-slate-400 hover:text-white" href={`/chatroom/${chatRoom._id}`}>
            {chatRoom.name.map((name, index) => (
              <span>
                {name !== userData.user.username &&
                  name.charAt(0).toUpperCase() + name.substring(1) + " "} 
              </span>
            ))}
          </Link>
        ))} */}
        {/* {Object.entries(chatRoom.name)
              .filter(([key, value]) => value !== userData.user.username)
              .map(([key, value]) => (
                <a href={`/chatroom/${chatRoom._id}`} key={key}>
                  {value}
                </a>
              ))} */}
      </ul>
    </div>
  );
};

export default ChatRoomList;

// working
/* import { useState, useEffect, useContext } from "react";
import axios from "../../axiosConfig"
import { AuthContext } from "../context/AuthContext";

const ChatRoomList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const { userData, setUserData } = useContext(AuthContext);

  useEffect(() => {
    const fetchChatRooms = async () => {
      const response = await axios.get("/chatrooms", {
        withCredentials: true,
      });
      setChatRooms(response.data);
    };

    fetchChatRooms();
  }, []);
console.log(chatRooms)
  return (
    <div>
      <h2>Chat Rooms:</h2>
      <ul>
        {chatRooms.map((chatRoom) => (
          <li key={chatRoom._id}>
            {Object.entries(chatRoom.name)
              .filter(([key, value]) => value !== userData.user.username)
              .map(([key, value]) => (
                <a href={`/chatroom/${chatRoom._id}`} key={key}>
                  {value}
                </a>
              ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomList;

 */
