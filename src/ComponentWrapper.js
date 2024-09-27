import React, { useState, useEffect, Suspense, lazy } from "react";
import { FaCode } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Modal from "./Modal";
import "@catppuccin/highlightjs/css/catppuccin-mocha.css";

// Automatically require all .js/.jsx and .css files in the components folder
const requireComponents = require.context(
  "./components",
  true,
  /\.(js|jsx|css)$/
);

// Group files by folder and load components and their raw code
const loadComponentsAndCode = () => {
  const folderMap = {};

  requireComponents.keys().forEach((file) => {
    const folderName = file.split("/")[1]; // Extract folder name
    const fileName = file.split("/").pop(); // Extract file name

    if (!folderMap[folderName]) {
      folderMap[folderName] = {
        component: null,
        files: [],
      };
    }

    // Load component dynamically for 'Example[ComponentName].js' files
    if (
      (file.endsWith(".js") || file.endsWith(".jsx")) &&
      fileName.startsWith("Example")
    ) {
      folderMap[folderName].component = lazy(() =>
        import(`./components/${folderName}/${fileName}`)
      );
    }

    // Load raw code for both JS/JSX and CSS files
    const rawCode = require(`!raw-loader!./components/${file.replace(
      "./",
      ""
    )}`).default;

    folderMap[folderName].files.push({
      name: fileName,
      code: rawCode,
    });
  });

  return Object.entries(folderMap).map(([key, value]) => ({
    key,
    component: value.component,
    files: value.files,
  }));
};

const ComponentWrapper = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [components, setComponents] = useState([]);
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [hoverSource, setHoverSource] = useState(null);

  useEffect(() => {
    const componentList = loadComponentsAndCode();
    setComponents(componentList);
  }, []);

  const openModal = (componentKey) => {
    const currentComponent = components.find((c) => c.key === componentKey);
    const files = currentComponent?.files || [];
    setCurrentTitle(componentKey);
    setSelectedFileIndex(0);
    setCurrentCode(files[0]?.code || "Loading...");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentCode("");
    setCurrentTitle("");
    setSelectedFileIndex(0);
  };

  const handleHover = (enterSource, leaveSource) => ({
    onMouseEnter: () => setHoverSource(enterSource),
    onMouseLeave: () => setHoverSource(leaveSource),
  });

  const currentComponentData = components.find((c) => c.key === currentTitle);
  const currentFiles = currentComponentData?.files || [];
  const currentFile = currentFiles[selectedFileIndex];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="react-components">
        {components.map(({ key, component: Component }, index) => (
          <div
            key={index}
            className="react-component"
            onMouseEnter={() => {
              setHoveredComponent(key);
              if (hoverSource !== "example-component") {
                setHoverSource("component");
              }
            }}
            onMouseLeave={() => {
              setHoveredComponent(null);
              setHoverSource(null);
            }}
          >
            <div className="component-header">
              <h2
                className={
                  hoveredComponent === key
                    ? hoverSource === "example-component"
                      ? "underline-110"
                      : "underline-70"
                    : ""
                }
              >
                {key}
              </h2>
              <FaCode
                className="code-icon"
                onClick={() => openModal(key)}
                title={`View ${key} Code`}
              />
            </div>
            <div className="component-body">
              <div
                className="example-component-wrapper"
                {...handleHover("example-component", "component")}
              >
                {Component && <Component />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Render the Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          title={`${currentTitle} Code`}
        >
          {/* File Tabs */}
          {currentFiles.length > 1 && (
            <div className="file-tabs">
              {currentFiles.map((file, index) => (
                <button
                  key={index}
                  className={`file-tab ${
                    selectedFileIndex === index ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedFileIndex(index);
                    setCurrentCode(file.code);
                  }}
                >
                  {file.name}
                </button>
              ))}
            </div>
          )}
          <div className="code-container">
            <SyntaxHighlighter
              language={
                currentFile?.name.endsWith(".css") ? "css" : "javascript"
              }
              style={dracula}
              showLineNumbers
            >
              {currentCode || "Loading..."}
            </SyntaxHighlighter>
          </div>
        </Modal>
      )}
    </Suspense>
  );
};

export default ComponentWrapper;
