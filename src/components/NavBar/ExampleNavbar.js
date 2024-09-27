import React from "react";
import NavBar from "./NavBar";
import { BrowserRouter } from "react-router-dom";
import "./NavBar.css";

const ExampleNavBar = () => {
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/services", label: "Services" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <div>
      <BrowserRouter>
        <NavBar links={navLinks} />
      </BrowserRouter>
    </div>
  );
};

export default ExampleNavBar;
