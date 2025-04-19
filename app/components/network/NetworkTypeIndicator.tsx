import React from "react";

interface NetworkTypeIndicatorProps {
  specialPurpose: {
    type: string;
    description: string;
    rfc: string;
  };
}

const NetworkTypeIndicator: React.FC<NetworkTypeIndicatorProps> = ({
  specialPurpose,
}) => {
  return (
    <div className="mb-3 md:mb-4 px-2 md:px-4 w-full flex justify-center sm:justify-start">
      <div
        className={`inline-block px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full break-words max-w-full text-center sm:text-left ${
          specialPurpose.type === "Private"
            ? "bg-green-900 text-green-200 border border-green-700"
            : specialPurpose.type === "Public"
            ? "bg-blue-900 text-blue-200 border border-blue-700"
            : specialPurpose.type === "Reserved"
            ? "bg-red-900 text-red-200 border border-red-700"
            : "bg-amber-900 text-amber-200 border border-amber-700"
        }`}
      >
        <span className="whitespace-nowrap">{specialPurpose.type} Network</span>{" "}
        •<span className="whitespace-normal">{specialPurpose.description}</span>
        {specialPurpose.rfc !== "N/A" && (
          <span className="ml-1 opacity-75 whitespace-nowrap">
            • RFC {specialPurpose.rfc}
          </span>
        )}
      </div>
    </div>
  );
};

export default NetworkTypeIndicator;
