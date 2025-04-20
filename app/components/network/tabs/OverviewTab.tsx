import React from "react";
import { Netmask } from "netmask";

interface NetworkClass {
  class: string;
  range: string;
  defaultMask: string;
}

interface NetworkColors {
  octets: string[];
  classes: {
    a: { bg: string; text: string };
    b: { bg: string; text: string };
    c: { bg: string; text: string };
    small: { bg: string; text: string };
  };
}

interface OverviewTabProps {
  ip: number[]; // IP is used in the component
  cidr: number;
  netmask: Netmask;
  firstIPNum: number;
  totalIPv4Space: number;
  networkClass: NetworkClass;
  networkColors: NetworkColors;
  networkSizePercentage: number;
  sizeClass: string;
  powerOfTwo: string;
  createSubnetBreakdown: () => JSX.Element;
  showAdvancedInfo: boolean;
  handleFieldCopy: (value: string, fieldName: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  cidr,
  netmask,
  firstIPNum,
  totalIPv4Space,
  networkClass,
  networkColors,
  networkSizePercentage,
  sizeClass,
  powerOfTwo,
  createSubnetBreakdown,
  showAdvancedInfo,
  handleFieldCopy,
}) => {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="relative mb-1">
        <div className="absolute -top-3 left-1/2 h-3 w-px bg-blue-500"></div>
        <div className="absolute -top-3 left-3/4 h-3 w-px bg-blue-500"></div>
        <div className="absolute -top-3 left-[87.5%] h-3 w-px bg-blue-500"></div>
      </div>

      {/* Network visualization bar - improved height responsiveness */}
      <div className="h-10 sm:h-12 md:h-14 lg:h-16 w-full bg-gray-800 rounded-md relative overflow-hidden border border-gray-700 shadow-sm">
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
            handleFieldCopy(`${netmask.first} - ${netmask.last}`, "IP Range")
          }
        >
          {networkSizePercentage > 3 && (
            <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm text-white font-medium truncate px-2">
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

      {/* IP range labels - improved for mobile */}
      <div className="flex justify-between text-[10px] xs:text-xs text-gray-400 mt-1 overflow-x-auto pb-1">
        <span className="font-mono whitespace-nowrap">0.0.0.0</span>
        <span className="font-mono whitespace-nowrap">128.0.0.0</span>
        <span className="font-mono whitespace-nowrap">192.0.0.0</span>
        <span className="font-mono whitespace-nowrap">224.0.0.0</span>
        <span className="font-mono whitespace-nowrap">255.255.255.255</span>
      </div>

      {/* Network info grid - responsive layout improvements */}
      <div className="text-xs sm:text-sm mt-4 grid grid-cols-1 md:grid-cols-9 gap-3 md:gap-4">
        <div className="p-2 sm:p-3 md:p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-sm hover:shadow-md transition-shadow md:col-span-5">
          <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
            <h4 className="font-semibold text-sm sm:text-base">Network Size</h4>
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

        <div className="p-2 sm:p-3 md:p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-sm hover:shadow-md transition-shadow md:col-span-4">
          <h4 className="font-semibold mb-1 text-sm sm:text-base">
            Network Class
          </h4>
          <p className="text-gray-300">Class {networkClass.class}</p>
          <p className="text-gray-400 text-xs mt-1">
            Traditional range: {networkClass.range}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Default mask: {networkClass.defaultMask}
          </p>
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center flex-wrap gap-2">
                <span className="font-medium text-xs text-gray-300 w-20 sm:w-24">
                  Leading bits:
                </span>
                <div className="flex gap-0.5 flex-wrap">
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

              <div className="flex items-start sm:items-center flex-wrap sm:flex-nowrap">
                <span className="font-medium text-xs text-gray-300 w-20 sm:w-24 mt-1 sm:mt-0">
                  Usage:
                </span>
                <div className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300 w-full border border-gray-600">
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
                      <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-1.5"></span>
                      Multicast
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
                      Reserved addresses
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!showAdvancedInfo && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          Click "Show Advanced" above for more network details
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
