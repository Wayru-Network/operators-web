export interface Hotspot {
  key: string;
  "hotspot-name": string;
  mac: string;
  status: string;
  "assigned-portal": string;
  "location-name": string;
  actions: string;
}

export default async function getHotspots(): Promise<Hotspot[]> {
  return [
    {
      key: "4ff07c9a-3db6-4285-8d8d-c20d211ed0c5",
      "hotspot-name": "Central-Park-AP",
      mac: "00:1A:2B:3C:4D:5E",
      status: "Online",
      "assigned-portal": "Main Portal",
      "location-name": "Central Park",
      actions: "Edit | Delete",
    },
    {
      key: "e8a1f7b2-6c3e-4e2a-9f7b-2a1c8e7d2b3c",
      "hotspot-name": "Library-WiFi",
      mac: "11:22:33:44:55:66",
      status: "Offline",
      "assigned-portal": "Student Portal",
      "location-name": "City Library",
      actions: "Edit | Delete",
    },
    {
      key: "c5d2a8e4-7b1f-4c3a-8e2d-9f1b2a3c4d5e",
      "hotspot-name": "Mall-Entrance",
      mac: "AA:BB:CC:DD:EE:FF",
      status: "Online",
      "assigned-portal": "Guest Portal",
      "location-name": "Downtown Mall",
      actions: "Edit | Delete",
    },
    {
      key: "f2b3c4d5-e6a7-4b8c-9d1e-2a3b4c5d6e7f",
      "hotspot-name": "Airport-Lounge",
      mac: "12:34:56:78:9A:BC",
      status: "Offline",
      "assigned-portal": "VIP Portal",
      "location-name": "International Airport",
      actions: "Edit | Delete",
    },
    {
      key: "a7e6d5c4-b3f2-4c1d-8e9a-7b6c5d4e3f2a",
      "hotspot-name": "Coffee-Shop",
      mac: "FE:DC:BA:98:76:54",
      status: "Online",
      "assigned-portal": "Customer Portal",
      "location-name": "Brewed Awakenings",
      actions: "Edit | Delete",
    },
    {
      key: "b1c2d3e4-f5a6-4b7c-8d9e-0a1b2c3d4e5f",
      "hotspot-name": "University-Hall",
      mac: "01:23:45:67:89:AB",
      status: "Offline",
      "assigned-portal": "Campus-Portal",
      "location-name": "Uni Hall",
      actions: "Edit | Delete",
    },
  ];
}
