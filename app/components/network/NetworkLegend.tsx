import React from "react";

interface NetworkLegendProps {
  networkColors: {
    classes: {
      a: { bg: string };
      b: { bg: string };
      c: { bg: string };
      small: { bg: string };
    };
  };
}

const NetworkLegend: React.FC<NetworkLegendProps> = ({ networkColors }) => {
  return (
    <div className="px-4 pb-4 mt-3 sm:mt-4 flex flex-wrap gap-3 text-xs border-t border-gray-700 pt-3">
      <span className="inline-flex items-center">
        <span
          className={`w-3 h-3 inline-block ${networkColors.classes.a.bg} mr-1`}
        ></span>
        Class A (/8 or less)
      </span>
      <span className="inline-flex items-center">
        <span
          className={`w-3 h-3 inline-block ${networkColors.classes.b.bg} mr-1`}
        ></span>
        Class B (/9-/16)
      </span>
      <span className="inline-flex items-center">
        <span
          className={`w-3 h-3 inline-block ${networkColors.classes.c.bg} mr-1`}
        ></span>
        Class C (/17-/24)
      </span>
      <span className="inline-flex items-center">
        <span
          className={`w-3 h-3 inline-block ${networkColors.classes.small.bg} mr-1`}
        ></span>
        Small Subnets (/25-/32)
      </span>

      <span className="inline-flex items-center ml-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 mr-1 text-blue-400"
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
        <span className="text-gray-400">
          Click network section to copy IP range
        </span>
      </span>
    </div>
  );
};

export default NetworkLegend;
