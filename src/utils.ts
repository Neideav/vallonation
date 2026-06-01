import { DatabaseEntry, TerminalLog, ApiKey, NodeServer } from "./types";

// Helper to generate a realistic looking secure api key
export function generateSecureApiKey(name: string): ApiKey {
  const chars = "abcdef0123456789";
  let randomHex = "";
  for (let i = 0; i < 32; i++) {
    randomHex += chars[Math.floor(Math.random() * chars.length)];
  }
  return {
    id: `key_${Math.random().toString(36).substring(2, 9)}`,
    name,
    keyString: `val_live_${randomHex.substring(0, 16)}...${randomHex.substring(24)}`,
    created: new Date().toISOString().replace("T", " ").substring(0, 19),
    status: "active",
    permissions: {
      read: true,
      write: true,
      subscribe: true,
    },
  };
}

export const initialApiKeys: ApiKey[] = [
  {
    id: "key-odin-main",
    name: "Production Gateway (Main)",
    keyString: "val_live_8f7b2cde8761a293df7c050a41dcd712",
    created: "2026-05-28 09:12:44",
    status: "active",
    permissions: {
      read: true,
      write: true,
      subscribe: true,
    },
  },
  {
    id: "key-analytics-io",
    name: "ReadOnly Dashboard Key",
    keyString: "val_live_3dbca1927e85e2390f7a29ac789ee901",
    created: "2026-05-29 14:02:11",
    status: "active",
    permissions: {
      read: true,
      write: false,
      subscribe: true,
    },
  }
];

export const initialDatabaseEntries: DatabaseEntry[] = [
  {
    id: "db-usr-1",
    key: "users:active:johndoe",
    value: '{"status": "online", "plan": "premium", "sessions": 42}',
    category: "users",
    lastUpdated: "Just now",
    sizeBytes: 124,
    syncNode: "Odin-Alpha (Frankfurt)",
  },
  {
    id: "db-ses-1",
    key: "sessions:token:h7x9k",
    value: '{"user_id": "usr_998", "expiry": 1782348000, "ip": "185.12.33.2"}',
    category: "sessions",
    lastUpdated: "3s ago",
    sizeBytes: 94,
    syncNode: "Odin-Beta (Virginia)",
  },
  {
    id: "db-pay-1",
    key: "payment:invoice:0824",
    value: '{"amount": 12.99, "currency": "USD", "status": "settled"}',
    category: "payment",
    lastUpdated: "12s ago",
    sizeBytes: 88,
    syncNode: "Odin-Gamma (Singapore)",
  },
  {
    id: "db-iot-1",
    key: "iot:sensor:temp_berlin",
    value: '{"temp": 21.4, "humidity": 58, "calibration": "2026-05-20"}',
    category: "iot_telemetry",
    lastUpdated: "1s ago",
    sizeBytes: 110,
    syncNode: "Odin-Alpha (Frankfurt)",
  }
];

export const initialEdgeNodes: NodeServer[] = [
  {
    id: "node-1",
    name: "Odin-Alpha",
    region: "Frankfurt, EU-Central",
    status: "online",
    pingMs: 4,
    loadPercentage: 28,
  },
  {
    id: "node-2",
    name: "Odin-Beta",
    region: "Virginia, US-East",
    status: "online",
    pingMs: 12,
    loadPercentage: 42,
  },
  {
    id: "node-3",
    name: "Odin-Gamma",
    region: "Singapore, AP-Southeast",
    status: "online",
    pingMs: 22,
    loadPercentage: 19,
  },
  {
    id: "node-4",
    name: "Odin-Delta",
    region: "Tokyo, AP-Northeast",
    status: "online",
    pingMs: 31,
    loadPercentage: 33,
  }
];

// Helper to provide nice runic lines or labels for Odin-grade theme
export const odinRunes = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ", "ᛁ", "ᛃ", "ᛇ", "ᛈ", "ᛉ", "ᛊ", "ᛏ", "ᛒ", "ᛗ", "ᛚ", "ᛜ", "ᛟ", "ᛞ"];

export function getRandomRune(): string {
  return odinRunes[Math.floor(Math.random() * odinRunes.length)];
}

export function getCurrentTimeFormatted(): string {
  const d = new Date();
  return d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
}

export function createLog(
  type: TerminalLog["type"],
  message: string,
  method?: TerminalLog["method"],
  bytes?: number,
  latency?: number
): TerminalLog {
  return {
    id: `log_${Math.random().toString(36).substring(2, 9)}`,
    timestamp: getCurrentTimeFormatted(),
    type,
    message,
    method,
    bytes,
    latency,
  };
}
