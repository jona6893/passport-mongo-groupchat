// api.js
import axios from "../../../axiosConfig";

export const searchUsers = async (searchTerm) => {
  try {
    const response = await axios.get(`/users?search=${searchTerm}`);
    console.log("Fetched users:", response.data); // Add this line
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const startDirectChat = async (userId1, userId2, name1, name2) => {
  try {
    const response = await axios.post("/chatrooms/direct", {
      userId1,
      userId2,
      name1,
      name2,
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error starting direct chat:", error);
    return error;
  }
};



export async function checkDirectChat(userId1, userId2) {
  const response = await axios.get(`/chatrooms/direct/${userId1}/${userId2}`);
  return response.data;
}


export const addUserToChat = async (roomId, userId, username) => {
  try {
    const response = await axios.post(`/chatroom/${roomId}/add-user`, {
      userId,
      username,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding user to chat:", error);
    return error;
  }
};
export const removeUserToChat = async (roomId, userId, username) => {
  try {
    const response = await axios.post(`/chatroom/${roomId}/removeUser`, {
      userId,
      username,
    });
    return response.data;
  } catch (error) {
    console.error("Error removing user from chat:", error);
    return error;
  }
};