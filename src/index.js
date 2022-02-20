import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./assets/fonts/constan.ttf";

import { Provider } from "react-redux";
import store from "./store";
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}></Provider>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
