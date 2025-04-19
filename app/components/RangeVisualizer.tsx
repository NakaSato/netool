import React, { useState } from "react";
import { Netmask } from "netmask";
import {
  getNetworkClass,
  getCommonNetworkSize,
  getExactPowerOfTwo,
} from "../utils/networkUtils";
import TechnicalNotations from "./network/TechnicalNotations";
import NetworkTypeIndicator from "./network/NetworkTypeIndicator";
import NetworkTabs from "./network/NetworkTabs";
import OverviewTab from "./network/tabs/OverviewTab";
import SubnetTab from "./network/tabs/SubnetTab"; // Remove the { Subnet } import
import RouterTab from "./network/tabs/RouterTab";
import BinaryTab from "./network/tabs/BinaryTab";
import AdvancedInfo from "./network/AdvancedInfo";
import NetworkLegend from "./network/NetworkLegend";

// Define the Subnet interface locally to match what SubnetTab expects
interface Subnet {
  subnet: string;
  hosts: number;
  range: string;
  cidr: number;
  bits: number;
  notation: string;
}

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

  // Generate classes for size visualization with improved responsive breakpoints
  let sizeClass = "w-full";
  if (networkSizePercentage < 0.0001) {
    sizeClass = "w-px";
  } else if (networkSizePercentage < 0.001) {
    sizeClass = "w-1";
  } else if (networkSizePercentage < 0.01) {
    sizeClass = "w-2 sm:w-3";
  } else if (networkSizePercentage < 0.1) {
    sizeClass = "w-3 sm:w-4 md:w-5";
  } else if (networkSizePercentage < 1) {
    sizeClass = "w-6 sm:w-8 md:w-10";
  } else if (networkSizePercentage < 5) {
    sizeClass = "w-12 sm:w-16 md:w-20";
  } else if (networkSizePercentage < 10) {
    sizeClass = "w-20 sm:w-24 md:w-28";
  } else if (networkSizePercentage < 25) {
    sizeClass = "w-24 sm:w-32 md:w-36";
  } else if (networkSizePercentage < 50) {
    sizeClass = "w-1/2";
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
      const aggregateCidr = cidr - i;
      const aggregateShift = 32 - aggregateCidr;
      const aggregatePrefix =
        aggregateShift > 0
          ? (firstIPNum >> aggregateShift) << aggregateShift
          : 0;

      const aggregateIP = [
        (aggregatePrefix >> 24) & 255,
        (aggregatePrefix >> 16) & 255,
        (aggregatePrefix >> 8) & 255,
        aggregatePrefix & 255,
      ].join(".");

      supernettingInfo.push({
        network: `${aggregateIP}/${aggregateCidr}`,
        hosts: Math.pow(2, 32 - aggregateCidr),
      });
    }

    return {
      summarizable: `${summarizableIP}/${summarizableCidr}`,
      // supernetting: supernettingInfo, // Commenting out unused property
      supernettingInfo,
    };
  };

  const summarizableNetwork = getRouteSummarization();

  // Generate CIDR subnet blocks for this network
  const getSubnetTable = (): Subnet[] => {
    if (cidr >= 24) return []; // Return empty array instead of null

    const bitsToShow = Math.min(3, 24 - cidr);
    const subnetsToShow = Math.pow(2, bitsToShow);

    const subnets: Subnet[] = [];
    const subnetSize = netmask.size / Math.pow(2, bitsToShow);

    for (let i = 0; i < subnetsToShow; i++) {
      const subnetBase = firstIPNum + i * subnetSize;
      const subnetBaseIP = [
        (subnetBase >> 24) & 255,
        (subnetBase >> 16) & 255,
        (subnetBase >> 8) & 255,
        subnetBase & 255,
      ].join(".");

      const subnetCidr = cidr + bitsToShow;

      subnets.push({
        subnet: `${subnetBaseIP}/${subnetCidr}`,
        hosts: subnetSize,
        range: `${subnetBaseIP} - ${[
          ((subnetBase + subnetSize - 1) >> 24) & 255,
          ((subnetBase + subnetSize - 1) >> 16) & 255,
          ((subnetBase + subnetSize - 1) >> 8) & 255,
          (subnetBase + subnetSize - 1) & 255,
        ].join(".")}`,
        cidr: subnetCidr,
        bits: bitsToShow,
        notation: subnetBaseIP,
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

  // Create subnet breakdown with improved responsiveness
  const createSubnetBreakdown = () => {
    return (
      <div className="mt-2 sm:mt-3 md:mt-4 mb-2">
        <div className="text-xs sm:text-sm mb-1.5 sm:mb-2 text-gray-600 font-medium">
          Network Bits vs Host Bits:
        </div>
        <div className="flex flex-col space-y-1">
          {/* Binary representation with network/host bit separation */}
          <div className="font-mono text-[10px] xs:text-xs sm:text-sm flex items-center bg-gray-800 rounded p-0.5 sm:p-1 md:p-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <div className="flex ">
              {binaryIP.split(".").map((octet, octIndex) => (
                <div key={octIndex} className="flex whitespace-nowrap ">
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
                            ? "bg-blue-600 text-white border-blue-700"
                            : "bg-amber-500 text-gray-900 border-amber-600"
                        } px-0.5 sm:px-1 font-bold text-center transition-colors duration-200 border m-[0.5px] rounded-sm`}
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
          <div className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] flex justify-between text-gray-500">
            <span>bit 1</span>
            <span>bit 8</span>
            <span>bit 16</span>
            <span>bit 24</span>
            <span>bit 32</span>
          </div>

          {/* Octet markers */}
          <div className="flex justify-between text-[8px] xs:text-[9px] sm:text-[10px] text-gray-500 mt-0.5 sm:mt-1">
            <span>1st Octet</span>
            <span>2nd Octet</span>
            <span>3rd Octet</span>
            <span>4th Octet</span>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap justify-between mt-2 sm:mt-3 items-center gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-200">
              Network bits ({cidr})
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-500 rounded-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-200">
              Host bits ({32 - cidr})
            </span>
          </div>
        </div>

        {/* Prefix length slider visualization */}
        <div className="mt-2 sm:mt-3 h-1.5 sm:h-2 bg-gray-700 rounded-full relative">
          <div
            className="absolute h-full bg-blue-600 rounded-full"
            style={{ width: `${(cidr / 32) * 100}%` }}
          ></div>
          <div
            className="absolute h-3 w-3 sm:h-4 sm:w-4 bg-white border-2 border-blue-600 rounded-full top-1/2 transform -translate-y-1/2 shadow-md"
            style={{ left: `calc(${(cidr / 32) * 100}% - 6px)` }}
          ></div>
        </div>
        <div className="flex justify-between text-[8px] xs:text-[9px] sm:text-[10px] text-gray-400 mt-1">
          <span>/0</span>
          <span>/8</span>
          <span>/16</span>
          <span>/24</span>
          <span>/32</span>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4 sm:mt-6 md:mt-8 mb-6 sm:mb-8 rounded-lg shadow-lg bg-gray-900 text-white border border-gray-700 transition-all duration-300">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 rounded-t-lg border-b border-gray-700">
        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-y-2 w-full">
          <div className="flex items-center min-w-0 w-full xs:w-auto">
            <div className="w-1.5 xs:w-1.5 sm:w-2 h-3 xs:h-4 sm:h-5 -ml-0.5 xs:-ml-1 sm:-ml-2 bg-gradient-to-r from-blue-700 to-blue-900 shadow-sm border border-blue-700 opacity-90"></div>
            <h3 className="font-bold text-sm xs:text-base sm:text-lg md:text-xl font-mono ml-1.5 xs:ml-2 truncate">
              Network Analysis - {ip.join(".")}/{cidr}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 xs:gap-2 mt-1.5 xs:mt-0 xs:ml-auto self-end xs:self-auto">
            <span className="text-[9px] xs:text-[10px] sm:text-xs px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 sm:py-1.5 bg-blue-900 text-blue-200 rounded-md font-mono whitespace-nowrap border border-blue-700 transform hover:scale-105 transition-transform">
              {commonSize}
            </span>
            <button
              onClick={() => setShowAdvancedInfo(!showAdvancedInfo)}
              className="text-[9px] xs:text-[10px] sm:text-xs py-0.5 xs:py-1 px-1 xs:px-1.5 sm:px-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md border border-gray-600 transition-all duration-200 flex items-center hover:shadow-md active:bg-gray-500 touch-manipulation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 mr-0.5 xs:mr-0.5 sm:mr-1"
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
              <span className="whitespace-nowrap">
                {showAdvancedInfo ? "Hide" : "Show"} Advanced
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Terminal-style technical notations */}
      <TechnicalNotations
        ip={ip}
        cidr={cidr}
        binaryIP={binaryIP}
        hexIP={hexIP}
        netmask={netmask}
      />

      <NetworkTypeIndicator specialPurpose={specialPurpose} />

      {/* Network tabs */}
      <NetworkTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="p-2 xs:p-3 sm:p-4">
        {activeTab === "overview" && (
          <OverviewTab
            ip={ip}
            cidr={cidr}
            netmask={netmask}
            firstIPNum={firstIPNum}
            totalIPv4Space={totalIPv4Space}
            networkClass={networkClass}
            networkColors={networkColors}
            networkSizePercentage={networkSizePercentage}
            sizeClass={sizeClass}
            powerOfTwo={powerOfTwo}
            createSubnetBreakdown={createSubnetBreakdown}
            showAdvancedInfo={showAdvancedInfo}
            handleFieldCopy={handleFieldCopy}
          />
        )}

        {activeTab === "subnet" && <SubnetTab cidr={cidr} subnets={subnets} />}

        {activeTab === "router" && <RouterTab ip={ip} netmask={netmask} />}

        {activeTab === "binary" && (
          <BinaryTab
            netmask={netmask}
            createSubnetBreakdown={createSubnetBreakdown}
          />
        )}

        {showAdvancedInfo && (
          <AdvancedInfo
            summarizableNetwork={summarizableNetwork.summarizable}
            summarizableCidr={Math.max(0, cidr - 1)}
            netmask={netmask}
          />
        )}
      </div>

      <NetworkLegend networkColors={networkColors} />
    </div>
  );
}
