import React, { useState, useEffect, Suspense, lazy } from "react";
import ComponentCard from "./ComponentCard";
import ComponentList from "./ComponentList"; // Import the new ComponentList component
import CodeModal from "./CodeModal";
import Sorting from "./Sorting"; // Import the Sorting component
import "@catppuccin/highlightjs/css/catppuccin-mocha.css";

// Adjusted require.context to point to the correct directory
const requireComponents = require.context(
  "../components",
  true,
  /\.(js|jsx|css)$/
);

// Optionally, create a require context for raw code
const requireRawCode = require.context(
  "!raw-loader!../components",
  true,
  /\.(js|jsx|css)$/
);

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
        import(`../components/${folderName}/${fileName}`)
      );
    }

    // Load raw code
    const rawCode = requireRawCode(file).default;
    const fileSize = new Blob([rawCode]).size; // Calculate file size in bytes

    folderMap[folderName].files.push({
      name: fileName,
      code: rawCode,
      size: fileSize, // Add file size
    });
  });

  const componentsArray = Object.entries(folderMap).map(([key, value]) => ({
    key,
    component: value.component,
    files: value.files,
    totalFileSize: value.files.reduce((total, file) => total + file.size, 0), // Calculate total file size for each component
  }));

  return componentsArray;
};

const ComponentWrapper = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [components, setComponents] = useState([]);
  const [sortedComponents, setSortedComponents] = useState([]);
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [hoverSource, setHoverSource] = useState(null);
  const [modalData, setModalData] = useState({
    title: "",
    files: [],
    initialFileIndex: 0,
  });
  const [sortOption, setSortOption] = useState("alphabetical_asc");

  // Add state for toggling between list and box format
  const [displayMode, setDisplayMode] = useState("box");

  useEffect(() => {
    const componentList = loadComponentsAndCode();
    setComponents(componentList);
  }, []);

  const openModal = (componentKey) => {
    const currentComponent = components.find((c) => c.key === componentKey);
    const files = currentComponent?.files || [];
    setModalData({
      title: `${componentKey} Code`,
      files,
      initialFileIndex: 0,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData({
      title: "",
      files: [],
      initialFileIndex: 0,
    });
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Sorting Component */}
      <Sorting
        sortOption={sortOption}
        setSortOption={setSortOption}
        components={components}
        setSortedComponents={setSortedComponents}
      />

      {/* Toggle Button for List/Box view */}
      <div className="view-toggle">
        <button
          onClick={() => setDisplayMode("box")}
          className={displayMode === "box" ? "active" : ""}
        >
          Box View
        </button>
        <button
          onClick={() => setDisplayMode("list")}
          className={displayMode === "list" ? "active" : ""}
        >
          List View
        </button>
      </div>

      <div className="react-components">
        {sortedComponents.map(({ key, component: Component }, index) =>
          displayMode === "box" ? (
            <ComponentCard
              key={index}
              componentKey={key}
              Component={Component}
              onOpenModal={openModal}
              hoveredComponent={hoveredComponent}
              setHoveredComponent={setHoveredComponent}
              hoverSource={hoverSource}
              setHoverSource={setHoverSource}
            />
          ) : (
            <ComponentList
              key={index}
              componentKey={key}
              Component={Component}
              onOpenModal={openModal}
              hoveredComponent={hoveredComponent}
              setHoveredComponent={setHoveredComponent}
              hoverSource={hoverSource}
              setHoverSource={setHoverSource}
            />
          )
        )}
      </div>

      {/* Render the CodeModal */}
      {modalOpen && (
        <CodeModal
          isOpen={modalOpen}
          onClose={closeModal}
          title={modalData.title}
          files={modalData.files}
          initialFileIndex={modalData.initialFileIndex}
        />
      )}
    </Suspense>
  );
};

export default ComponentWrapper;
