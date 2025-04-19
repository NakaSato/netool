import React from "react";
import { Netmask } from "netmask";

interface RouterTabProps {
  ip: number[];
  netmask: Netmask;
}

const RouterTab: React.FC<RouterTabProps> = ({ ip, netmask }) => {
  return (
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
          <p className="mb-1 text-gray-300">Router Access Control List:</p>
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
          <p className="mb-1 text-gray-300">OSPF Configuration (Area 0):</p>
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
  );
};

export default RouterTab;
