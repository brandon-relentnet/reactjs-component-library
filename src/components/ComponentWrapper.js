import React, { useState, Suspense, lazy } from "react";
import { FaCode } from "react-icons/fa";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Modal from "./Modal";

// Lazy-loaded components
const ExampleNavBar = lazy(() => import("./NavBar/ExampleNavbar"));
const ThemeManager = lazy(() => import("./ThemeManager/ThemeManager"));

const components = [
  {
    key: "NavBar",
    component: <ExampleNavBar />,
  },
  {
    key: "ThemeManager",
    component: <ThemeManager />,
  },
];

const ComponentWrapper = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [currentTitle, setCurrentTitle] = useState("");
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  const fetchFilesFromGitHub = async (componentKey) => {
    const path = `src/components/${componentKey}`;
    const apiUrl = `https://api.github.com/repos/brandon-relentnet/reactjs-component-library/contents/${path}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch files for ${componentKey}: ${response.statusText}`
        );
      }
      const files = await response.json();

      // Filter out directories and map files
      const fileDetails = files
        .filter((file) => file.type === "file")
        .map((file) => ({
          name: file.name,
          path: file.path,
          language: getLanguageFromFileName(file.name),
          download_url: file.download_url,
        }));
      return fileDetails;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchCodeFromUrl = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      const text = await response.text();
      return text;
    } catch (error) {
      console.error(error);
      return `Error loading file: ${error.message}`;
    }
  };

  const getLanguageFromFileName = (fileName) => {
    const extension = fileName.split(".").pop();
    switch (extension) {
      case "js":
      case "jsx":
        return "javascript";
      case "css":
        return "css";
      case "html":
        return "html";
      case "json":
        return "json";
      // Add other cases as needed
      default:
        return "plaintext";
    }
  };

  const openModal = async (componentKey) => {
    setCurrentTitle(componentKey);
    setModalOpen(true);

    // Fetch list of files
    const files = await fetchFilesFromGitHub(componentKey);

    // Fetch content of each file
    const fetchedFiles = await Promise.all(
      files.map(async (file) => {
        const code = await fetchCodeFromUrl(file.download_url);
        return { ...file, code };
      })
    );

    setCurrentFiles(fetchedFiles);
    setSelectedFileIndex(0);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentFiles([]);
    setCurrentTitle("");
    setSelectedFileIndex(0);
  };

  const handleFileSelection = (index) => {
    setSelectedFileIndex(index);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="react-components">
        {components.map(({ key, component }, index) => (
          <div key={index} className="react-component">
            <div className="component-header">
              <h3>{key}:</h3>
              <FaCode
                className="code-icon"
                onClick={() => openModal(key)}
                title={`View ${key} Code`}
              />
            </div>
            {component}
          </div>
        ))}
      </div>
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          title={`${currentTitle} Code`}
        >
          {currentFiles.length > 1 && (
            <div className="file-tabs">
              {currentFiles.map((file, index) => (
                <button
                  key={index}
                  className={`file-tab ${
                    selectedFileIndex === index ? "active" : ""
                  }`}
                  onClick={() => handleFileSelection(index)}
                >
                  {file.name}
                </button>
              ))}
            </div>
          )}
          <div className="code-container">
            <SyntaxHighlighter
              language={
                currentFiles[selectedFileIndex]?.language || "javascript"
              }
              style={docco}
              showLineNumbers
            >
              {currentFiles[selectedFileIndex]?.code || "Loading..."}
            </SyntaxHighlighter>
          </div>
        </Modal>
      )}
    </Suspense>
  );
};

export default ComponentWrapper;
