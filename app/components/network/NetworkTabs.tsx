import React from "react";

interface NetworkTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NetworkTabs: React.FC<NetworkTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabStyles = {
    active: "px-4 py-2 text-xs font-medium bg-blue-700 text-white rounded-t-md",
    inactive:
      "px-4 py-2 text-xs font-medium bg-gray-700 text-gray-300 rounded-t-md hover:bg-gray-600",
  };

  return (
    <div className="px-4 border-b border-gray-700">
      <div className="flex space-x-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("overview")}
          className={
            activeTab === "overview" ? tabStyles.active : tabStyles.inactive
          }
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("subnet")}
          className={
            activeTab === "subnet" ? tabStyles.active : tabStyles.inactive
          }
        >
          Subnet Analysis
        </button>
        <button
          onClick={() => setActiveTab("router")}
          className={
            activeTab === "router" ? tabStyles.active : tabStyles.inactive
          }
        >
          Router Config
        </button>
        <button
          onClick={() => setActiveTab("binary")}
          className={
            activeTab === "binary" ? tabStyles.active : tabStyles.inactive
          }
        >
          Binary View
        </button>
      </div>
    </div>
  );
};

export default NetworkTabs;
