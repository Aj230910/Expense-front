import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";   // 👈👈 ADD THIS LINE (VERY IMPORTANT)
import App from "./App";
import ThemeContextProvider from "./theme/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThemeContextProvider>
    <App />
  </ThemeContextProvider>
);
