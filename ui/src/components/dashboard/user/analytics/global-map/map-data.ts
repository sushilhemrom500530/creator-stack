export interface CountryData {
    id: string;
    name: string;
    code: string;
    flag: string;
    path: string;
    labelPos: { x: number; y: number };
    nodePos: { x: number; y: number };
    users: number;
    percentage: number;
    latency: number;
    cities: string[];
    isPrimaryActive?: boolean;
    primaryLabel?: string;
}

export interface ArcConnection {
    id: string;
    from: { x: number; y: number };
    to: { x: number; y: number };
    control: { x: number; y: number };
    gradientId: string;
    color: string;
}

export interface MapNode {
    id: string;
    name: string;
    x: number;
    y: number;
    color: "cyan" | "magenta";
    size?: number;
}

// 1000x500 SVG Canvas paths for world map countries
export const COUNTRY_DATA: Record<string, CountryData> = {
    USA: {
        id: "USA",
        name: "United States",
        code: "US",
        flag: "🇺🇸",
        path: "M 130 110 L 220 105 L 270 120 L 290 145 L 285 185 L 270 215 L 230 230 L 190 220 L 140 210 L 130 170 Z M 105 75 L 145 70 L 150 100 L 110 105 Z M 115 210 L 135 210 L 130 225 L 110 220 Z",
        labelPos: { x: 210, y: 165 },
        nodePos: { x: 210, y: 165 },
        users: 39820,
        percentage: 47,
        latency: 18,
        cities: ["New York", "San Francisco", "Austin", "Chicago"],
        isPrimaryActive: true,
        primaryLabel: "USA"
    },
    CAN: {
        id: "CAN",
        name: "Canada",
        code: "CA",
        flag: "🇨🇦",
        path: "M 120 40 L 290 35 L 305 85 L 255 105 L 130 105 L 105 70 Z",
        labelPos: { x: 200, y: 70 },
        nodePos: { x: 190, y: 75 },
        users: 8450,
        percentage: 10,
        latency: 24,
        cities: ["Toronto", "Vancouver", "Montreal"],
    },
    MEX: {
        id: "MEX",
        name: "Mexico",
        code: "MX",
        flag: "🇲🇽",
        path: "M 140 215 L 190 225 L 210 260 L 180 285 L 160 250 Z",
        labelPos: { x: 175, y: 250 },
        nodePos: { x: 175, y: 250 },
        users: 4120,
        percentage: 5,
        latency: 42,
        cities: ["Mexico City", "Guadalajara"],
    },
    BRA: {
        id: "BRA",
        name: "Brazil",
        code: "BR",
        flag: "🇧🇷",
        path: "M 280 295 L 350 285 L 380 340 L 350 400 L 300 390 L 270 330 Z",
        labelPos: { x: 325, y: 345 },
        nodePos: { x: 325, y: 345 },
        users: 9410,
        percentage: 11,
        latency: 110,
        cities: ["São Paulo", "Rio de Janeiro", "Brasília"],
    },
    ARG: {
        id: "ARG",
        name: "Argentina",
        code: "AR",
        flag: "🇦🇷",
        path: "M 290 395 L 320 395 L 310 475 L 285 470 Z",
        labelPos: { x: 300, y: 435 },
        nodePos: { x: 300, y: 430 },
        users: 2150,
        percentage: 3,
        latency: 135,
        cities: ["Buenos Aires", "Córdoba"],
    },
    GBR: {
        id: "GBR",
        name: "United Kingdom",
        code: "GB",
        flag: "🇬🇧",
        path: "M 458 105 L 472 100 L 478 122 L 464 135 L 452 120 Z M 448 112 L 456 112 L 454 125 L 446 122 Z",
        labelPos: { x: 462, y: 102 },
        nodePos: { x: 465, y: 115 },
        users: 12450,
        percentage: 15,
        latency: 22,
        cities: ["London", "Manchester", "Edinburgh"],
        isPrimaryActive: true,
        primaryLabel: "UK"
    },
    DEU: {
        id: "DEU",
        name: "Germany",
        code: "DE",
        flag: "🇩🇪",
        path: "M 488 118 L 512 118 L 515 142 L 490 145 Z",
        labelPos: { x: 500, y: 158 },
        nodePos: { x: 500, y: 130 },
        users: 14890,
        percentage: 18,
        latency: 20,
        cities: ["Berlin", "Munich", "Frankfurt"],
        isPrimaryActive: true,
        primaryLabel: "GERMANY"
    },
    FRA: {
        id: "FRA",
        name: "France",
        code: "FR",
        flag: "🇫🇷",
        path: "M 466 138 L 492 136 L 495 168 L 468 172 Z",
        labelPos: { x: 480, y: 155 },
        nodePos: { x: 480, y: 155 },
        users: 7890,
        percentage: 9,
        latency: 25,
        cities: ["Paris", "Lyon", "Marseille"],
    },
    ESP: {
        id: "ESP",
        name: "Spain",
        code: "ES",
        flag: "🇪🇸",
        path: "M 440 170 L 470 168 L 465 198 L 435 195 Z",
        labelPos: { x: 452, y: 183 },
        nodePos: { x: 452, y: 183 },
        users: 5120,
        percentage: 6,
        latency: 32,
        cities: ["Madrid", "Barcelona"],
    },
    RUS: {
        id: "RUS",
        name: "Russia",
        code: "RU",
        flag: "🇷🇺",
        path: "M 520 50 L 850 45 L 870 120 L 740 135 L 530 115 Z",
        labelPos: { x: 680, y: 85 },
        nodePos: { x: 680, y: 85 },
        users: 6300,
        percentage: 7,
        latency: 68,
        cities: ["Moscow", "Saint Petersburg"],
    },
    CHN: {
        id: "CHN",
        name: "China",
        code: "CN",
        flag: "🇨🇳",
        path: "M 700 140 L 810 145 L 830 215 L 750 235 L 680 195 Z",
        labelPos: { x: 755, y: 185 },
        nodePos: { x: 755, y: 185 },
        users: 18400,
        percentage: 22,
        latency: 95,
        cities: ["Shanghai", "Beijing", "Shenzhen"],
    },
    IND: {
        id: "IND",
        name: "India",
        code: "IN",
        flag: "🇮🇳",
        path: "M 665 200 L 720 195 L 725 270 L 680 275 Z",
        labelPos: { x: 695, y: 235 },
        nodePos: { x: 695, y: 235 },
        users: 20500,
        percentage: 24,
        latency: 75,
        cities: ["Bengaluru", "Mumbai", "Delhi"],
    },
    JPN: {
        id: "JPN",
        name: "Japan",
        code: "JP",
        flag: "🇯🇵",
        path: "M 845 155 L 865 145 L 875 190 L 855 200 Z M 840 195 L 852 195 L 848 215 L 835 210 Z",
        labelPos: { x: 895, y: 165 },
        nodePos: { x: 860, y: 172 },
        users: 16200,
        percentage: 19,
        latency: 55,
        cities: ["Tokyo", "Osaka", "Kyoto"],
        isPrimaryActive: true,
        primaryLabel: "JAPAN"
    },
    AUS: {
        id: "AUS",
        name: "Australia",
        code: "AU",
        flag: "🇦🇺",
        path: "M 770 330 L 870 325 L 880 415 L 775 425 Z M 875 435 L 890 435 L 885 450 Z",
        labelPos: { x: 825, y: 375 },
        nodePos: { x: 825, y: 375 },
        users: 6500,
        percentage: 8,
        latency: 140,
        cities: ["Sydney", "Melbourne", "Brisbane"],
    },
    ZAF: {
        id: "ZAF",
        name: "South Africa",
        code: "ZA",
        flag: "🇿🇦",
        path: "M 530 350 L 575 350 L 565 410 L 525 405 Z",
        labelPos: { x: 550, y: 380 },
        nodePos: { x: 550, y: 380 },
        users: 3068,
        percentage: 4,
        latency: 160,
        cities: ["Johannesburg", "Cape Town"],
    },
    EGY: {
        id: "EGY",
        name: "Egypt",
        code: "EG",
        flag: "🇪🇬",
        path: "M 535 205 L 570 205 L 565 240 L 530 235 Z",
        labelPos: { x: 550, y: 220 },
        nodePos: { x: 550, y: 220 },
        users: 2890,
        percentage: 3,
        latency: 85,
        cities: ["Cairo", "Alexandria"],
    },
    NGA: {
        id: "NGA",
        name: "Nigeria",
        code: "NG",
        flag: "🇳🇬",
        path: "M 480 250 L 515 250 L 510 285 L 475 280 Z",
        labelPos: { x: 495, y: 268 },
        nodePos: { x: 495, y: 268 },
        users: 4100,
        percentage: 5,
        latency: 120,
        cities: ["Lagos", "Abuja"],
    },
    SAU: {
        id: "SAU",
        name: "Saudi Arabia",
        code: "SA",
        flag: "🇸🇦",
        path: "M 575 210 L 625 210 L 630 260 L 580 255 Z",
        labelPos: { x: 600, y: 235 },
        nodePos: { x: 600, y: 235 },
        users: 3900,
        percentage: 4,
        latency: 70,
        cities: ["Riyadh", "Jeddah"],
    }
};

