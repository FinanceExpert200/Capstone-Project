import React from 'react'
import axios from 'axios'
import { useState } from "react";



const handleAddData = async (
    event,
    email,
    username,
    first_name,
    last_name,
    password
  ) => {
    try {
      // const navigate = useNavigate();
      event.preventDefault();
      const res = await axios.post(
        `http://localhost:3001/auth/register`,
        {
          email: email,
          firstName: first_name,
          lastName: last_name,
          username: username,
          password: password,
        }
      );
      console.log(res.data);
      // navigate('/activity');
      window.location.href = "/activity";
    } catch (err) {
      console.log(err);
    }
  };

const RegisterPage = () => {

    const [email, setEmail] = useState("");
    const [username, setUserName] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [password, setPassword] = useState("");

  return (
    <div className="login-container">
      <h2 className="login-heading">Create an Account</h2>

      <div className="login-section">
        <form
          className="login-form"
          onSubmit={(event) =>
            handleAddData(
              event,
              email,
              username,
              first_name,
              last_name,
              password
            )
          }
        >
          <div className="login-contents">
            <input
              type="text"
              className="login-input"
              placeholder="Email"
              required
              onChange={(event) => {
                event.preventDefault();
                setEmail(event.target.value);
              }}
            />
            <input
              type="text"
              className="login-input"
              placeholder="Username"
              required
              onChange={(event) => {
                event.preventDefault();
                setUserName(event.target.value);
              }}
            />
            <input
              type="text"
              className="login-input"
              placeholder="First Name"
              required
              onChange={(event) => {
                event.preventDefault();
                setFirstName(event.target.value);
              }}
            />
            <input
              type="text"
              className="login-input"
              placeholder="Last Name"
              required
              onChange={(event) => {
                event.preventDefault();
                setLastName(event.target.value);
              }}
            />
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              required
              onChange={(event) => {
                event.preventDefault();
                setPassword(event.target.value);
              }}
            />
            <input
              type="password"
              className="login-input"
              placeholder="Confirm Password"
              name="confirmpassword"
              required
            />

            <button type="submit" className="login-button">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage