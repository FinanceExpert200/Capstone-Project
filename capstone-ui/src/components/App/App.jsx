// import logo from './assets/logo.svg';
// import logo from "../../assets/logo.svg";
// import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  BrowserRouter,
} from "react-router-dom";
import { useState } from "react";

import RegisterPage from "../RegisterPage/RegisterPage";

function App() {

  const [buying_power, setBuyingPower] = useState(10000);
  const [acc_value, setAccValue] = useState(10000);

  return (
    <div className="App">

      <RegisterPage buying_power={buying_power} acc_value={acc_value}/>


    </div>
  );
}

export default App;
