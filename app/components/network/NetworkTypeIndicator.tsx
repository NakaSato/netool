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
    <div className="mb-4 px-4">
      <span
        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
          specialPurpose.type === "Private"
            ? "bg-green-900 text-green-200 border border-green-700"
            : specialPurpose.type === "Public"
            ? "bg-blue-900 text-blue-200 border border-blue-700"
            : specialPurpose.type === "Reserved"
            ? "bg-red-900 text-red-200 border border-red-700"
            : "bg-amber-900 text-amber-200 border border-amber-700"
        }`}
      >
        {specialPurpose.type} Network • {specialPurpose.description}
        {specialPurpose.rfc !== "N/A" && (
          <span className="ml-1 opacity-75">• RFC {specialPurpose.rfc}</span>
        )}
      </span>
    </div>
  );
};

export default NetworkTypeIndicator;
