import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./BorderRadiusManager.css";

const borderRadii = ["circle", "square", "squareFull"]; // Consistent key for square-full
const icons = {
  circle: ["fas", "circle"],
  square: ["fas", "square"], // Fixed typo
  squareFull: ["fas", "square-full"], // Consistent key
};

const BorderRadiusManager = () => {
  const [borderRadius, setBorderRadius] = useState(
    localStorage.getItem("border-radius") || ".3rem"
  );

  useEffect(() => {
    document.body.classList.remove("circle", "square", "squareFull");
    document.body.classList.add(borderRadius);
    localStorage.setItem("border-radius", borderRadius);
  }, [borderRadius]);

  const handleClick = () => {
    setBorderRadius(
      borderRadii[(borderRadii.indexOf(borderRadius) + 1) % borderRadii.length]
    );
  };

  return (
    <button onClick={handleClick} className="border-radius-button">
      <FontAwesomeIcon icon={icons[borderRadius]} />
    </button>
  );
};

export default BorderRadiusManager;
