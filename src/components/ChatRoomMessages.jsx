import { useEffect, useState, useRef, useContext } from "react";
import axios from "../../axiosConfig";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import Link from "next/link";

const ChatRoomMessages = ({ chatRoom }) => {
  const [messages, setMessages] = useState([]);
  const { userData, setUserData } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [openImage, setOpenImage] = useState(null);
  const lastMessageRef = useRef(null);

  const socketRef = useRef();


const fetchMessages = async () => {
  try {
    const response = await axios.get(`/chatrooms/${chatRoom._id}/messages`);
    setMessages(response.data);
    console.log(response)
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};


const uploadImage = async () => {
  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await axios.post("/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Return the optimizedImage path to be used in sending the message
    return response.data.optimizedImage;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};



  useEffect(() => {
    // Fetch messages from the server
    fetchMessages();
    socketRef.current = io.connect("http://localhost:3000");

    socketRef.current.emit("joinRoom", {
      roomId: chatRoom._id,
      userName: userData.user.username,
      userId: userData.user.id, // Replace this with the actual user ID
    });

    socketRef.current.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [chatRoom]);

 const sendMessage = async (e) => {
   e.preventDefault();

   let imageUrl = null;

   // If an image is selected, upload it and get the image URL
   if (image) {
     imageUrl = await uploadImage();
   }

   socketRef.current.emit("chatMessage", {
     roomId: chatRoom._id,
     userId: userData.user.id,
     userName: userData.user.username,
     content,
     imageUrl,
   });

   setContent("");
   setImage(null);
 };

  const previewImage = async (index) => {
    if(openImage === index){
      setOpenImage(null)
    } else{
      setOpenImage(index)
    }
  }
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ /* behavior: "smooth" */ });
    }
  };



  return (
    <div className="p-4 h-full">
      <ul className="flex flex-col gap-2 p-4 h-[85%] overflow-auto">
        {messages.map((message, index) => (
          <li
            key={index}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className={`flex flex-col ${
              message.userName === userData.user.username
                ? "items-end"
                : "items-start"
            }`}
          >
            <span className="text-sm text-gray-400">{message.userName}:</span>{" "}
            <span
              className={`flex flex-col ${
                message.userName === userData.user.username
                  ? "bg-blue-500 text-white p-2 rounded-md"
                  : "bg-gray-200 p-2 rounded-md"
              }`}
            >
              {message.content}
              {message.imageUrl && (
                <button className={`${openImage === index && "fixed w-[90%] h-[auto] inset-0 m-auto flex items-center justify-center z-10"}`} onClick={()=>previewImage(index)}>
                <img
                  src={message.imageUrl}
                  alt="uploaded image"
                  className={`w-48 h-auto mt-2 rounded ${openImage === index && "w-[auto] h-[90%]"}`}
                /></button>
              )}
            </span>
          </li>
        ))}
      </ul>
      <form
        onSubmit={sendMessage}
        className="flex gap-2 mx-auto justify-center"
      >
        <input
          className="border border-gray-500 p-1 rounded"
          placeholder="Message"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button className="bg-blue-400 text-white p-2 rounded" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoomMessages;
