import React, { useState } from "react";
import { Netmask } from "netmask";

interface SubnetMaskBinaryProps {
  netmask: Netmask;
  cidr: number;
  wildcardMask: string;
}

export default function SubnetMaskBinary({
  netmask,
  cidr,
  wildcardMask,
}: SubnetMaskBinaryProps) {
  const [hoverBit, setHoverBit] = useState<number | null>(null);

  // Convert decimal subnet mask to binary representation
  const maskBinary = netmask.mask
    .split(".")
    .map((octet) => parseInt(octet).toString(2).padStart(8, "0"));

  // Convert wildcard mask to binary as well
  const wildcardBinary = wildcardMask
    .split(".")
    .map((octet) => parseInt(octet).toString(2).padStart(8, "0"));

  // Generate bit position numbers (from 31 to 0)
  const bitPositions = Array.from({ length: 32 }, (_, i) => 31 - i);

  // Get technical description for a specific bit position
  const getBitDescription = (position: number) => {
    if (position >= cidr) {
      return `Host bit (${position}) - Used for host addressing`;
    } else {
      return `Network bit (${position}) - Used for network addressing`;
    }
  };

  return (
    <div className="mt-6 mb-8 bg-gray-900 border border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
      <div className="border-b border-gray-700 px-6 py-4 flex items-center">
        <div className="w-2 h-5 bg-cyan-400 mr-3"></div>
        <h4 className="font-semibold text-lg text-gray-200 font-mono">
          BINARY MASK VISUALIZATION
        </h4>
      </div>

      <div className="p-6">
        {/* Bit position indicators */}
        <div className="grid grid-cols-32 mb-1 gap-1">
          {bitPositions.map((pos) => (
            <div
              key={`bit-${pos}`}
              className="h-6 flex items-center justify-center text-xs font-mono text-gray-400"
            >
              {pos}
            </div>
          ))}
        </div>

        {/* Binary subnet mask */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <div className="w-2 h-4 bg-green-500 mr-2"></div>
            <span className="text-sm font-mono text-gray-300">Subnet Mask</span>
            <span className="text-xs font-mono text-gray-500 ml-2">
              ({netmask.mask})
            </span>
          </div>
          <div className="grid grid-cols-32 gap-1">
            {maskBinary
              .join("")
              .split("")
              .map((bit, i) => {
                const isNetworkBit = i < cidr;
                return (
                  <div
                    key={`mask-${i}`}
                    className={`
                    h-8 flex items-center justify-center text-sm font-bold font-mono rounded
                    ${i === hoverBit ? "ring-2 ring-yellow-400" : ""}
                    ${
                      bit === "1"
                        ? "bg-gradient-to-b from-cyan-600 to-cyan-700 text-cyan-100 shadow-inner"
                        : "bg-gray-800 text-gray-400 border border-gray-700"
                    }
                    ${(i + 1) % 8 === 0 ? "mr-1" : ""}
                    ${isNetworkBit ? "border-b-2 border-b-green-500" : ""}
                    cursor-help transition-colors duration-150
                  `}
                    title={getBitDescription(i)}
                    onMouseEnter={() => setHoverBit(i)}
                    onMouseLeave={() => setHoverBit(null)}
                  >
                    {bit}
                  </div>
                );
              })}
          </div>
          <div className="grid grid-cols-4 mt-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={`octet-${i}`}
                className="font-mono text-xs text-gray-500 flex justify-center"
              >
                Octet {i + 1}: {parseInt(maskBinary[i], 2)}
              </div>
            ))}
          </div>
        </div>

        {/* Wildcard mask */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="w-2 h-4 bg-amber-500 mr-2"></div>
            <span className="text-sm font-mono text-gray-300">
              Wildcard Mask
            </span>
            <span className="text-xs font-mono text-gray-500 ml-2">
              ({wildcardMask})
            </span>
          </div>
          <div className="grid grid-cols-32 gap-1">
            {wildcardBinary
              .join("")
              .split("")
              .map((bit, i) => {
                const isHostBit = i >= cidr;
                return (
                  <div
                    key={`wild-${i}`}
                    className={`
                    h-8 flex items-center justify-center text-sm font-bold font-mono rounded
                    ${i === hoverBit ? "ring-2 ring-yellow-400" : ""}
                    ${
                      bit === "1"
                        ? "bg-gradient-to-b from-amber-600 to-amber-700 text-amber-100 shadow-inner"
                        : "bg-gray-800 text-gray-400 border border-gray-700"
                    }
                    ${(i + 1) % 8 === 0 ? "mr-1" : ""}
                    ${isHostBit ? "border-b-2 border-b-amber-500" : ""}
                    cursor-help transition-colors duration-150
                  `}
                    title={getBitDescription(i)}
                    onMouseEnter={() => setHoverBit(i)}
                    onMouseLeave={() => setHoverBit(null)}
                  >
                    {bit}
                  </div>
                );
              })}
          </div>
          <div className="grid grid-cols-4 mt-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={`woctet-${i}`}
                className="font-mono text-xs text-gray-500 flex justify-center"
              >
                Octet {i + 1}: {parseInt(wildcardBinary[i], 2)}
              </div>
            ))}
          </div>
        </div>

        {/* CIDR visualization */}
        <div className="mt-6 p-3 bg-gray-800 border border-gray-700 rounded">
          <div className="flex items-center mb-2">
            <div className="w-2 h-4 bg-blue-500 mr-2"></div>
            <span className="text-sm font-mono text-gray-300">
              CIDR Notation: /{cidr}
            </span>
          </div>
          <div className="grid grid-cols-32 gap-1">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={`cidr-${i}`}
                className={`
                  h-6 flex items-center justify-center text-xs font-mono rounded
                  ${i === hoverBit ? "ring-2 ring-yellow-400" : ""}
                  ${
                    i < cidr
                      ? "bg-gradient-to-b from-blue-600 to-blue-700 text-blue-100"
                      : "bg-gray-700 text-gray-400"
                  }
                  ${(i + 1) % 8 === 0 ? "mr-1" : ""}
                  cursor-help transition-colors duration-150
                `}
                title={i < cidr ? "Network Bit" : "Host Bit"}
                onMouseEnter={() => setHoverBit(i)}
                onMouseLeave={() => setHoverBit(null)}
              >
                {i < cidr ? "N" : "H"}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs font-mono text-gray-400 mt-1 px-1">
            <span>Network Bits: {cidr}</span>
            <span>Host Bits: {32 - cidr}</span>
            <span>
              Usable Hosts:{" "}
              {Math.max(Math.pow(2, 32 - cidr) - 2, 0).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 font-mono">
          <p>
            <span className="text-cyan-400">Subnet mask</span> defines network
            (1s) and host (0s) portions &bull;{" "}
            <span className="text-amber-400">Wildcard mask</span> is the inverse
            (used in ACLs)
          </p>
        </div>
      </div>
    </div>
  );
}
