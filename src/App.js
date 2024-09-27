import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  faCloudMoon,
  faCloudMoonRain,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import "./css/App.css";
import ComponentWrapper from "./components/ComponentWrapper";

library.add(fab, faCloudMoon, faCloudMoonRain, faSun, faMoon);

function App() {
  return (
    <div>
      <h1>My React Components</h1>
      <ComponentWrapper />
    </div>
  );
}

export default App;
