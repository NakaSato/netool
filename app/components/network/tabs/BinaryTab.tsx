import React from "react";
import { Netmask } from "netmask";

interface BinaryTabProps {
  netmask: Netmask;
  cidr?: number; // Make it optional to avoid breaking existing usage
  createSubnetBreakdown: () => React.ReactNode;
}

const BinaryTab: React.FC<BinaryTabProps> = ({
  netmask,
  createSubnetBreakdown,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
      <h5 className="text-sm font-semibold mb-3 text-blue-300 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
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

      <div className="text-xs space-y-4">
        <div>
          <div className="flex flex-col space-y-1">
            <p className="text-gray-300 mb-1">Network Address (Binary):</p>
            <div className="font-mono bg-black text-gray-300 p-2 rounded border border-gray-700 overflow-x-auto">
              {netmask.base
                .split(".")
                .map((octet) => parseInt(octet).toString(2).padStart(8, "0"))
                .join(".")}
            </div>

            <p className="text-gray-300 mb-1 mt-2">Subnet Mask (Binary):</p>
            <div className="font-mono bg-black text-gray-300 p-2 rounded border border-gray-700 overflow-x-auto">
              {netmask.mask
                .split(".")
                .map((octet) => parseInt(octet).toString(2).padStart(8, "0"))
                .join(".")}
            </div>

            <p className="text-gray-300 mb-1 mt-2">
              Broadcast Address (Binary):
            </p>
            <div className="font-mono bg-black text-gray-300 p-2 rounded border border-gray-700 overflow-x-auto">
              {netmask.broadcast
                .split(".")
                .map((octet) => parseInt(octet).toString(2).padStart(8, "0"))
                .join(".")}
            </div>

            <p className="text-gray-300 mb-1 mt-2">Wildcard Mask (Binary):</p>
            <div className="font-mono bg-black text-gray-300 p-2 rounded border border-gray-700 overflow-x-auto">
              {netmask.hostmask
                .split(".")
                .map((octet) => parseInt(octet).toString(2).padStart(8, "0"))
                .join(".")}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-300 mb-2">Binary Breakdown:</p>
          {createSubnetBreakdown()}
        </div>
      </div>
    </div>
  );
};

export default BinaryTab;