// SVG Curved Arcs matching screenshot's flow paths
export const CONNECTIONS: ArcConnection[] = [
    {
        id: "usa-uk",
        from: { x: 210, y: 165 },
        to: { x: 465, y: 115 },
        control: { x: 330, y: 90 },
        gradientId: "gradient-cyan-purple",
        color: "#00f2fe"
    },
    {
        id: "usa-deu",
        from: { x: 210, y: 165 },
        to: { x: 500, y: 130 },
        control: { x: 350, y: 100 },
        gradientId: "gradient-cyan-purple",
        color: "#00f2fe"
    },
    {
        id: "usa-jpn",
        from: { x: 210, y: 165 },
        to: { x: 860, y: 172 },
        control: { x: 520, y: 40 },
        gradientId: "gradient-purple-magenta",
        color: "#c084fc"
    },
    {
        id: "usa-bra",
        from: { x: 210, y: 165 },
        to: { x: 325, y: 345 },
        control: { x: 230, y: 260 },
        gradientId: "gradient-cyan-purple",
        color: "#00f2fe"
    },
    {
        id: "deu-jpn",
        from: { x: 500, y: 130 },
        to: { x: 860, y: 172 },
        control: { x: 680, y: 70 },
        gradientId: "gradient-purple-magenta",
        color: "#e879f9"
    },
    {
        id: "deu-ind",
        from: { x: 500, y: 130 },
        to: { x: 695, y: 235 },
        control: { x: 600, y: 140 },
        gradientId: "gradient-cyan-purple",
        color: "#38bdf8"
    },
    {
        id: "deu-zaf",
        from: { x: 500, y: 130 },
        to: { x: 550, y: 380 },
        control: { x: 470, y: 260 },
        gradientId: "gradient-cyan-purple",
        color: "#38bdf8"
    },
    {
        id: "jpn-aus",
        from: { x: 860, y: 172 },
        to: { x: 825, y: 375 },
        control: { x: 880, y: 280 },
        gradientId: "gradient-purple-magenta",
        color: "#e879f9"
    },
    {
        id: "jpn-chn",
        from: { x: 860, y: 172 },
        to: { x: 755, y: 185 },
        control: { x: 810, y: 200 },
        gradientId: "gradient-purple-magenta",
        color: "#c084fc"
    }
];

