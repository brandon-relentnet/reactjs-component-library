// Navbar.js
import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const NavBar = React.memo(({ links }) => {
  return (
    <nav className="navbar">
      {links.map(({ to, label }, index) => (
        <h3 key={index} className="navbar-item">
          <NavLink
            to={to}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-nav-link" : ""}`.trim()
            }
          >
            {label}
          </NavLink>
        </h3>
      ))}
    </nav>
  );
});

NavBar.defaultProps = {
  links: [],
};

NavBar.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
    })
  ).isRequired,
};

export default NavBar;
