import React from "react";
import "./Home.css";
import { useEffect, useRef } from "react";
import axios from "axios";

const Home = () => {
  return (
    <div className="landingPage">
      <h1 className="landingTitle">Expert Finance</h1>
      <h2 className="landingSubtitle">
        Helping you take control of your finances
      </h2>
      {/* <img src={tracker} alt="Landing Page" className="landingPhoto" /> */}
      <p className="landingBlurb">
        This is a personal finance app that allows you to simulate buying and
        selling stocks.
      </p>

      <a href="/register" className="landingButton">
        Create your account now
      </a>
    </div>
  );
};

export default Home;
