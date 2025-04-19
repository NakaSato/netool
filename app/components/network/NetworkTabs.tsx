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
    active:
      "px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] xs:text-[10px] sm:text-xs font-medium bg-blue-700 text-white rounded-t-md border-t border-l border-r border-blue-600 shadow-sm transition-all duration-150 transform hover:brightness-110 flex-shrink-0 min-w-[60px] sm:min-w-[80px] text-center",
    inactive:
      "px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] xs:text-[10px] sm:text-xs font-medium bg-gray-700 text-gray-300 rounded-t-md hover:bg-gray-600 border-t border-l border-r border-gray-600 transition-all duration-150 transform hover:translate-y-[-1px] flex-shrink-0 min-w-[60px] sm:min-w-[80px] text-center",
  };

  return (
    <div className="px-1 sm:px-2 md:px-4 border-b border-gray-700 bg-gray-800">
      <div className="flex space-x-0.5 sm:space-x-1 md:space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pb-1 -mx-1 px-1">
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
          Subnet
        </button>
        <button
          onClick={() => setActiveTab("router")}
          className={
            activeTab === "router" ? tabStyles.active : tabStyles.inactive
          }
        >
          Router
        </button>
        <button
          onClick={() => setActiveTab("binary")}
          className={
            activeTab === "binary" ? tabStyles.active : tabStyles.inactive
          }
        >
          Binary
        </button>
      </div>
    </div>
  );
};

export default NetworkTabs;
