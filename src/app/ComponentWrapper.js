import React, { useState, useEffect, Suspense, lazy } from "react";
import ComponentCard from "./ComponentCard";
import CodeModal from "./CodeModal";
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
  const [components, setComponents] = useState([]);
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [hoverSource, setHoverSource] = useState(null);
  const [modalData, setModalData] = useState({
    title: "",
    files: [],
    initialFileIndex: 0,
  });

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
      <div className="react-components">
        {components.map(({ key, component: Component }, index) => (
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
        ))}
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
