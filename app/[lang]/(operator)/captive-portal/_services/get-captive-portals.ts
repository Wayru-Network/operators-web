export interface CaptivePortals {
  id: string;
  "portal-name": string;
  "flow-type": string;
  "assigned-hotspots": number;
  "conversion-rate": number;
  "last-edit": string;
  actions: string[];
}

export default async function getCaptivePortals() {
  return [
    {
      id: "1",
      "portal-name": "Wayru Central",
      "flow-type": "ad",
      "assigned-hotspots": 12,
      "conversion-rate": 87,
      "last-edit": "2024-06-10",
      actions: ["edit", "delete"],
    },
    {
      id: "2",
      "portal-name": "City WiFi",
      "flow-type": "voucher",
      "assigned-hotspots": 8,
      "conversion-rate": 65,
      "last-edit": "2024-06-08",
      actions: ["edit", "delete"],
    },
    {
      id: "3",
      "portal-name": "Mall Connect",
      "flow-type": "form",
      "assigned-hotspots": 15,
      "conversion-rate": 92,
      "last-edit": "2024-06-09",
      actions: ["edit", "delete"],
    },
    {
      id: "4",
      "portal-name": "Airport FreeNet",
      "flow-type": "ad",
      "assigned-hotspots": 20,
      "conversion-rate": 78,
      "last-edit": "2024-06-07",
      actions: ["edit", "delete"],
    },
    {
      id: "5",
      "portal-name": "Cafe Portal",
      "flow-type": "voucher",
      "assigned-hotspots": 5,
      "conversion-rate": 55,
      "last-edit": "2024-06-05",
      actions: ["edit", "delete"],
    },
    {
      id: "6",
      "portal-name": "Hotel GuestNet",
      "flow-type": "form",
      "assigned-hotspots": 10,
      "conversion-rate": 81,
      "last-edit": "2024-06-06",
      actions: ["edit", "delete"],
    },
    {
      id: "7",
      "portal-name": "Library Access",
      "flow-type": "ad",
      "assigned-hotspots": 7,
      "conversion-rate": 73,
      "last-edit": "2024-06-04",
      actions: ["edit", "delete"],
    },
    {
      id: "8",
      "portal-name": "Park WiFi",
      "flow-type": "voucher",
      "assigned-hotspots": 9,
      "conversion-rate": 60,
      "last-edit": "2024-06-03",
      actions: ["edit", "delete"],
    },
    {
      id: "9",
      "portal-name": "University Net",
      "flow-type": "form",
      "assigned-hotspots": 18,
      "conversion-rate": 95,
      "last-edit": "2024-06-02",
      actions: ["edit", "delete"],
    },
    {
      id: "10",
      "portal-name": "Event Hotspot",
      "flow-type": "ad",
      "assigned-hotspots": 6,
      "conversion-rate": 70,
      "last-edit": "2024-06-01",
      actions: ["edit", "delete"],
    },
  ];
}
