import React from "react";
import { getDetailTooltip } from "../utils/tooltips";

export interface NetworkDetailsProps {
  details: Record<string, string>;
  handleFieldCopy: (value: string, fieldName: string) => void;
  copiedField: string;
  isFromCache?: boolean; // Default to false
}

export default function NetworkDetails({
  details,
  handleFieldCopy,
  copiedField,
  isFromCache = false, // Default to false
}: NetworkDetailsProps) {
  return (
    <div className="my-4 sm:my-6 md:my-8 bg-gray-900 rounded-lg shadow-md p-3 sm:p-4 md:p-5 border border-gray-700">
      <div className="flex items-center mb-3 sm:mb-4">
        <div className="w-1 h-4 bg-cyan-500 mr-2"></div>
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-200">
          Network Details
          {isFromCache && (
            <span className="ml-2 text-xs text-blue-400 font-normal opacity-80">
              (cached)
            </span>
          )}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {Object.entries(details).map(([label, val]) => (
          <div
            className="p-3 relative group bg-gray-800 hover:bg-gray-750 rounded-lg transition-all duration-300 border border-gray-700 hover:border-cyan-800 shadow-inner"
            key={`detail-${label}`}
            title={getDetailTooltip(label)}
          >
            <div
              className="font-mono text-sm sm:text-base truncate group-hover:text-cyan-300 cursor-pointer flex items-center justify-between"
              onClick={() => handleFieldCopy(val, label)}
              title={`Click to copy: ${val}`}
            >
              <span className="max-w-full overflow-hidden text-ellipsis text-gray-200">
                {val}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2 text-gray-500 group-hover:text-cyan-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              <span
                className={`absolute -top-2 -right-2 text-xs ${
                  copiedField === label ? "opacity-100" : "opacity-0"
                } bg-green-600 text-white px-2 py-1 rounded-full transition-opacity duration-200 shadow-md`}
              >
                Copied!
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              <div className="w-full h-px bg-gray-700 mb-1.5"></div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-cyan-400">{label}</span>
                {label === "Wildcard Mask" && (
                  <span
                    className="text-xs text-gray-500 cursor-help"
                    title="Used in Cisco ACLs and routing configurations"
                  >
                    (ACLs)
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500 font-mono bg-gray-800 border border-gray-700 rounded p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 inline-block mr-1 text-cyan-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span>Click any value to copy to clipboard</span>
      </div>
    </div>
  );
}
