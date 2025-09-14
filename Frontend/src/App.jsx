import React, { useState, useEffect } from "react";
import Login from "./Pages/Login.jsx";
import Notes from "./Pages/Notes.jsx";
import {ToastContainer,toast} from "react-toastify"

const App = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    toast.success("Logged out!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md">
        {!token ? (
          <Login setToken={setToken}/>
        ) : (
          <>
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded mb-4 w-full"
              onClick={handleLogout}
            >
              Logout
            </button>
            <Notes token={token}/>
          </>
        )}
      </div>
    </div>
  );
};

export default App;