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
  // Convert subnet mask to binary representation
  const binaryMask = netmask.mask
    .split(".")
    .map((octet) => parseInt(octet).toString(2).padStart(8, "0"))
    .join("");

  // Convert wildcard mask to binary representation
  const binaryWildcard = wildcardMask
    .split(".")
    .map((octet) => parseInt(octet).toString(2).padStart(8, "0"))
    .join("");

  return (
    <div className="mt-4 mb-8 bg-gray-900 rounded-lg p-4 sm:p-5 border border-gray-700 shadow-lg">
      <div className="flex items-center mb-4">
        <div className="w-1.5 h-5 bg-blue-500 mr-2"></div>
        <h3 className="text-base sm:text-lg font-mono font-semibold text-gray-200">
          Subnet Mask Binary Breakdown
        </h3>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="w-24 pr-4 py-2 text-right text-xs text-gray-400 align-top">
                <span className="inline-block mt-1">CIDR Prefix:</span>
              </td>
              <td>
                <div className="flex items-center bg-gray-800 rounded-md overflow-hidden border border-gray-700">
                  <div
                    className="h-8 bg-blue-600"
                    style={{ width: `${(cidr / 32) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>0</span>
                  <span>8</span>
                  <span>16</span>
                  <span>24</span>
                  <span>32</span>
                </div>
                <div className="mt-1 text-center text-xs text-blue-400 font-mono">
                  {cidr} bits
                </div>
              </td>
            </tr>
            <tr>
              <td className="w-24 pr-4 py-3 text-right text-xs text-gray-400">
                Subnet Mask:
              </td>
              <td className="py-2">
                <div className="flex flex-wrap text-center text-xs font-mono">
                  {binaryMask.split("").map((bit, i) => (
                    <span
                      key={`subnet-bit-${i}`}
                      className={`w-6 h-6 flex items-center justify-center m-0.5 rounded ${
                        bit === "1"
                          ? "bg-blue-700 text-white"
                          : "bg-gray-800 text-gray-400"
                      } ${i === cidr - 1 ? "border-r-2 border-cyan-400" : ""}`}
                    >
                      {bit}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-center text-white text-sm font-mono">
                  {netmask.mask}
                </div>
              </td>
            </tr>
            <tr>
              <td className="w-24 pr-4 py-3 text-right text-xs text-gray-400">
                Wildcard Mask:
              </td>
              <td className="py-2">
                <div className="flex flex-wrap text-center text-xs font-mono">
                  {binaryWildcard.split("").map((bit, i) => (
                    <span
                      key={`wildcard-bit-${i}`}
                      className={`w-6 h-6 flex items-center justify-center m-0.5 rounded ${
                        bit === "1"
                          ? "bg-amber-700 text-white"
                          : "bg-gray-800 text-gray-400"
                      } ${i === cidr - 1 ? "border-l-2 border-cyan-400" : ""}`}
                    >
                      {bit}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-center text-white text-sm font-mono">
                  {wildcardMask}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-2 text-xs text-gray-400 bg-gray-800 rounded border border-gray-700">
        <p>
          The subnet mask uses{" "}
          <span className="text-blue-400 font-mono">1</span> for network bits
          and <span className="text-gray-500 font-mono">0</span> for host bits.
          The wildcard mask (inverse of subnet mask) uses{" "}
          <span className="text-amber-500 font-mono">1</span> for host bits and{" "}
          <span className="text-gray-500 font-mono">0</span> for network bits.
        </p>
      </div>
    </div>
  );
}
