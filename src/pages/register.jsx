import Link from "next/link";
import { useRouter } from "next/router";

export default function Register() {

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      // Handle successful registration, e.g., redirect to the login page
      console.log("Registered successfully!");
      router.push("/login")
    } else {
      // Handle unsuccessful registration, e.g., show an error message
      console.log("Failed to register");
    }
  };

  return (
    <div className="w-screen h-screen inset-0 flex justify-center items-center">
      <div className="p-4 bg-sky-100">
        <h1>Register</h1>
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-sky-100 grid gap-4 max-w-max"
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
            <label className="text-xs text-gray-500">Email</label>
            <input
              className="border border-gray-300 bg-gray-50 px-2 rounded"
              id="email"
              name="email"
              type="email"
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
            Register
          </button>
        </form>
        <Link className="text-sm text-gray-400" href={"/login"}>
          Already have an Account? Login here
        </Link>
      </div>
    </div>
  );
}
