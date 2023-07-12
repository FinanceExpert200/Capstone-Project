// import logo from './assets/logo.svg';
// import logo from "../../assets/logo.svg";
// import "./App.css";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  BrowserRouter,
} from "react-router-dom";

import RegisterPage from "../RegisterPage/RegisterPage";

function App() {

  const [buying_power, setBuyingPower] = useState(10000);
  const [acc_value, setAccValue] = useState(10000);
  // set

  return (
    <div className="App">

      <RegisterPage buying_power={buying_power} acc_value={acc_value}/>


    </div>
  );
}

export default App;
