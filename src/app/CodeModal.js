import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaClipboard } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Modal from "./Modal";

const CodeModal = ({ isOpen, onClose, title, files, initialFileIndex = 0 }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(initialFileIndex);
  const [copySuccess, setCopySuccess] = useState("");

  const currentFile = files[selectedFileIndex];

  const copyToClipboard = () => {
    if (currentFile?.code) {
      navigator.clipboard
        .writeText(currentFile.code)
        .then(() => {
          setCopySuccess("Copied!");
          setTimeout(() => setCopySuccess(""), 2000);
        })
        .catch(() => {
          setCopySuccess("Failed to copy");
        });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {files.length > 1 && (
        <div className="file-tabs">
          {files.map((file, index) => (
            <button
              key={index}
              className={`file-tab ${
                selectedFileIndex === index ? "active" : ""
              }`}
              onClick={() => setSelectedFileIndex(index)}
            >
              {file.name}
            </button>
          ))}
        </div>
      )}
      <div className="modal-body">
        <div className="copy-container">
          <button onClick={copyToClipboard} className="copy-button">
            <FaClipboard /> Copy
          </button>
          {copySuccess && <span className="copy-success">{copySuccess}</span>}
        </div>
        <div className="code-container">
          <SyntaxHighlighter
            language={currentFile?.name.endsWith(".css") ? "css" : "javascript"}
            style={dracula}
            showLineNumbers
          >
            {currentFile?.code || "Loading..."}
          </SyntaxHighlighter>
        </div>
      </div>
    </Modal>
  );
};

CodeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
    })
  ).isRequired,
  initialFileIndex: PropTypes.number,
};

export default CodeModal;
