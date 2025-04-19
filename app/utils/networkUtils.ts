/**
 * Get information about the network class based on IP address
 */
export const getNetworkClass = (ip: number[]) => {
  const firstOctet = ip[0];
  if (firstOctet < 128)
    return {
      class: "A",
      range: "0.0.0.0 - 127.255.255.255",
      defaultMask: "/8",
    };
  if (firstOctet < 192)
    return {
      class: "B",
      range: "128.0.0.0 - 191.255.255.255",
      defaultMask: "/16",
    };
  if (firstOctet < 224)
    return {
      class: "C",
      range: "192.0.0.0 - 223.255.255.255",
      defaultMask: "/24",
    };
  if (firstOctet < 240)
    return {
      class: "D (Multicast)",
      range: "224.0.0.0 - 239.255.255.255",
      defaultMask: "N/A",
    };
  return {
    class: "E (Reserved)",
    range: "240.0.0.0 - 255.255.255.255",
    defaultMask: "N/A",
  };
};

/**
 * Get common network size description based on CIDR
 */
export const getCommonNetworkSize = (cidr: number) => {
  if (cidr === 32) return "Single Host";
  if (cidr === 31) return "Point-to-Point Link";
  if (cidr === 30) return "Minimum Subnet (2 hosts)";
  if (cidr === 29) return "Small Subnet (6 hosts)";
  if (cidr === 28) return "Small Subnet (14 hosts)";
  if (cidr === 27) return "Small Subnet (30 hosts)";
  if (cidr === 24) return "Class C Subnet (254 hosts)";
  if (cidr === 16) return "Class B Network (65,534 hosts)";
  if (cidr === 8) return "Class A Network (16,777,214 hosts)";
  if (cidr <= 8) return "Very Large Network";
  if (cidr <= 16) return "Large Network";
  if (cidr <= 24) return "Medium Network";
  return "Small Network";
};

/**
 * Calculate power of 2 for CIDR (to help users understand the size)
 */
export const getExactPowerOfTwo = (cidr: number) => {
  const prefix = 32 - cidr;
  return `2^${prefix} = ${Math.pow(2, prefix).toLocaleString()}`;
};

/**
 * Calculate Wildcard mask (inverse of Subnet mask)
 */
export const calculateWildcardMask = (subnetMask: string): string => {
  return subnetMask
    .split(".")
    .map((octet) => 255 - parseInt(octet))
    .join(".");
};
