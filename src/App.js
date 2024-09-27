import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  faCloudMoon,
  faCloudMoonRain,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import ThemeManager from "./components/ThemeManager/ThemeManager";
import "./components/css/App.css";

library.add(fab, faCloudMoon, faCloudMoonRain, faSun, faMoon);

function App() {
  return (
    <div>
      <h1>My React Components</h1>
      <ThemeManager />
    </div>
  );
}

export default App;
