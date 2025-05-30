import React from "react";
import { Netmask } from "netmask";

interface BinaryTabProps {
  netmask: Netmask;
  cidr?: number; // Make it optional to avoid breaking existing usage
  createSubnetBreakdown: () => React.ReactNode;
}

const BinaryTab: React.FC<BinaryTabProps> = ({
  netmask,
  cidr,
  createSubnetBreakdown,
}) => {
  // Use the cidr from props if provided, otherwise extract it from netmask
  const networkBits = cidr !== undefined ? cidr : netmask.bitmask;

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-2 sm:p-3 transition-all hover:border-gray-600">
      <h5 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-blue-300 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Binary Network Analysis
      </h5>

      <div className="text-[10px] xs:text-xs space-y-3 sm:space-y-4">
        <div>
          <div className="flex flex-col space-y-1 sm:space-y-1.5">
            <p className="text-gray-300 mb-0.5 sm:mb-1 flex items-center">
              Network Address (Binary):
              <span className="ml-auto text-cyan-400 text-[8px] xs:text-[9px] bg-cyan-900/50 px-1.5 py-0.5 rounded-full border border-cyan-700/50">
                /{networkBits}
              </span>
            </p>
            <div className="font-mono bg-black text-gray-300 p-1.5 sm:p-2 rounded border border-gray-700 overflow-x-auto whitespace-nowrap text-[9px] xs:text-[10px] sm:text-xs">
              {netmask.base.split(".").map((octet, index) => {
                const binaryOctet = parseInt(octet)
                  .toString(2)
                  .padStart(8, "0");
                return (
                  <span key={index}>
                    {index > 0 && "."}
                    {binaryOctet.split("").map((bit, bitIndex) => {
                      const absoluteBitPosition = index * 8 + bitIndex;
                      return (
                        <span
                          key={bitIndex}
                          className={
                            absoluteBitPosition < networkBits
                              ? "text-cyan-400 font-bold"
                              : ""
                          }
                        >
                          {bit}
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </div>

            <p className="text-gray-300 mb-0.5 sm:mb-1 mt-1.5 sm:mt-2 flex items-center">
              Subnet Mask (Binary):
              <span className="ml-auto text-cyan-400 text-[8px] xs:text-[9px] bg-cyan-900/50 px-1.5 py-0.5 rounded-full border border-cyan-700/50">
                {networkBits} bits
              </span>
            </p>
            <div className="font-mono bg-black text-gray-300 p-1.5 sm:p-2 rounded border border-gray-700 overflow-x-auto whitespace-nowrap text-[9px] xs:text-[10px] sm:text-xs">
              {netmask.mask.split(".").map((octet, index) => {
                const binaryOctet = parseInt(octet)
                  .toString(2)
                  .padStart(8, "0");
                return (
                  <span key={index}>
                    {index > 0 && "."}
                    {binaryOctet.split("").map((bit, bitIndex) => {
                      const absoluteBitPosition = index * 8 + bitIndex;
                      return (
                        <span
                          key={bitIndex}
                          className={
                            absoluteBitPosition < networkBits
                              ? "text-cyan-400 font-bold"
                              : ""
                          }
                        >
                          {bit}
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </div>

            <p className="text-gray-300 mb-0.5 sm:mb-1 mt-1.5 sm:mt-2">
              Broadcast Address (Binary):
            </p>
            <div className="font-mono bg-black text-gray-300 p-1.5 sm:p-2 rounded border border-gray-700 overflow-x-auto whitespace-nowrap text-[9px] xs:text-[10px] sm:text-xs">
              {netmask.broadcast.split(".").map((octet, index) => {
                const binaryOctet = parseInt(octet)
                  .toString(2)
                  .padStart(8, "0");
                return (
                  <span key={index}>
                    {index > 0 && "."}
                    {binaryOctet.split("").map((bit, bitIndex) => {
                      const absoluteBitPosition = index * 8 + bitIndex;
                      return (
                        <span
                          key={bitIndex}
                          className={
                            absoluteBitPosition < networkBits
                              ? "text-cyan-400 font-bold"
                              : "text-amber-400"
                          }
                        >
                          {bit}
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </div>

            <p className="text-gray-300 mb-0.5 sm:mb-1 mt-1.5 sm:mt-2">
              Wildcard Mask (Binary):
            </p>
            <div className="font-mono bg-black text-gray-300 p-1.5 sm:p-2 rounded border border-gray-700 overflow-x-auto whitespace-nowrap text-[9px] xs:text-[10px] sm:text-xs">
              {netmask.hostmask.split(".").map((octet, index) => {
                const binaryOctet = parseInt(octet)
                  .toString(2)
                  .padStart(8, "0");
                return (
                  <span key={index}>
                    {index > 0 && "."}
                    {binaryOctet.split("").map((bit, bitIndex) => {
                      const absoluteBitPosition = index * 8 + bitIndex;
                      return (
                        <span
                          key={bitIndex}
                          className={
                            absoluteBitPosition < networkBits
                              ? "text-gray-700"
                              : "text-amber-400 font-bold"
                          }
                        >
                          {bit}
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-2 sm:mt-3">
          <p className="text-gray-300 mb-1.5 sm:mb-2">Binary Breakdown:</p>
          {createSubnetBreakdown()}
        </div>
      </div>
    </div>
  );
};

export default BinaryTab;
