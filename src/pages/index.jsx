import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export default function Home() {
  const router = useRouter();
  //const [userData, setUserData] = useState(null)
  const { userData, setUserData } = useContext(AuthContext);

function logout() {


  fetch("http://localhost:3000/logout", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (response.ok) {
        // Handle successful logout
        console.log("Logged out successfully");
        router.push("/login")
      } else {
        // Handle error
        console.error("Failed to logout");
      }
    })
    .catch((error) => {
      // Handle error
      console.error(error);
    });
}


  return (
    <main>
      <div className="w-screen h-screen inset-0 flex justify-center items-center">
        <div className="p-4 bg-sky-100 rounded w-4/6 h-2/3">
          <div className="flex gap-4 mb-4">
            <h1>
              Welcome:{" "}
              {userData?.user?.username ? (
                <>
                  {userData?.user?.username.charAt(0).toUpperCase() +
                    userData.user.username.substring(1)}{" "}
                  <button
                    className="bg-red-400 text-white p-2 rounded"
                    onClick={() => logout()}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {"Not logged in "}
                  <Link href={"/login"}>Login Here</Link>
                </>
              )}
            </h1>
          </div>
          <div className="flex flex-col gap-4">
            <Link href={"/chatRooms"}>Chatrooms</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
