import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ThemeManager.css";
const themes = ["mocha", "macchiato", "frappe", "latte"];
const icons = {
  mocha: ["fas", "cloud-moon"],
  macchiato: ["fas", "moon"],
  frappe: ["fas", "sun"],
  latte: ["fas", "cloud-moon-rain"],
};

const ThemeManager = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "mocha");

  useEffect(() => {
    document.body.classList.remove("mocha", "macchiato", "frappe", "latte");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleClick = () => {
    setTheme(themes[(themes.indexOf(theme) + 1) % themes.length]);
  };

  return (
    <button onClick={handleClick} className="theme-button">
      <FontAwesomeIcon icon={icons[theme]} />
    </button>
  );
};

export default ThemeManager;
