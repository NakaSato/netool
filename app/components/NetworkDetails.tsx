import React from "react";
import { getDetailTooltip } from "../utils/tooltips";

interface NetworkDetailsProps {
  details: Record<string, string>;
  handleFieldCopy: (value: string, fieldName: string) => void;
  copiedField: string;
}

export default function NetworkDetails({
  details,
  handleFieldCopy,
  copiedField,
}: NetworkDetailsProps) {
  return (
    <div className="mt-8 mb-4 bg-gray-900 border border-gray-700 rounded-lg shadow-md p-5">
      <div className="flex items-center mb-4">
        <div className="w-2 h-5 bg-blue-400 mr-3"></div>
        <h4 className="font-semibold text-lg text-gray-200 font-mono">
          NETWORK PARAMETERS
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
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
                    title="The wildcard mask is the inverse of the subnet mask (255.255.255.255 - subnet mask). Used in Cisco ACLs and route configurations."
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 inline-block text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
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
