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
    <div className="mt-6 mb-8 p-4 sm:p-6 md:p-8 bg-slate-900 rounded-lg border border-cyan-800/30 shadow-md hover:shadow-lg transition-shadow duration-300">
      <h4 className="font-medium text-base sm:text-lg mb-4 flex items-center text-cyan-100">
        <div className="w-2 h-5 bg-cyan-400 mr-3 rounded-sm"></div>
        Subnet Division Visualization
        <span className="ml-2 text-xs text-cyan-300 bg-cyan-900/50 rounded-full px-2 py-0.5 border border-cyan-800/50">
          {totalSubnets.toLocaleString()} subnets
        </span>
      </h4>

      <div className="relative bg-slate-800 p-4 border border-cyan-800/40 rounded-lg overflow-hidden mb-3 backdrop-blur-sm">
        {/* Grid background for technical look */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        <div className="h-20 sm:h-24 md:h-32 bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden">
          {subnetsToShow.map((subnet, i) => (
            <div
              key={`subnet-div-${i}`}
              className={`h-full ${
                i % 2 === 0 ? "bg-cyan-900/80" : "bg-emerald-900/80"
              } border-r border-cyan-700/50 flex items-center justify-center hover:brightness-125 transition-all duration-200 cursor-pointer relative`}
              style={{
                width: `${100 / displayCount}%`,
              }}
              onMouseEnter={() => setHoveredSubnet(i)}
              onMouseLeave={() => setHoveredSubnet(null)}
            >
              <span className="text-xs sm:text-sm font-mono text-cyan-100 drop-shadow-sm">
                {netmask.size > 4 ? "Subnet" : "Host"} {i + 1}
              </span>

              {hoveredSubnet === i && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-slate-700 p-3 rounded shadow-lg text-xs z-10 w-max border border-cyan-700/50">
                  <div className="font-semibold text-cyan-200">
                    Subnet {i + 1}
                  </div>
                  <div className="text-cyan-100 font-mono">
                    Address: {subnet.address}
                    <span className="text-emerald-300">{subnet.mask}</span>
                  </div>
                  <div className="text-slate-300">
                    Usable hosts:{" "}
                    <span className="text-emerald-300 font-mono">
                      {subnet.hosts}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {totalSubnets > displayCount && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] text-cyan-100 font-medium">
              <div className="text-center bg-slate-800/80 p-3 rounded-lg border border-cyan-800/50">
                <p className="text-sm">
                  Showing{" "}
                  <span className="text-emerald-300">{displayCount}</span> of{" "}
                  <span className="text-emerald-300">
                    {totalSubnets.toLocaleString()}
                  </span>{" "}
                  subnets
                </p>
                <p className="text-xs mt-1 text-slate-300">
                  Each subnet has{" "}
                  <span className="text-emerald-300 font-mono">
                    {hostsPerSubnet.toLocaleString()}
                  </span>{" "}
                  usable hosts
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs sm:text-sm text-cyan-200 mt-3 font-mono">
          {cidr >= 30 ? (
            <p>
              This subnet has{" "}
              <span className="text-emerald-300">{netmask.size}</span> addresses
              total with{" "}
              <span className="text-emerald-300">{hostsPerSubnet}</span> usable
              hosts.
            </p>
          ) : cidr >= 24 ? (
            <p>
              This network can be divided into{" "}
              <span className="text-emerald-300">
                {Math.pow(2, 32 - cidr).toLocaleString()}
              </span>{" "}
              subnets (
              <span className="text-emerald-300">
                {Math.pow(2, 24 - cidr).toLocaleString()}
              </span>{" "}
              Class C /24 subnets).
            </p>
          ) : cidr >= 16 ? (
            <p>
              This network can be divided into{" "}
              <span className="text-emerald-300">
                {Math.pow(2, 32 - cidr).toLocaleString()}
              </span>{" "}
              subnets (
              <span className="text-emerald-300">
                {Math.pow(2, 16 - cidr).toLocaleString()}
              </span>{" "}
              Class B /16 subnets).
            </p>
          ) : (
            <p>
              This network can be divided into{" "}
              <span className="text-emerald-300">
                {Math.pow(2, 32 - cidr).toLocaleString()}
              </span>{" "}
              subnets (
              <span className="text-emerald-300">
                {Math.pow(2, 8 - cidr).toLocaleString()}
              </span>{" "}
              Class A /8 subnets).
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
        <div className="bg-slate-800 p-3 rounded-lg border border-cyan-800/40 relative overflow-hidden">
          {/* Network grid pattern for technical look */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:15px_15px]"></div>

          <h5 className="text-sm font-semibold mb-3 flex items-center text-cyan-100 relative">
            Subnet by adding bits:
            <span className="ml-auto text-xs text-cyan-300">
              Smaller networks
            </span>
          </h5>
          <div className="flex gap-2 flex-wrap relative">
            {[1, 2, 3, 4, 8].map(
              (bits) =>
                cidr + bits <= 32 && (
                  <button
                    key={`add-${bits}`}
                    onClick={() => setCidr(cidr + bits)}
                    className="px-3 py-1.5 bg-cyan-900 hover:bg-cyan-800 text-cyan-100 rounded text-xs transition-colors duration-200 flex items-center border border-cyan-700/50 shadow-sm hover:shadow"
                    title={`Create ${Math.pow(
                      2,
                      bits
                    ).toLocaleString()} subnets from current network`}
                  >
                    +{bits} bit{bits > 1 ? "s" : ""} (/{cidr + bits})
                    <span className="ml-1 text-emerald-300 text-xs">
                      {bits <= 4 && `×${Math.pow(2, bits)}`}
                    </span>
                  </button>
                )
            )}
          </div>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg border border-cyan-800/40 relative overflow-hidden">
          {/* Network grid pattern for technical look */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:15px_15px]"></div>

          <h5 className="text-sm font-semibold mb-3 flex items-center text-cyan-100 relative">
            Supernet by removing bits:
            <span className="ml-auto text-xs text-cyan-300">
              Larger networks
            </span>
          </h5>
          <div className="flex gap-2 flex-wrap relative">
            {[1, 2, 3, 4, 8].map(
              (bits) =>
                cidr - bits >= 0 && (
                  <button
                    key={`remove-${bits}`}
                    onClick={() => setCidr(cidr - bits)}
                    className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 rounded text-xs transition-colors duration-200 flex items-center border border-emerald-700/50 shadow-sm hover:shadow"
                    title={`Combine with ${
                      Math.pow(2, bits) - 1
                    } other networks`}
                  >
                    -{bits} bit{bits > 1 ? "s" : ""} (/{cidr - bits})
                    <span className="ml-1 text-cyan-300 text-xs">
                      {bits <= 4 && `×${Math.pow(2, bits)}`}
                    </span>
                  </button>
                )
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 bg-slate-800 border border-cyan-800/40 rounded-lg p-3 text-xs text-slate-300 relative overflow-hidden">
        {/* Network grid pattern for technical look */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:15px_15px]"></div>

        <details className="relative">
          <summary className="cursor-pointer font-medium text-cyan-100">
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
