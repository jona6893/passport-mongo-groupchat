import { AuthProvider } from '@/context/AuthContext'
import '@/styles/globals.css'
import { useContext, useEffect } from 'react';
//import { AuthContext } from "../context/AuthContext";

export default function App({ Component, pageProps }) {
/* const { userData, setUserData } = useContext(AuthContext);

async function getUser() {
  fetch("http://localhost:3000/auth-check", { credentials: "include" })
    .then((response) => response.json())
    .then((data) => {
      // Access the username from the response data
      setUserData(data);
      // Use the username in your frontend code as needed
      if (data.user) {
        console.log(data);
      } else {
        router.push("/login");
      }
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
    });
}
useEffect(() => {
  getUser();
}, []); */

  return (<AuthProvider><Component {...pageProps} /></AuthProvider>)
}
