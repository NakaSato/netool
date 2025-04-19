import React from "react";
import { Netmask } from "netmask";

interface RouterTabProps {
  ip: number[];
  netmask: Netmask;
}

const RouterTab: React.FC<RouterTabProps> = ({ ip, netmask }) => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-2 sm:p-3 transition-all hover:border-gray-600">
      <h5 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-blue-300 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1"
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

      <div className="text-[10px] xs:text-xs space-y-3 sm:space-y-4">
        <div>
          <p className="mb-1 text-gray-300">Cisco IOS Route Entry:</p>
          <div className="font-mono bg-black text-green-400 p-1.5 sm:p-2 md:p-3 rounded mb-1 sm:mb-2 border border-gray-700 overflow-x-auto whitespace-nowrap">
            ip route {netmask.base} {netmask.mask} [next-hop-ip]
          </div>
        </div>

        <div>
          <p className="mb-1 text-gray-300">Router Access Control List:</p>
          <div className="font-mono bg-black text-green-400 p-1.5 sm:p-2 md:p-3 rounded mb-1 sm:mb-2 border border-gray-700 overflow-x-auto whitespace-nowrap">
            permit ip {netmask.base} {netmask.mask} any
          </div>
        </div>

        <div>
          <p className="mb-1 text-gray-300">BGP Route Advertisement:</p>
          <div className="font-mono bg-black text-green-400 p-1.5 sm:p-2 md:p-3 rounded mb-1 sm:mb-2 border border-gray-700 overflow-x-auto whitespace-nowrap">
            network {netmask.base} mask {netmask.mask}
          </div>
        </div>

        <div>
          <p className="mb-1 text-gray-300">OSPF Configuration (Area 0):</p>
          <div className="font-mono bg-black text-green-400 p-1.5 sm:p-2 md:p-3 rounded mb-1 sm:mb-2 border border-gray-700 overflow-x-auto whitespace-pre-wrap text-[9px] xs:text-[10px] sm:text-xs">
            {`interface GigabitEthernet0/0
 ip address ${ip.join(".")} ${netmask.mask}
!
router ospf 1
 network ${netmask.base} ${netmask.hostmask} area 0`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouterTab;
