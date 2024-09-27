import React, { useEffect } from "react";
import Dropdown from "../components/Dropdown/Dropdown";

const Sorting = ({
  sortOption,
  setSortOption,
  components,
  setSortedComponents,
}) => {
  const sortOptions = [
    { value: "alphabetical_asc", label: "Alphabetical (A-Z)" },
    { value: "alphabetical_desc", label: "Alphabetical (Z-A)" },
    { value: "file_size_asc", label: "File Size (Ascending)" },
    { value: "file_size_desc", label: "File Size (Descending)" },
    { value: "custom_order", label: "Custom Order" },
  ];

  const sortComponents = () => {
    const sortedList = [...components];

    switch (sortOption) {
      case "alphabetical_asc":
        sortedList.sort((a, b) => a.key.localeCompare(b.key));
        break;
      case "alphabetical_desc":
        sortedList.sort((a, b) => b.key.localeCompare(a.key));
        break;
      case "file_size_asc":
        sortedList.sort((a, b) => a.totalFileSize - b.totalFileSize);
        break;
      case "file_size_desc":
        sortedList.sort((a, b) => b.totalFileSize - a.totalFileSize);
        break;
      case "custom_order":
        const customOrder = ["BorderRadiusManager", "NavBar", "ThemeManager"];
        sortedList.sort((a, b) => {
          const indexA = customOrder.indexOf(a.key);
          const indexB = customOrder.indexOf(b.key);

          if (indexA === -1 && indexB === -1) {
            return a.key.localeCompare(b.key);
          } else if (indexA === -1) {
            return 1;
          } else if (indexB === -1) {
            return -1;
          } else {
            return indexA - indexB;
          }
        });
        break;
      default:
        break;
    }
    setSortedComponents(sortedList);
  };

  useEffect(() => {
    sortComponents();
  }, [sortOption, components]);

  return (
    <div className="sorting-container">
      <Dropdown
        label="Sort Components: "
        id="sorting"
        options={sortOptions}
        value={sortOption}
        onChange={setSortOption}
      />
    </div>
  );
};

export default Sorting;
