import React, { useState } from "react";
import { Netmask } from "netmask";
import {
  getNetworkClass,
  getCommonNetworkSize,
  getExactPowerOfTwo,
} from "../utils/networkUtils";

interface RangeVisualizerProps {
  netmask: Netmask;
  ip: number[];
  cidr: number;
  networkColors: {
    octets: string[];
    classes: {
      a: { bg: string; text: string };
      b: { bg: string; text: string };
      c: { bg: string; text: string };
      small: { bg: string; text: string };
    };
  };
  networkSizePercentage: number;
  handleFieldCopy: (value: string, fieldName: string) => void;
}

export default function RangeVisualizer({
  netmask,
  ip,
  cidr,
  networkColors,
  networkSizePercentage,
  handleFieldCopy,
}: RangeVisualizerProps) {
  const [showAdvancedInfo, setShowAdvancedInfo] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const totalIPv4Space = 4294967296; // 2^32

  // Calculate numeric values for the selected IP and CIDR
  const firstIPNum = ip[0] * 16777216 + ip[1] * 65536 + ip[2] * 256 + ip[3];

  // Information for the network class
  const networkClass = getNetworkClass(ip);
  const commonSize = getCommonNetworkSize(cidr);
  const powerOfTwo = getExactPowerOfTwo(cidr);

  // Generate classes for size visualization
  let sizeClass = "w-full";
  if (networkSizePercentage < 0.0001) {
    sizeClass = "w-px";
  } else if (networkSizePercentage < 0.001) {
    sizeClass = "w-1";
  } else if (networkSizePercentage < 0.01) {
    sizeClass = "w-2";
  } else if (networkSizePercentage < 0.1) {
    sizeClass = "w-4";
  } else if (networkSizePercentage < 1) {
    sizeClass = "w-8";
  } else if (networkSizePercentage < 5) {
    sizeClass = "w-16";
  } else if (networkSizePercentage < 10) {
    sizeClass = "w-24";
  } else if (networkSizePercentage < 25) {
    sizeClass = "w-32";
  } else {
    sizeClass = "w-full";
  }

  // Calculate potential route summarization with more efficient computation
  const getRouteSummarization = () => {
    // Calculate parent network (summarization)
    const summarizableCidr = Math.max(0, cidr - 1);
    const bitShift = 32 - summarizableCidr;
    const summarizablePrefix =
      bitShift > 0 ? (firstIPNum >> bitShift) << bitShift : 0;

    const summarizableIP = [
      (summarizablePrefix >> 24) & 255,
      (summarizablePrefix >> 16) & 255,
      (summarizablePrefix >> 8) & 255,
      summarizablePrefix & 255,
    ].join(".");

    // Calculate supernetting information (aggregation possibilities)
    const supernettingInfo = [];
    for (let i = 1; i <= Math.min(4, cidr); i++) {
      const supernetCidr = cidr - i;
      if (supernetCidr < 1) break;

      const supernetBitShift = 32 - supernetCidr;
      const supernetPrefix =
        (firstIPNum >> supernetBitShift) << supernetBitShift;

      const supernetIP = [
        (supernetPrefix >> 24) & 255,
        (supernetPrefix >> 16) & 255,
        (supernetPrefix >> 8) & 255,
        supernetPrefix & 255,
      ].join(".");

      supernettingInfo.push({
        cidr: supernetCidr,
        network: `${supernetIP}/${supernetCidr}`,
        size: Math.pow(2, 32 - supernetCidr),
        contains: Math.pow(2, i),
      });
    }

    return {
      summarizableCidr,
      summarizableNetwork: `${summarizableIP}/${summarizableCidr}`,
      supernetting: supernettingInfo,
    };
  };

  const { summarizableCidr, summarizableNetwork, supernetting } =
    getRouteSummarization();

  // Generate CIDR subnet blocks for this network
  const getSubnetTable = () => {
    if (cidr >= 24) return null;

    const bitsToShow = Math.min(3, 24 - cidr);
    const subnetsToShow = Math.pow(2, bitsToShow);

    const subnets = [];
    const subnetSize = netmask.size / Math.pow(2, bitsToShow);

    for (let i = 0; i < subnetsToShow; i++) {
      const subnetBase = firstIPNum + i * subnetSize;
      const subnetBaseIP = [
        (subnetBase >> 24) & 255,
        (subnetBase >> 16) & 255,
        (subnetBase >> 8) & 255,
        subnetBase & 255,
      ].join(".");

      subnets.push({
        subnet: `${subnetBaseIP}/${cidr + bitsToShow}`,
        hosts: subnetSize,
        range: `${subnetBaseIP} - ${[
          ((subnetBase + subnetSize - 1) >> 24) & 255,
          ((subnetBase + subnetSize - 1) >> 16) & 255,
          ((subnetBase + subnetSize - 1) >> 8) & 255,
          (subnetBase + subnetSize - 1) & 255,
        ].join(".")}`,
      });
    }

    return subnets;
  };

  const getSpecialPurposeInfo = () => {
    if (ip[0] === 10) {
      return {
        type: "Private",
        description: "RFC 1918 Private Address Space (10.0.0.0/8)",
        rfc: "1918",
      };
    } else if (ip[0] === 172 && ip[1] >= 16 && ip[1] <= 31) {
      return {
        type: "Private",
        description: "RFC 1918 Private Address Space (172.16.0.0/12)",
        rfc: "1918",
      };
    } else if (ip[0] === 192 && ip[1] === 168) {
      return {
        type: "Private",
        description: "RFC 1918 Private Address Space (192.168.0.0/16)",
        rfc: "1918",
      };
    } else if (ip[0] === 127) {
      return {
        type: "Loopback",
        description: "Loopback Addresses (127.0.0.0/8)",
        rfc: "1122",
      };
    } else if (ip[0] === 169 && ip[1] === 254) {
      return {
        type: "Link-Local",
        description: "Link-Local Addresses (169.254.0.0/16)",
        rfc: "3927",
      };
    } else if (ip[0] === 192 && ip[1] === 0 && ip[2] === 2) {
      return {
        type: "TEST-NET",
        description: "TEST-NET for Documentation (192.0.2.0/24)",
        rfc: "5737",
      };
    } else if (ip[0] === 198 && ip[1] === 51 && ip[2] === 100) {
      return {
        type: "TEST-NET",
        description: "TEST-NET-1 for Documentation (198.51.100.0/24)",
        rfc: "5737",
      };
    } else if (ip[0] === 203 && ip[1] === 0 && ip[2] === 113) {
      return {
        type: "TEST-NET",
        description: "TEST-NET-2 for Documentation (203.0.113.0/24)",
        rfc: "5737",
      };
    } else if (ip[0] >= 224 && ip[0] <= 239) {
      return {
        type: "Multicast",
        description: "Multicast Addresses (224.0.0.0/4)",
        rfc: "3171",
      };
    } else if (ip[0] === 0) {
      return {
        type: "Special",
        description: "This Network (0.0.0.0/8)",
        rfc: "1122",
      };
    } else if (ip[0] === 100 && ip[1] >= 64 && ip[1] <= 127) {
      return {
        type: "Shared Address Space",
        description: "Carrier-Grade NAT (100.64.0.0/10)",
        rfc: "6598",
      };
    } else if (ip[0] >= 240) {
      return {
        type: "Reserved",
        description: "Reserved Address Range (240.0.0.0/4)",
        rfc: "1112",
      };
    }

    return {
      type: "Public",
      description: "Globally Routable Public Address Space",
      rfc: "N/A",
    };
  };

  const specialPurpose = getSpecialPurposeInfo();
  const subnets = getSubnetTable();

  // Add a technical binary representation for network engineers
  const getBinaryRepresentation = () => {
    return ip.map((octet) => octet.toString(2).padStart(8, "0")).join(".");
  };

  const binaryIP = getBinaryRepresentation();

  // Add hex representation that network engineers often use
  const getHexRepresentation = () => {
    return ip.map((octet) => octet.toString(16).padStart(2, "0")).join(":");
  };

  const hexIP = getHexRepresentation();

  const createSubnetBreakdown = () => {
    return (
      <div className="mt-3 mb-2">
        <div className="text-xs mb-2 text-gray-600 font-medium">
          Network Bits vs Host Bits:
        </div>
        <div className="flex flex-col space-y-1">
          {/* Binary representation with network/host bit separation */}
          <div className="font-mono text-xs flex items-center bg-gray-800 rounded p-1 overflow-x-auto">
            <div className="flex">
              {binaryIP.split(".").map((octet, octIndex) => (
                <div key={octIndex} className="flex">
                  {octIndex > 0 && (
                    <span className="text-gray-400 px-0.5">.</span>
                  )}
                  {octet.split("").map((bit, bitIndex) => {
                    const absoluteBitPosition = octIndex * 8 + bitIndex;
                    return (
                      <span
                        key={bitIndex}
                        className={`${
                          absoluteBitPosition < cidr
                            ? "bg-blue-600 text-white"
                            : "bg-amber-500 text-gray-900"
                        } px-1 font-bold text-center`}
                        title={
                          absoluteBitPosition < cidr
                            ? `Network bit ${absoluteBitPosition + 1}`
                            : `Host bit ${absoluteBitPosition - cidr + 1}`
                        }
                      >
                        {bit}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Bit position indicators */}
          <div className="font-mono text-[9px] flex justify-between text-gray-500">
            <span>bit 1</span>
            <span>bit 8</span>
            <span>bit 16</span>
            <span>bit 24</span>
            <span>bit 32</span>
          </div>

          {/* Octet markers */}
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>1st Octet</span>
            <span>2nd Octet</span>
            <span>3rd Octet</span>
            <span>4th Octet</span>
          </div>
        </div>

        <div className="flex justify-between mt-3 items-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
            <span className="text-xs text-gray-200">Network bits ({cidr})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded-sm"></div>
            <span className="text-xs text-gray-200">
              Host bits ({32 - cidr})
            </span>
          </div>
        </div>

        {/* Prefix length slider visualization */}
        <div className="mt-3 h-2 bg-gray-700 rounded-full relative">
          <div
            className="absolute h-full bg-blue-600 rounded-full"
            style={{ width: `${(cidr / 32) * 100}%` }}
          ></div>
          <div
            className="absolute h-4 w-4 bg-white border-2 border-blue-600 rounded-full top-1/2 transform -translate-y-1/2"
            style={{ left: `calc(${(cidr / 32) * 100}% - 8px)` }}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>/0</span>
          <span>/8</span>
          <span>/16</span>
          <span>/24</span>
          <span>/32</span>
        </div>
      </div>
    );
  };

  const tabStyles = {
    active: "px-4 py-2 text-xs font-medium bg-blue-700 text-white rounded-t-md",
    inactive:
      "px-4 py-2 text-xs font-medium bg-gray-700 text-gray-300 rounded-t-md hover:bg-gray-600",
  };

  return (
    <div className="mt-6 mb-8 rounded-lg shadow-lg bg-gray-900 text-white border border-gray-700">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 rounded-t-lg border-b border-gray-700 flex flex-wrap justify-between items-center gap-2">
        <h3 className="font-bold text-lg sm:text-xl flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Network Analysis • {ip.join(".")}/{cidr}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 bg-blue-900 text-blue-200 rounded-md font-mono whitespace-nowrap border border-blue-700">
            {commonSize}
          </span>
          <button
            onClick={() => setShowAdvancedInfo(!showAdvancedInfo)}
            className="text-xs py-1 px-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md border border-gray-600 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {showAdvancedInfo ? "Hide" : "Show"} Advanced
          </button>
        </div>
      </div>

      {/* Terminal-style technical notations */}
      <div className="mb-3 p-3 bg-black border border-gray-700 mx-4 mt-4 rounded-md text-xs font-mono overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-green-400 inline-block w-16">Dotted:</span>
            <span className="text-gray-200">
              {ip.join(".")}/{cidr}
            </span>
          </div>
          <div>
            <span className="text-green-400 inline-block w-16">Binary:</span>
            <span className="text-gray-200 text-[10px] sm:text-xs break-all">
              {binaryIP}
            </span>
          </div>
          <div>
            <span className="text-green-400 inline-block w-16">Hex:</span>
            <span className="text-gray-200">{hexIP}</span>
          </div>
          <div>
            <span className="text-green-400 inline-block w-16">Wildcard:</span>
            <span className="text-gray-200">{netmask.hostmask}</span>
          </div>
        </div>
      </div>

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

      {/* Network tabs */}
      <div className="px-4 border-b border-gray-700">
        <div className="flex space-x-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={
              activeTab === "overview" ? tabStyles.active : tabStyles.inactive
            }
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("subnet")}
            className={
              activeTab === "subnet" ? tabStyles.active : tabStyles.inactive
            }
          >
            Subnet Analysis
          </button>
          <button
            onClick={() => setActiveTab("router")}
            className={
              activeTab === "router" ? tabStyles.active : tabStyles.inactive
            }
          >
            Router Config
          </button>
          <button
            onClick={() => setActiveTab("binary")}
            className={
              activeTab === "binary" ? tabStyles.active : tabStyles.inactive
            }
          >
            Binary View
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === "overview" && (
          <>
            <div className="relative mb-1">
              <div className="absolute -top-3 left-1/2 h-3 w-px bg-blue-500"></div>
              <div className="absolute -top-3 left-3/4 h-3 w-px bg-blue-500"></div>
              <div className="absolute -top-3 left-[87.5%] h-3 w-px bg-blue-500"></div>
            </div>

            <div className="h-10 sm:h-12 md:h-14 w-full bg-gray-800 rounded-md relative overflow-hidden border border-gray-700">
              <div
                className={`h-full ${sizeClass} ${
                  cidr <= 8
                    ? networkColors.classes.a.bg
                    : cidr <= 16
                    ? networkColors.classes.b.bg
                    : cidr <= 24
                    ? networkColors.classes.c.bg
                    : networkColors.classes.small.bg
                } absolute hover:brightness-90 transition-all duration-200 cursor-help`}
                style={{
                  left: `${(firstIPNum / totalIPv4Space) * 100}%`,
                  maxWidth: "100%",
                }}
                title={`Range: ${netmask.first} - ${netmask.last}`}
                onClick={() =>
                  handleFieldCopy(
                    `${netmask.first} - ${netmask.last}`,
                    "IP Range"
                  )
                }
              >
                {networkSizePercentage > 5 && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                    {netmask.size >= 1000000
                      ? `${(netmask.size / 1000000).toFixed(1)}M IPs`
                      : netmask.size >= 1000
                      ? `${(netmask.size / 1000).toFixed(1)}K IPs`
                      : `${netmask.size} IPs`}
                  </span>
                )}
              </div>

              <div
                className="absolute h-full w-px bg-gray-500 left-1/2"
                title="128.0.0.0 (Class A/B boundary)"
              ></div>
              <div
                className="absolute h-full w-px bg-gray-500 left-3/4"
                title="192.0.0.0 (Class B/C boundary)"
              ></div>
              <div
                className="absolute h-full w-px bg-gray-500 left-[87.5%]"
                title="224.0.0.0 (Class C/D boundary)"
              ></div>
            </div>

            <div className="flex justify-between text-xs text-gray-400 mt-1 overflow-x-auto pb-1">
              <span className="font-mono whitespace-nowrap">0.0.0.0</span>
              <span className="font-mono whitespace-nowrap">128.0.0.0</span>
              <span className="font-mono whitespace-nowrap">192.0.0.0</span>
              <span className="font-mono whitespace-nowrap">224.0.0.0</span>
              <span className="font-mono whitespace-nowrap">
                255.255.255.255
              </span>
            </div>

            <div className="text-xs sm:text-sm mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-gray-800 rounded border border-gray-700">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold">Network Size</h4>
                  <span className="text-xs py-0.5 px-1.5 bg-blue-900 text-blue-200 rounded border border-blue-700">
                    {netmask.size >= 1000000
                      ? `${(netmask.size / 1000000).toFixed(1)}M`
                      : netmask.size >= 1000
                      ? `${(netmask.size / 1000).toFixed(1)}K`
                      : netmask.size}{" "}
                    IPs
                  </span>
                </div>
                <p className="text-gray-300">
                  {netmask.size.toLocaleString()} addresses ({powerOfTwo})
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {networkSizePercentage < 0.0001
                    ? "< 0.0001"
                    : networkSizePercentage.toFixed(6)}
                  % of IPv4 space
                </p>
                {createSubnetBreakdown()}
              </div>

              <div className="p-3 bg-gray-800 rounded border border-gray-700">
                <h4 className="font-semibold mb-1">Network Class</h4>
                <p className="text-gray-300">Class {networkClass.class}</p>
                <p className="text-gray-400 text-xs mt-1">
                  Traditional range: {networkClass.range}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Default mask: {networkClass.defaultMask}
                </p>
                <div className="mt-2 pt-2 border-t border-gray-600">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <span className="font-medium text-xs text-gray-300 w-24">
                        Leading bits:
                      </span>
                      <div className="flex gap-0.5">
                        {networkClass.class === "A" ? (
                          <span className="inline-block px-1.5 py-0.5 bg-blue-900 text-blue-200 text-[10px] font-mono rounded border border-blue-700">
                            0
                          </span>
                        ) : networkClass.class === "B" ? (
                          <>
                            <span className="inline-block px-1.5 py-0.5 bg-blue-900 text-blue-200 text-[10px] font-mono rounded border border-blue-700">
                              1
                            </span>
                            <span className="inline-block px-1.5 py-0.5 bg-blue-900 text-blue-200 text-[10px] font-mono rounded border border-blue-700">
                              0
                            </span>
                          </>
                        ) : networkClass.class === "C" ? (
                          <>
                            <span className="inline-block px-1.5 py-0.5 bg-blue-900 text-blue-200 text-[10px] font-mono rounded border border-blue-700">
                              1
                            </span>
                            <span className="inline-block px-1.5 py-0.5 bg-blue-900 text-blue-200 text-[10px] font-mono rounded border border-blue-700">
                              1
                            </span>
                            <span className="inline-block px-1.5 py-0.5 bg-blue-900 text-blue-200 text-[10px] font-mono rounded border border-blue-700">
                              0
                            </span>
                          </>
                        ) : networkClass.class === "D" ? (
                          <>
                            <span className="inline-block px-1.5 py-0.5 bg-blue-900 text-blue-200 text-[10px] font-mono rounded border border-blue-700">
                              1
                            </span>
                            <span className="inline-block px-1.5 py-0.5 bg-blue-900 text-blue-200 text-[10px] font-mono rounded border border-blue-700">
                              1
                            </span>
                            <span className="inline-block px-1.5 py-0.5 bg-blue-900 text-blue-200 text-[10px] font-mono rounded border border-blue-700">
                              1
                            </span>
                            <span className="inline-block px-1.5 py-0.5 bg-blue-900 text-blue-200 text-[10px] font-mono rounded border border-blue-700">
                              0
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="inline-block px-1.5 py-0.5 bg-blue-900 text-blue-200 text-[10px] font-mono rounded border border-blue-700">
                              1
                            </span>
                            <span className="inline-block px-1.5 py-0.5 bg-blue-900 text-blue-200 text-[10px] font-mono rounded border border-blue-700">
                              1
                            </span>
                            <span className="inline-block px-1.5 py-0.5 bg-blue-900 text-blue-200 text-[10px] font-mono rounded border border-blue-700">
                              1
                            </span>
                            <span className="inline-block px-1.5 py-0.5 bg-blue-900 text-blue-200 text-[10px] font-mono rounded border border-blue-700">
                              1
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <span className="font-medium text-xs text-gray-300 w-24">
                        Usage:
                      </span>
                      <div className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300 flex-1 border border-gray-600">
                        {networkClass.class === "A" ? (
                          <span className="flex items-center">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                            Large networks (16M hosts)
                          </span>
                        ) : networkClass.class === "B" ? (
                          <span className="flex items-center">
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1.5"></span>
                            Medium networks (65K hosts)
                          </span>
                        ) : networkClass.class === "C" ? (
                          <span className="flex items-center">
                            <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-1.5"></span>
                            Small networks (254 hosts)
                          </span>
                        ) : networkClass.class === "D" ? (
                          <span className="flex items-center">
                            <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-1.5"></span>
                            Multicast groups
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
                            Reserved for future use
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 p-1.5 bg-yellow-900 border border-yellow-800 rounded-md">
                    <p className="text-[10px] text-yellow-200">
                      <span className="font-semibold">Note:</span> Modern
                      networking uses CIDR notation (/{cidr}) rather than
                      traditional class-based addressing for more efficient
                      allocation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!showAdvancedInfo && (
              <div className="mt-4 p-2 border border-gray-700 rounded bg-gray-800">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-2">
                  <div>
                    <span className="font-medium text-gray-300">
                      Subnet Mask:
                    </span>
                    <span className="ml-2 font-mono text-blue-300">
                      {netmask.mask}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-300">
                      Binary Mask:
                    </span>
                    <span className="ml-2 font-mono text-[10px] sm:text-xs text-blue-300">
                      {Array(cidr)
                        .fill("1")
                        .concat(Array(32 - cidr).fill("0"))
                        .join("")
                        .match(/.{1,8}/g)
                        ?.join(".")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "subnet" && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
            <h5 className="text-sm font-semibold mb-3 text-blue-300 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Subnet Design Options
            </h5>

            <div className="text-xs">
              <div className="mb-2">
                <p className="text-gray-300">Common subnet division options:</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-2 py-1 text-left border border-gray-600 text-gray-300">
                        Add Bits
                      </th>
                      <th className="px-2 py-1 text-left border border-gray-600 text-gray-300">
                        New Prefix
                      </th>
                      <th className="px-2 py-1 text-left border border-gray-600 text-gray-300">
                        # of Subnets
                      </th>
                      <th className="px-2 py-1 text-left border border-gray-600 text-gray-300">
                        Hosts per Subnet
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4].map(
                      (bits) =>
                        cidr + bits <= 30 && (
                          <tr
                            key={`subnet-option-${bits}`}
                            className="border-b border-gray-700 hover:bg-gray-700"
                          >
                            <td className="px-2 py-1 border border-gray-600 text-gray-300">
                              +{bits}
                            </td>
                            <td className="px-2 py-1 border border-gray-600 text-blue-300 font-mono">
                              /{cidr + bits}
                            </td>
                            <td className="px-2 py-1 border border-gray-600 text-green-300">
                              {Math.pow(2, bits).toLocaleString()}
                            </td>
                            <td className="px-2 py-1 border border-gray-600 text-amber-300">
                              {Math.pow(2, 32 - (cidr + bits)) - 2 > 0
                                ? (
                                    Math.pow(2, 32 - (cidr + bits)) - 2
                                  ).toLocaleString()
                                : "Point-to-point"}
                            </td>
                          </tr>
                        )
                    )}
                  </tbody>
                </table>
              </div>

              {subnets && (
                <>
                  <h5 className="text-sm font-semibold mt-4 mb-2 text-blue-300">
                    Sample Subnet Breakdown (first {subnets.length} of{" "}
                    {Math.pow(2, 24 - cidr)})
                  </h5>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-700">
                          <th className="px-2 py-1 text-left border border-gray-600 text-gray-300">
                            Subnet
                          </th>
                          <th className="px-2 py-1 text-left border border-gray-600 text-gray-300">
                            IP Range
                          </th>
                          <th className="px-2 py-1 text-right border border-gray-600 text-gray-300">
                            Usable Hosts
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {subnets.map((subnet, i) => (
                          <tr
                            key={`subnet-row-${i}`}
                            className="border-b border-gray-700 hover:bg-gray-700"
                          >
                            <td className="px-2 py-1 border border-gray-600 font-mono text-blue-300">
                              {subnet.subnet}
                            </td>
                            <td className="px-2 py-1 border border-gray-600 font-mono text-gray-300">
                              {subnet.range}
                            </td>
                            <td className="px-2 py-1 text-right border border-gray-600 text-amber-300">
                              {(subnet.hosts - 2).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === "router" && (
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
                  d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              Router Configuration Examples
            </h5>

            <div className="text-xs space-y-4">
              <div>
                <p className="mb-1 text-gray-300">Cisco IOS Route Entry:</p>
                <div className="font-mono bg-black text-green-400 p-3 rounded mb-2 border border-gray-700 overflow-x-auto">
                  ip route {netmask.base} {netmask.mask} [next-hop-ip]
                </div>
              </div>

              <div>
                <p className="mb-1 text-gray-300">
                  Router Access Control List:
                </p>
                <div className="font-mono bg-black text-green-400 p-3 rounded mb-2 border border-gray-700 overflow-x-auto">
                  permit ip {netmask.base} {netmask.mask} any
                </div>
              </div>

              <div>
                <p className="mb-1 text-gray-300">BGP Route Advertisement:</p>
                <div className="font-mono bg-black text-green-400 p-3 rounded mb-2 border border-gray-700 overflow-x-auto">
                  network {netmask.base} mask {netmask.mask}
                </div>
              </div>

              <div>
                <p className="mb-1 text-gray-300">
                  OSPF Configuration (Area 0):
                </p>
                <div className="font-mono bg-black text-green-400 p-3 rounded mb-2 border border-gray-700 overflow-x-auto whitespace-pre-wrap">
                  {`interface GigabitEthernet0/0
 ip address ${ip.join(".")} ${netmask.mask}
!
router ospf 1
 network ${netmask.base} ${netmask.hostmask} area 0`}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "binary" && (
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
                  <p className="text-gray-300 mb-1">
                    Network Address (Binary):
                  </p>
                  <div className="font-mono bg-black text-gray-300 p-2 rounded border border-gray-700 overflow-x-auto">
                    {netmask.base
                      .split(".")
                      .map((octet) =>
                        parseInt(octet).toString(2).padStart(8, "0")
                      )
                      .join(".")}
                  </div>

                  <p className="text-gray-300 mb-1 mt-2">
                    Subnet Mask (Binary):
                  </p>
                  <div className="font-mono bg-black text-gray-300 p-2 rounded border border-gray-700 overflow-x-auto">
                    {netmask.mask
                      .split(".")
                      .map((octet) =>
                        parseInt(octet).toString(2).padStart(8, "0")
                      )
                      .join(".")}
                  </div>

                  <p className="text-gray-300 mb-1 mt-2">
                    Broadcast Address (Binary):
                  </p>
                  <div className="font-mono bg-black text-gray-300 p-2 rounded border border-gray-700 overflow-x-auto">
                    {netmask.broadcast
                      .split(".")
                      .map((octet) =>
                        parseInt(octet).toString(2).padStart(8, "0")
                      )
                      .join(".")}
                  </div>

                  <p className="text-gray-300 mb-1 mt-2">
                    Wildcard Mask (Binary):
                  </p>
                  <div className="font-mono bg-black text-gray-300 p-2 rounded border border-gray-700 overflow-x-auto">
                    {netmask.hostmask
                      .split(".")
                      .map((octet) =>
                        parseInt(octet).toString(2).padStart(8, "0")
                      )
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
        )}

        {showAdvancedInfo && (
          <div className="mt-6 border-t border-gray-700 pt-4">
            <h4 className="font-semibold text-base mb-3 text-blue-300">
              Advanced Networking Information
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                <h5 className="text-sm font-semibold mb-2 flex items-center text-blue-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Route Summarization
                </h5>

                <div className="text-xs space-y-2">
                  <p className="text-gray-300">
                    This network could be part of a larger summarized route:
                  </p>
                  <div className="font-mono bg-black p-2 rounded text-green-400 border border-gray-700">
                    {summarizableNetwork} (
                    {Math.pow(2, 32 - summarizableCidr).toLocaleString()}{" "}
                    addresses)
                  </div>
                  <p className="text-gray-400">
                    Summary routes help reduce routing table size by combining
                    multiple smaller routes into a single route advertisement.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                <h5 className="text-sm font-semibold mb-2 flex items-center text-blue-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Network Boundary
                </h5>

                <div className="text-xs space-y-1.5">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-gray-400">Network ID:</div>
                    <div className="font-mono text-blue-300">
                      {netmask.base}
                    </div>

                    <div className="text-gray-400">Broadcast IP:</div>
                    <div className="font-mono text-red-300">
                      {netmask.broadcast}
                    </div>

                    <div className="text-gray-400">First Host IP:</div>
                    <div className="font-mono text-green-300">
                      {netmask.first}
                    </div>

                    <div className="text-gray-400">Last Host IP:</div>
                    <div className="font-mono text-green-300">
                      {netmask.last}
                    </div>
                  </div>

                  <p className="text-gray-400 mt-2">
                    These boundary addresses define the network range and are
                    critical for proper network configuration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
    </div>
  );
}
