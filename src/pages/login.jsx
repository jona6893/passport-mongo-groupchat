import Link from "next/link";
import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";


export default function Login() {
const router = useRouter()
const { userData, setUserData } = useContext(AuthContext);

useEffect(() =>{
  if(userData){

    console.log(userData)
  }

}, [userData])
/* async function getUser() {
  try {
    const response = await fetch("http://localhost:3000/auth-check", {
      credentials: "include",
    });
    const data = await response.json();

    if (data.user) {
      // User is signed in, redirect to "./"
      router.push("./")
    } else {
      // User is not signed in, handle accordingly
      console.log("User not signed in");
    }
  } catch (error) {
    // Handle errors
    console.error(error);
  }
}
 
 useEffect(() => {
   getUser();
 }, []);*/

  return (
    <div className="w-screen h-screen inset-0 flex justify-center items-center">
      <div className="p-4 bg-sky-100">
        <h1>Sign in</h1>
        <form
          action="http://localhost:3000/login"
          method="post"
          className="p-4 mx-auto grid gap-4 max-w-max"
        >
          <section className="grid max-w-max">
            <label className="text-xs text-gray-500">Username</label>
            <input
              className="border border-gray-300 bg-gray-50 px-2 rounded"
              id="username"
              name="username"
              type="text"
              required
            />
          </section>
          <section className="grid max-w-max">
            <label className="text-xs text-gray-500">Password</label>
            <input
              className="border border-gray-300 bg-gray-50 px-2 rounded"
              id="current-password"
              name="password"
              type="password"
              required
            />
          </section>
          <button
            className="bg-blue-500 text-white rounded px-6 py-2"
            type="submit"
          >
            Sign in
          </button>
        </form>
        <Link className="text-sm text-gray-400" href={"/register"}>Don't have an Account? Register here</Link>
      </div>
    </div>
  );
}
