import React from "react";
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
  // Convert decimal subnet mask to binary representation
  const maskBinary = netmask.mask
    .split(".")
    .map((octet) => parseInt(octet).toString(2).padStart(8, "0"));

  // Convert wildcard mask to binary as well
  const wildcardBinary = wildcardMask
    .split(".")
    .map((octet) => parseInt(octet).toString(2).padStart(8, "0"));

  return (
    <div className="mt-6 mb-8 bg-gray-900 border border-gray-700 rounded-lg shadow-md hover:shadow-lg">
      <div className="border-b border-gray-700 px-6 py-4 flex items-center">
        <div className="w-2 h-5 bg-indigo-400 mr-3"></div>
        <h4 className="font-semibold text-lg text-gray-200 font-mono">
          BINARY MASK VISUALIZATION
        </h4>
        <span className="ml-auto text-sm bg-gray-800 text-indigo-300 px-3 py-1.5 rounded-md font-mono border border-indigo-900">
          /{cidr} = {netmask.mask}
        </span>
      </div>

      <div className="p-5">
        {/* Subnet Mask Binary */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <div className="w-5 h-5 bg-indigo-600 rounded-sm mr-2 flex-shrink-0"></div>
            <span className="text-sm md:text-base font-medium text-indigo-300 font-mono">
              Subnet Mask
            </span>
            <span className="text-xs md:text-sm ml-auto text-gray-400 font-mono">
              {netmask.mask}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {maskBinary.map((octet, i) => (
              <div
                key={`mask-binary-${i}`}
                className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800"
              >
                <div className="text-xs text-center text-indigo-100 bg-indigo-800 py-1 font-mono">
                  Octet {i + 1}
                </div>
                <div className="p-1">
                  <div className="flex mb-1">
                    {octet.split("").map((bit, j) => (
                      <div
                        key={`mask-bit-${i}-${j}`}
                        className={`w-5 h-5 flex items-center justify-center text-xs border ${
                          bit === "1"
                            ? "bg-indigo-700 text-white font-bold border-indigo-600"
                            : "bg-gray-900 text-gray-400 border-gray-700"
                        } ${(j + 1) % 4 === 0 ? "mr-1" : ""}`}
                      >
                        {bit}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-center font-mono mt-1 text-gray-300">
                    {netmask.mask.split(".")[i]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wildcard Mask Binary */}
        <div className="mb-3">
          <div className="flex items-center mb-3">
            <div className="w-5 h-5 bg-amber-500 rounded-sm mr-2 flex-shrink-0"></div>
            <span className="text-sm font-medium text-amber-300 font-mono">
              Wildcard Mask
            </span>
            <span className="text-xs ml-auto text-gray-400 font-mono">
              {wildcardMask}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {wildcardBinary.map((octet, i) => (
              <div
                key={`wildcard-binary-${i}`}
                className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800"
              >
                <div className="text-xs text-center text-amber-900 bg-amber-500 py-1 font-mono">
                  Octet {i + 1}
                </div>
                <div className="p-1">
                  <div className="flex mb-1">
                    {octet.split("").map((bit, j) => (
                      <div
                        key={`wildcard-bit-${i}-${j}`}
                        className={`w-5 h-5 flex items-center justify-center text-xs border ${
                          bit === "1"
                            ? "bg-amber-600 text-white font-bold border-amber-500"
                            : "bg-gray-900 text-gray-400 border-gray-700"
                        } ${(j + 1) % 4 === 0 ? "mr-1" : ""}`}
                      >
                        {bit}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-center font-mono mt-1 text-gray-300">
                    {wildcardMask.split(".")[i]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Educational note */}
        <div className="mt-5 text-xs text-gray-300 bg-gray-800 rounded-md p-3 border border-gray-700 font-mono">
          <div className="flex items-start mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 mt-0.5 text-indigo-400 flex-shrink-0"
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
            <span className="text-indigo-300 font-semibold">
              Understanding Binary Subnet Masks:
            </span>
          </div>
          <p className="ml-6 text-gray-400">
            The subnet mask contains consecutive 1s followed by 0s, with {cidr}{" "}
            1-bits corresponding to the network portion.
          </p>
          <p className="mt-1 ml-6 text-gray-400">
            The wildcard mask is the inverse (0s where subnet mask has 1s, and
            vice versa).
          </p>
          <div className="mt-2 bg-gray-900 rounded p-2 ml-6 text-green-400">
            <code>subnet_mask + wildcard_mask = 255.255.255.255</code>
          </div>
        </div>
      </div>
    </div>
  );
}
