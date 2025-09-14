import React, { useState } from "react";

const Login = () => {
  const [authState, setAuthState] = useState("SignUp");
  return (
    <div className="flex justify-center">
      <form className="border shadow mt-30 my-2">
        <h2 className="text-center my-4 text-xl font-bold">{authState}</h2>
        <div className="">
          <div className="mx-24 my-4">
            {authState === "SignUp" ? (
              <label htmlFor="username">
                <h2>UserName</h2>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Username"
                  className="border w-full border-b-neutral-400 pl-2 h-9 rounded outline-none"
                />
              </label>
            ) : (
              <></>
            )}
            <label htmlFor="Email">
              <h2>Email</h2>
              <input
                type="text"
                name="Email"
                required
                placeholder="email id"
                className="border w-full border-b-neutral-400 pl-2 h-9 rounded outline-none"
              />
            </label>
            
            {authState === "SignUp" ? (
              <label htmlFor="username">
                <h2>Become an Admin</h2>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Enter Admin Verification No"
                  className="border w-full border-b-neutral-400 pl-2 h-9 rounded outline-none"
                />
              </label>
            ) : (
              <></>
            )}

            <label htmlFor="Password">
              <h2>Password</h2>
              <input
                type="text"
                name="Password"
                required
                placeholder="password"
                className="border w-full border-b-neutral-400 pl-2 h-9 rounded outline-none"
              />
            </label>
            <div className="">
              <p className="text-blue-300 cursor-pointer">Forgot password</p>
            </div>
            <div className="bg-blue-300 text-shadow-gray-300 p-2 rounded text-center w-full">
              <button type="click" className="cursor-pointer">
                {authState === "SignUp" ? "Create Account" : "Login"}
              </button>
            </div>
            <div className="w-full">
              {authState === "SignUp" ? (
                <p>
                  Already have an Account?{" "}
                  <span
                    className="text-blue-400 cursor-pointer"
                    onClick={() => setAuthState("Login")}
                  >
                    Login
                  </span>
                </p>
              ) : (
                <p>
                  Don't have an Account?{" "}
                  <span
                    className="text-blue-400 cursor-pointer"
                    onClick={() => setAuthState("SignUp")}
                  >
                    SignUp
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
