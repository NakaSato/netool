import React, { useState } from "react";
import { Netmask } from "netmask";

interface SubnetDivisionProps {
  cidr: number;
  setCidr: (val: number) => void;
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

    // Very basic way to calculate subnet address - would need improvement for full accuracy
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
    <div className="mt-6 mb-8 p-4 sm:p-6 md:p-8 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h4 className="font-medium text-base sm:text-lg mb-4 flex items-center">
        Subnet Division Visualization
        <span className="ml-2 text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
          {totalSubnets.toLocaleString()} subnets
        </span>
      </h4>

      <div className="relative bg-gray-50 p-4 border border-gray-200 rounded-lg overflow-hidden mb-3">
        <div className="h-20 sm:h-24 md:h-32 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          {subnetsToShow.map((subnet, i) => (
            <div
              key={`subnet-div-${i}`}
              className={`h-full ${
                i % 2 === 0 ? "bg-blue-100/80" : "bg-green-100/80"
              } border-r border-gray-300 flex items-center justify-center hover:brightness-90 transition-all duration-200 cursor-pointer relative`}
              style={{
                width: `${100 / displayCount}%`,
              }}
              onMouseEnter={() => setHoveredSubnet(i)}
              onMouseLeave={() => setHoveredSubnet(null)}
            >
              <span className="text-xs sm:text-sm font-mono text-gray-700">
                {netmask.size > 4 ? "Subnet" : "Host"} {i + 1}
              </span>

              {hoveredSubnet === i && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg text-xs z-10 w-max">
                  <div className="font-semibold">Subnet {i + 1}</div>
                  <div>
                    Address: {subnet.address}
                    {subnet.mask}
                  </div>
                  <div>Usable hosts: {subnet.hosts}</div>
                </div>
              )}
            </div>
          ))}

          {totalSubnets > displayCount && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px] text-gray-700 font-medium">
              <div className="text-center">
                <p className="text-sm">
                  Showing {displayCount} of {totalSubnets.toLocaleString()}{" "}
                  subnets
                </p>
                <p className="text-xs mt-1 opacity-75">
                  Each subnet has {hostsPerSubnet.toLocaleString()} usable hosts
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs sm:text-sm text-gray-600 mt-3">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <h5 className="text-sm font-semibold mb-3 flex items-center">
            Subnet by adding bits:
            <span className="ml-auto text-xs text-gray-500">
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
                    className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-xs transition-colors duration-200 flex items-center"
                    title={`Create ${Math.pow(
                      2,
                      bits
                    ).toLocaleString()} subnets from current network`}
                  >
                    +{bits} bit{bits > 1 ? "s" : ""} (/{cidr + bits})
                    <span className="ml-1 text-blue-500/70 text-xs">
                      {bits <= 4 && `×${Math.pow(2, bits)}`}
                    </span>
                  </button>
                )
            )}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <h5 className="text-sm font-semibold mb-3 flex items-center">
            Supernet by removing bits:
            <span className="ml-auto text-xs text-gray-500">
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
                    className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-800 rounded text-xs transition-colors duration-200 flex items-center"
                    title={`Combine with ${
                      Math.pow(2, bits) - 1
                    } other networks`}
                  >
                    -{bits} bit{bits > 1 ? "s" : ""} (/{cidr - bits})
                    <span className="ml-1 text-green-500/70 text-xs">
                      {bits <= 4 && `×${Math.pow(2, bits)}`}
                    </span>
                  </button>
                )
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
        <details>
          <summary className="cursor-pointer font-medium">
            What are subnets?
          </summary>
          <p className="mt-2">
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
