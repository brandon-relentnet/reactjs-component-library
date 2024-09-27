import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import "./BorderRadiusManager.css";

const borderRadii = ["circle", "square", "square-full"];
const icons = {
  circle: ["fas", "circle"],
  square: ["fas", "square"],
  "square-full": ["fas", "square-full"],
};

const BorderRadiusManager = () => {
  const [borderRadius, setBorderRadius] = useState(
    localStorage.getItem("border-radius") || "circle"
  );

  useEffect(() => {
    document.body.classList.remove(...borderRadii);
    document.body.classList.add(borderRadius);
    localStorage.setItem("border-radius", borderRadius);
  }, [borderRadius]);

  const handleClick = () => {
    setBorderRadius(
      borderRadii[(borderRadii.indexOf(borderRadius) + 1) % borderRadii.length]
    );
  };

  return (
    <Button
      icons={icons}
      handleClick={handleClick}
      type={borderRadius}
      arrayName="borderRadii"
    />
  );
};

export default BorderRadiusManager;
