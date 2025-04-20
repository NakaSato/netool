import React, { useState } from "react";
import { Netmask } from "netmask";

interface SubnetDivisionProps {
  cidr: number;
  setCidr: (cidr: number) => void;
  netmask: Netmask;
}

export default function SubnetDivision({
  cidr,
  setCidr,
  netmask,
}: SubnetDivisionProps) {
  const [hoveredSubnet, setHoveredSubnet] = useState<number | null>(null);

  // Calculate subnet information
  const totalSubnets = Math.pow(2, 32 - cidr);
  const hostsPerSubnet = Math.max(netmask.size - 2, 0); // Usable hosts (-2 for network and broadcast)
  const displayCount = Math.min(8, Math.pow(2, Math.min(4, 32 - cidr)));

  // Calculate subnets to display based on current CIDR
  const subnetsToShow = Array.from({ length: displayCount }).map((_, i) => {
    // For smaller CIDRs, calculate the actual subnet address
    const baseIp = netmask.base.split(".");
    const step = netmask.size;
    const offset = i * step;

    // Calculate subnet address with proper overflow handling
    let ipIncrement = parseInt(baseIp[3]) + offset;
    let thirdOctet = parseInt(baseIp[2]);
    let secondOctet = parseInt(baseIp[1]);
    let firstOctet = parseInt(baseIp[0]);

    if (ipIncrement > 255) {
      thirdOctet += Math.floor(ipIncrement / 256);
      ipIncrement = ipIncrement % 256;

      if (thirdOctet > 255) {
        secondOctet += Math.floor(thirdOctet / 256);
        thirdOctet = thirdOctet % 256;

        if (secondOctet > 255) {
          firstOctet += Math.floor(secondOctet / 256);
          secondOctet = secondOctet % 256;
        }
      }
    }

    const subnetAddress = `${firstOctet}.${secondOctet}.${thirdOctet}.${ipIncrement}`;
    return {
      index: i,
      address: subnetAddress,
      mask: `/${cidr}`,
      hosts: hostsPerSubnet,
    };
  });

  return (
    <div className="mt-6 mb-8 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-700/80 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="w-1.5 xs:w-2 sm:w-2.5 h-8 xs:h-10 sm:h-12 -ml-1 xs:-ml-1.5 sm:-ml-2.5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-800 shadow-md border border-blue-400/70 rounded-r-md opacity-95 absolute -mt-2"></div>
      <h2 className="font-mono text-base sm:text-lg md:text-xl font-semibold mb-6 ml-3 flex items-center text-white">
        Subnet Division Visualizations
        <span className="ml-2 text-xs bg-gray-800/90 text-blue-100 rounded-full px-2.5 py-1 border border-gray-700/50 shadow-inner flex items-center">
          <span className="mr-1.5 h-2 w-2 bg-blue-400 rounded-full animate-pulse"></span>
          {totalSubnets.toLocaleString()} subnets
        </span>
      </h2>

      <div className="relative bg-gradient-to-r from-gray-800 via-gray-850 to-gray-900 p-4 border border-gray-700 rounded-lg overflow-hidden mb-4 shadow-inner">
        <div className="h-20 sm:h-28 md:h-36 bg-gray-900/70 backdrop-blur-sm rounded-lg flex items-center justify-center relative overflow-hidden shadow-inner border border-gray-700/80">
          {subnetsToShow.map((subnet, i) => (
            <div
              key={`subnet-div-${i}`}
              className={`h-full ${
                i % 2 === 0 ? "bg-blue-900/30" : "bg-emerald-900/30"
              } border-r border-gray-700/80 flex items-center justify-center hover:bg-opacity-40 hover:scale-[1.01] transition-all duration-200 cursor-pointer relative`}
              style={{
                width: `${100 / displayCount}%`,
              }}
              onMouseEnter={() => setHoveredSubnet(i)}
              onMouseLeave={() => setHoveredSubnet(null)}
            >
              <span className="text-xs sm:text-sm font-mono text-gray-300 drop-shadow-md">
                {netmask.size > 4 ? "Subnet" : "Host"} {i + 1}
              </span>

              {hoveredSubnet === i && (
                <div className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 bg-gray-800 p-3 rounded shadow-lg text-xs z-10 w-max border border-gray-600 text-gray-200">
                  <div className="font-semibold text-blue-300">
                    Subnet {i + 1}
                  </div>
                  <div className="mt-1 font-mono">
                    Address: {subnet.address}
                    <span className="text-blue-400">{subnet.mask}</span>
                  </div>
                  <div className="mt-0.5">
                    Usable hosts:{" "}
                    <span className="text-emerald-400">
                      {hostsPerSubnet.toLocaleString()}
                    </span>{" "}
                    usable hosts
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-xs sm:text-sm text-gray-300 mt-4 bg-gray-800/70 p-3 rounded border border-gray-700/80">
          {cidr >= 30 ? (
            <p>
              This subnet has {netmask.size} addresses total with{" "}
              {hostsPerSubnet} usable hosts.
            </p>
          ) : cidr >= 24 ? (
            <p>
              This network can be divided into{" "}
              {Math.pow(2, 32 - cidr).toLocaleString()} subnets (
              {Math.pow(2, 24 - cidr).toLocaleString()} Class C (/24) subnets).
            </p>
          ) : cidr >= 16 ? (
            <p>
              This network can be divided into{" "}
              {Math.pow(2, 32 - cidr).toLocaleString()} subnets (
              {Math.pow(2, 16 - cidr).toLocaleString()} Class B (/16) subnets).
            </p>
          ) : (
            <p>
              This network can be divided into{" "}
              {Math.pow(2, 32 - cidr).toLocaleString()} subnets (
              {Math.pow(2, 8 - cidr).toLocaleString()} Class A (/8) subnets).
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">
          <h5 className="text-sm font-semibold mb-3 flex items-center text-gray-200">
            <span className="h-3 w-3 bg-blue-500 rounded-full mr-2"></span>
            Subnet by adding bits:
            <span className="ml-auto text-xs bg-gray-700 px-2 py-0.5 rounded-full text-blue-300 border border-gray-600/80">
              Smaller networks
            </span>
          </h5>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 8].map(
              (bits) =>
                cidr + bits <= 32 && (
                  <button
                    key={`add-${bits}`}
                    onClick={() => setCidr(cidr + bits)}
                    className="px-3 py-1.5 bg-blue-900/50 hover:bg-blue-800/60 text-blue-300 border border-blue-700/50 rounded text-xs transition-all duration-200 flex items-center shadow-md hover:shadow-lg font-mono hover:scale-105"
                    title={`Create ${Math.pow(
                      2,
                      bits
                    ).toLocaleString()} subnets from current network`}
                  >
                    +{bits} bit{bits > 1 ? "s" : ""} (/{cidr + bits})
                    <span className="ml-1.5 bg-blue-700/50 text-blue-200 text-xs px-1.5 py-0.5 rounded">
                      {bits <= 4 && `×${Math.pow(2, bits)}`}
                    </span>
                  </button>
                )
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">
          <h5 className="text-sm font-semibold mb-3 flex items-center text-gray-200">
            <span className="h-3 w-3 bg-emerald-500 rounded-full mr-2"></span>
            Supernet by removing bits:
            <span className="ml-auto text-xs bg-gray-700 px-2 py-0.5 rounded-full text-emerald-300 border border-gray-600/80">
              Larger networks
            </span>
          </h5>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 8].map(
              (bits) =>
                cidr - bits >= 0 && (
                  <button
                    key={`remove-${bits}`}
                    onClick={() => setCidr(cidr - bits)}
                    className="px-3 py-1.5 bg-emerald-900/50 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-700/50 rounded text-xs transition-all duration-200 flex items-center shadow-md hover:shadow-lg font-mono hover:scale-105"
                    title={`Combine with ${
                      Math.pow(2, bits) - 1
                    } other networks`}
                  >
                    -{bits} bit{bits > 1 ? "s" : ""} (/{cidr - bits})
                    <span className="ml-1.5 bg-emerald-700/50 text-emerald-200 text-xs px-1.5 py-0.5 rounded">
                      ×{Math.pow(2, bits)}
                    </span>
                  </button>
                )
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 bg-gray-800/80 border border-gray-700/80 rounded-lg p-3 text-xs text-gray-300 shadow-md">
        <details>
          <summary className="cursor-pointer font-medium text-gray-200 hover:text-blue-300 transition-colors">
            What are subnets?
          </summary>
          <p className="mt-2 bg-gray-900/60 p-3 rounded border border-gray-700/60">
            Subnetting divides a large network into smaller, more manageable
            segments. Each subnet is a distinct broadcast domain that can have
            its own access control and routing policies. Adding bits to the
            subnet mask creates more, smaller networks, while removing bits
            combines networks into larger ones (supernetting).
          </p>
        </details>
      </div>
    </div>
  );
}
