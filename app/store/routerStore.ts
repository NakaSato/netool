import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
  RouterConfig,
  NetworkInterface,
  DHCPConfig,
  RouterVendor,
  FirewallRule,
  PortForwardingRule,
  NATConfig,
  VPNConfig,
  QoSConfig,
} from "../types/routerTypes";

interface RouterStore {
  // State
  configurations: RouterConfig[];
  activeConfigId: string | null;

  // Actions - Router Management
  createConfiguration: (name: string, vendor: RouterVendor) => RouterConfig;
  duplicateConfiguration: (id: string) => void;
  updateConfiguration: (id: string, updates: Partial<RouterConfig>) => void;
  deleteConfiguration: (id: string) => void;
  setActiveConfiguration: (id: string) => void;

  // Actions - Interface Management
  addInterface: (configId: string, interfaceData: NetworkInterface) => void;
  updateInterface: (
    configId: string,
    interfaceName: string,
    updates: Partial<NetworkInterface>
  ) => void;
  deleteInterface: (configId: string, interfaceName: string) => void;

  // Actions - DHCP Management
  updateDHCPConfig: (configId: string, updates: Partial<DHCPConfig>) => void;

  // Actions - Firewall Rules
  addFirewallRule: (configId: string, rule: FirewallRule) => void;
  updateFirewallRule: (
    configId: string,
    ruleId: string,
    updates: Partial<FirewallRule>
  ) => void;
  deleteFirewallRule: (configId: string, ruleId: string) => void;
  reorderFirewallRules: (configId: string, orderedIds: string[]) => void;

  // Actions - Port Forwarding
  addPortForwardingRule: (configId: string, rule: PortForwardingRule) => void;
  updatePortForwardingRule: (
    configId: string,
    ruleId: string,
    updates: Partial<PortForwardingRule>
  ) => void;
  deletePortForwardingRule: (configId: string, ruleId: string) => void;

  // Actions - NAT Configuration
  updateNATConfig: (configId: string, updates: Partial<NATConfig>) => void;

  // Actions - VPN Configuration
  updateVPNConfig: (configId: string, updates: Partial<VPNConfig>) => void;

  // Actions - QoS Configuration
  updateQoSConfig: (configId: string, updates: Partial<QoSConfig>) => void;

  // Utility functions
  getActiveConfiguration: () => RouterConfig | null;
  exportConfiguration: (id: string) => string;
  importConfiguration: (configStr: string) => boolean;
}

