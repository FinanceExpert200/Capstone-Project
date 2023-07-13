import React, { useEffect } from "react";
import "./SignInPage.css";
import { useState } from "react";
import axios from "axios";
// import { useEffect } from "react";


// this post request over here verifies if the user email and password combo is valid
const handleLogin = async (event, email, password, setIsLogged) => {
  try {
    event.preventDefault();

    const res = await axios.post(
      `http://localhost:3001/auth/login`,
      {
        email: email,
        password: password,
      }
    );

   
    // console.log(res.data.user.id);

    setIsLogged(true);
    localStorage.setItem("currentUserId", res.data.user.id);


      // this will take you to the 
    window.location.href = "/home";
  } catch (err) {
    console.log(err.message);
  }
};



export default function SignInPage({ setIsLogged }) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  return (
    <div className="signIn-container">
      <h2 className="signIn-heading">Sign In</h2>

      <div className="signIn-section">
        <form
          className="signIn-form"
          onSubmit={(event) =>
            handleLogin(event, email, password, setIsLogged)
          }
        >
          <input
            type="text"
            className="signIn-input"
            placeholder="Email"
            required
            onChange={(event) => {
              event.preventDefault();
              setEmail(event.target.value);
            }}
          />
          <input
            type="password"
            className="signIn-input"
            placeholder="Password"
            required
            onChange={(event) => {
              event.preventDefault();
              setPassword(event.target.value);
            }}
          />

          <button type="submit" className="signIn-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
