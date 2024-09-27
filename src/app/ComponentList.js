import React from "react";
import { FaCode } from "react-icons/fa";

const ComponentList = ({
  componentKey,
  Component,
  onOpenModal,
  hoveredComponent,
  setHoveredComponent,
  hoverSource,
  setHoverSource,
}) => {
  const isHovered = hoveredComponent === componentKey;
  const handleHover = (enterSource, leaveSource) => ({
    onMouseEnter: () => setHoverSource(enterSource),
    onMouseLeave: () => setHoverSource(leaveSource),
  });

  return (
    <div
      className="react-component-list-item"
      onMouseEnter={() => {
        setHoveredComponent(componentKey);
        if (hoverSource !== "example-component") {
          setHoverSource("component");
        }
      }}
      onMouseLeave={() => {
        setHoveredComponent(null);
        setHoverSource(null);
      }}
    >
      <div className="list-item-header">
        <h3
          className={
            isHovered
              ? hoverSource === "example-component"
                ? "underline-110"
                : "underline-70"
              : ""
          }
        >
          {componentKey}
        </h3>
        <FaCode
          className="code-icon"
          onClick={() => onOpenModal(componentKey)}
          title={`View ${componentKey} Code`}
        />
      </div>
      <div className="list-item-body">
        <div
          className="example-component-list"
          {...handleHover("example-component", "component")}
        >
          {Component && <Component />}
        </div>
      </div>
    </div>
  );
};

export default ComponentList;