export const MAP_NODES: MapNode[] = [
    { id: "n1", name: "Los Angeles", x: 155, y: 180, color: "cyan", size: 4 },
    { id: "n2", name: "New York", x: 250, y: 150, color: "cyan", size: 5 },
    { id: "n3", name: "Miami", x: 235, y: 215, color: "cyan", size: 4 },
    { id: "n4", name: "São Paulo", x: 335, y: 360, color: "cyan", size: 4 },
    { id: "n5", name: "Bogota", x: 255, y: 280, color: "cyan", size: 3 },
    { id: "n6", name: "London", x: 465, y: 115, color: "magenta", size: 5 },
    { id: "n7", name: "Berlin", x: 500, y: 130, color: "magenta", size: 6 },
    { id: "n8", name: "Madrid", x: 452, y: 183, color: "cyan", size: 4 },
    { id: "n9", name: "Rome", x: 495, y: 165, color: "cyan", size: 3 },
    { id: "n10", name: "Cairo", x: 550, y: 220, color: "cyan", size: 4 },
    { id: "n11", name: "Lagos", x: 495, y: 268, color: "cyan", size: 4 },
    { id: "n12", name: "Cape Town", x: 550, y: 380, color: "cyan", size: 4 },
    { id: "n13", name: "Dubai", x: 615, y: 210, color: "cyan", size: 5 },
    { id: "n14", name: "Mumbai", x: 685, y: 240, color: "magenta", size: 4 },
    { id: "n15", name: "Bengaluru", x: 700, y: 260, color: "magenta", size: 4 },
    { id: "n16", name: "Singapore", x: 760, y: 275, color: "magenta", size: 4 },
    { id: "n17", name: "Tokyo", x: 860, y: 172, color: "magenta", size: 6 },
    { id: "n18", name: "Shanghai", x: 785, y: 195, color: "magenta", size: 5 },
    { id: "n19", name: "Sydney", x: 840, y: 390, color: "magenta", size: 4 },
    { id: "n20", name: "Auckland", x: 915, y: 435, color: "magenta", size: 3 }
];
