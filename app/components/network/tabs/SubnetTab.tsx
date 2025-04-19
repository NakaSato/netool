import React from "react";

// Define a specific type for subnets
interface Subnet {
  cidr: number;
  hosts: number;
  bits: number;
  notation: string;
  subnet: string; // Add subnet property for network address
  range: string; // Add range property for IP range
}

interface SubnetTabProps {
  cidr: number;
  subnets: Subnet[]; // Replace 'any' with proper type
}

const SubnetTab: React.FC<SubnetTabProps> = ({ cidr, subnets }) => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-2 sm:p-3 transition-all duration-200 hover:border-gray-600">
      <h5 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-blue-300 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Subnet Design Options
      </h5>

      <div className="text-[10px] xs:text-xs">
        <div className="mb-1.5 sm:mb-2">
          <p className="text-gray-300">Common subnet division options:</p>
        </div>
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="min-w-full text-[10px] xs:text-xs border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-1.5 sm:px-2 py-1 text-left border border-gray-600 text-gray-300">
                  Add Bits
                </th>
                <th className="px-1.5 sm:px-2 py-1 text-left border border-gray-600 text-gray-300">
                  New Prefix
                </th>
                <th className="px-1.5 sm:px-2 py-1 text-left border border-gray-600 text-gray-300">
                  # of Subnets
                </th>
                <th className="px-1.5 sm:px-2 py-1 text-left border border-gray-600 text-gray-300">
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
                      <td className="px-1.5 sm:px-2 py-1 border border-gray-600 text-gray-300">
                        +{bits}
                      </td>
                      <td className="px-1.5 sm:px-2 py-1 border border-gray-600 text-blue-300 font-mono">
                        /{cidr + bits}
                      </td>
                      <td className="px-1.5 sm:px-2 py-1 border border-gray-600 text-green-300">
                        {Math.pow(2, bits).toLocaleString()}
                      </td>
                      <td className="px-1.5 sm:px-2 py-1 border border-gray-600 text-amber-300">
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

        {subnets && subnets.length > 0 && (
          <>
            <h5 className="text-xs font-semibold mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-blue-300">
              Sample Subnet Breakdown (first {subnets.length} of{" "}
              {Math.pow(2, 24 - cidr)})
            </h5>

            <div className="overflow-x-auto -mx-2 px-2">
              <table className="min-w-full text-[10px] xs:text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-1.5 sm:px-2 py-1 text-left border border-gray-600 text-gray-300">
                      Subnet
                    </th>
                    <th className="px-1.5 sm:px-2 py-1 text-left border border-gray-600 text-gray-300">
                      IP Range
                    </th>
                    <th className="px-1.5 sm:px-2 py-1 text-right border border-gray-600 text-gray-300">
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
                      <td
                        className="px-1.5 sm:px-2 py-1 border border-gray-600 font-mono text-blue-300 truncate max-w-[100px] sm:max-w-none"
                        title={subnet.subnet}
                      >
                        {subnet.subnet}
                      </td>
                      <td
                        className="px-1.5 sm:px-2 py-1 border border-gray-600 font-mono text-gray-300 truncate max-w-[120px] sm:max-w-none"
                        title={subnet.range}
                      >
                        {subnet.range}
                      </td>
                      <td className="px-1.5 sm:px-2 py-1 text-right border border-gray-600 text-amber-300">
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
  );
};

export default SubnetTab;
