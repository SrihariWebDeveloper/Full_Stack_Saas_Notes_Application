import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = "https://full-stack-saas-notes-application.onrender.com/api"; // Change if needed

const Login = ({ setToken}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      toast.success("Login successful!", "success");
    } catch (err) {
      toast.error("Login failed!", "error");
    }
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input
        className="border p-2 mb-2 w-full"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="border p-2 mb-4 w-full"
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};

export default Login;