// Create default configurations for a new router setup
const createDefaultConfig = (
  name: string,
  vendor: RouterVendor
): RouterConfig => {
  // Create a unique ID for the configuration
  const id = uuidv4();

  // Create a default hostname based on the vendor and name
  const hostname = `${vendor}-router-${name
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  // Current timestamp
  const now = new Date();

  // Default WAN interface
  const wanInterface: NetworkInterface = {
    name: "WAN",
    type: "wan",
    enabled: true,
    description: "Internet Connection",
    isWan: true,
  };

  // Default LAN interface
  const lanInterface: NetworkInterface = {
    name: "LAN",
    type: "lan",
    ipAddress: "192.168.1.1",
    subnetMask: "255.255.255.0",
    enabled: true,
    description: "Local Area Network",
    isWan: false,
  };

  // Default DHCP configuration
  const dhcpServer: DHCPConfig = {
    enabled: true,
    poolName: "LAN_POOL",
    networkAddress: "192.168.1.0",
    subnetMask: "255.255.255.0",
    defaultGateway: "192.168.1.1",
    dnsServers: ["8.8.8.8", "8.8.4.4"],
    leaseTime: 7, // 7 days
    startIp: "192.168.1.100",
    endIp: "192.168.1.254",
  };

  // Default NAT configuration
  const natConfig: NATConfig = {
    enabled: true,
    type: "pat", // Port Address Translation
    insideInterfaces: ["LAN"],
    outsideInterfaces: ["WAN"],
  };

  // Default VPN configuration
  const vpnConfig: VPNConfig = {
    enabled: false,
    type: "ipsec",
    authentication: "psk",
    localNetworks: ["192.168.1.0/24"],
    remoteNetworks: [],
  };

  // Default QoS configuration
  const qosConfig: QoSConfig = {
    enabled: false,
    policies: [],
  };

  // Return the complete configuration
  return {
    id,
    name,
    vendor,
    hostname,
    interfaces: [wanInterface, lanInterface],
    dhcpServer,
    natConfig,
    firewallRules: [],
    portForwarding: [],
    vpnConfig,
    qosConfig,
    lastUpdated: now,
  };
};

// Create the store
export const useRouterStore = create<RouterStore>()(
  persist(
    (set, get) => ({
      // Initial state
      configurations: [],
      activeConfigId: null,

      // Router management actions
      createConfiguration: (name, vendor) => {
        const newConfig = createDefaultConfig(name, vendor);
        set((state) => ({
          configurations: [...state.configurations, newConfig],
          activeConfigId: newConfig.id,
        }));
        return newConfig;
      },

      duplicateConfiguration: (id) => {
        const config = get().configurations.find((c) => c.id === id);
        if (!config) return;

        const duplicate = {
          ...config,
          id: uuidv4(),
          name: `${config.name} (Copy)`,
          hostname: `${config.hostname}-copy`,
          lastUpdated: new Date(),
        };

        set((state) => ({
          configurations: [...state.configurations, duplicate],
        }));
      },

      updateConfiguration: (id, updates) => {
        set((state) => ({
          configurations: state.configurations.map((config) =>
            config.id === id
              ? { ...config, ...updates, lastUpdated: new Date() }
              : config
          ),
        }));
      },

      deleteConfiguration: (id) => {
        set((state) => ({
          configurations: state.configurations.filter(
            (config) => config.id !== id
          ),
          activeConfigId:
            state.activeConfigId === id ? null : state.activeConfigId,
        }));
      },

      setActiveConfiguration: (id) => {
        set({ activeConfigId: id });
      },

      // Interface management
      addInterface: (configId, interfaceData) => {
        set((state) => ({
          configurations: state.configurations.map((config) =>
            config.id === configId
              ? {
                  ...config,
                  interfaces: [...config.interfaces, interfaceData],
                  lastUpdated: new Date(),
                }
              : config
          ),
        }));
      },

      updateInterface: (configId, interfaceName, updates) => {
        set((state) => ({
          configurations: state.configurations.map((config) => {
            if (config.id !== configId) return config;

            return {
              ...config,
              interfaces: config.interfaces.map((intf) =>
                intf.name === interfaceName ? { ...intf, ...updates } : intf
              ),
              lastUpdated: new Date(),
            };
          }),
        }));
      },

      deleteInterface: (configId, interfaceName) => {
        set((state) => ({
          configurations: state.configurations.map((config) => {
            if (config.id !== configId) return config;

            return {
              ...config,
              interfaces: config.interfaces.filter(
                (intf) => intf.name !== interfaceName
              ),
              lastUpdated: new Date(),
            };
          }),
        }));
      },

      // DHCP configuration
      updateDHCPConfig: (configId, updates) => {
        set((state) => ({
          configurations: state.configurations.map((config) =>
            config.id === configId
              ? {
                  ...config,
                  dhcpServer: { ...config.dhcpServer, ...updates },
                  lastUpdated: new Date(),
                }
              : config
          ),
        }));
      },

      // Firewall rules
      addFirewallRule: (configId, rule) => {
        set((state) => ({
          configurations: state.configurations.map((config) =>
            config.id === configId
              ? {
                  ...config,
                  firewallRules: [...config.firewallRules, rule],
                  lastUpdated: new Date(),
                }
              : config
          ),
        }));
      },

      updateFirewallRule: (configId, ruleId, updates) => {
        set((state) => ({
          configurations: state.configurations.map((config) => {
            if (config.id !== configId) return config;

            return {
              ...config,
              firewallRules: config.firewallRules.map((rule) =>
                rule.id === ruleId ? { ...rule, ...updates } : rule
              ),
              lastUpdated: new Date(),
            };
          }),
        }));
      },

      deleteFirewallRule: (configId, ruleId) => {
        set((state) => ({
          configurations: state.configurations.map((config) => {
            if (config.id !== configId) return config;

            return {
              ...config,
              firewallRules: config.firewallRules.filter(
                (rule) => rule.id !== ruleId
              ),
              lastUpdated: new Date(),
            };
          }),
        }));
      },

      reorderFirewallRules: (configId, orderedIds) => {
        set((state) => ({
          configurations: state.configurations.map((config) => {
            if (config.id !== configId) return config;

            // Create a map of rule IDs to rules
            const rulesMap = config.firewallRules.reduce((acc, rule) => {
              acc[rule.id] = rule;
              return acc;
            }, {} as Record<string, FirewallRule>);

            // Reorder rules based on the ordered IDs
            const reorderedRules = orderedIds
              .filter((id) => rulesMap[id]) // Filter out any IDs that don't exist
              .map((id) => rulesMap[id]);

            return {
              ...config,
              firewallRules: reorderedRules,
              lastUpdated: new Date(),
            };
          }),
        }));
      },

      // Port forwarding
      addPortForwardingRule: (configId, rule) => {
        set((state) => ({
          configurations: state.configurations.map((config) =>
            config.id === configId
              ? {
                  ...config,
                  portForwarding: [...config.portForwarding, rule],
                  lastUpdated: new Date(),
                }
              : config
          ),
        }));
      },

      updatePortForwardingRule: (configId, ruleId, updates) => {
        set((state) => ({
          configurations: state.configurations.map((config) => {
            if (config.id !== configId) return config;

            return {
              ...config,
              portForwarding: config.portForwarding.map((rule) =>
                rule.id === ruleId ? { ...rule, ...updates } : rule
              ),
              lastUpdated: new Date(),
            };
          }),
        }));
      },

      deletePortForwardingRule: (configId, ruleId) => {
        set((state) => ({
          configurations: state.configurations.map((config) => {
            if (config.id !== configId) return config;

            return {
              ...config,
              portForwarding: config.portForwarding.filter(
                (rule) => rule.id !== ruleId
              ),
              lastUpdated: new Date(),
            };
          }),
        }));
      },

      // NAT Configuration
      updateNATConfig: (configId, updates) => {
        set((state) => ({
          configurations: state.configurations.map((config) =>
            config.id === configId
              ? {
                  ...config,
                  natConfig: { ...config.natConfig, ...updates },
                  lastUpdated: new Date(),
                }
              : config
          ),
        }));
      },

      // VPN Configuration
      updateVPNConfig: (configId, updates) => {
        set((state) => ({
          configurations: state.configurations.map((config) =>
            config.id === configId
              ? {
                  ...config,
                  vpnConfig: { ...config.vpnConfig, ...updates },
                  lastUpdated: new Date(),
                }
              : config
          ),
        }));
      },

      // QoS Configuration
      updateQoSConfig: (configId, updates) => {
        set((state) => ({
          configurations: state.configurations.map((config) =>
            config.id === configId
              ? {
                  ...config,
                  qosConfig: { ...config.qosConfig, ...updates },
                  lastUpdated: new Date(),
                }
              : config
          ),
        }));
      },

      // Utility functions
      getActiveConfiguration: () => {
        const { configurations, activeConfigId } = get();
        if (!activeConfigId) return null;
        return (
          configurations.find((config) => config.id === activeConfigId) || null
        );
      },

      exportConfiguration: (id) => {
        const config = get().configurations.find((c) => c.id === id);
        if (!config) return "";
        return JSON.stringify(config, null, 2);
      },

      importConfiguration: (configStr) => {
        try {
          const config = JSON.parse(configStr) as RouterConfig;
          // Ensure the config has all required fields
          if (!config.id || !config.name || !config.vendor) {
            return false;
          }

          // Check if a configuration with the same ID already exists
          const existingConfig = get().configurations.find(
            (c) => c.id === config.id
          );

          if (existingConfig) {
            // If it exists, generate a new ID
            config.id = uuidv4();
            config.name = `${config.name} (Imported)`;
          }

          // Add the imported configuration
          set((state) => ({
            configurations: [...state.configurations, config],
            activeConfigId: config.id,
          }));

          return true;
        } catch (error) {
          console.error("Failed to import configuration:", error);
          return false;
        }
      },
    }),
    {
      name: "router-configurations",
    }
  )
);
