/**
 * India React Native job search presets and sample JDs for quick testing.
 */

export const INDIA_LOCATIONS = [
  { id: "india-all", label: "All India / Remote", linkedinLoc: "India", naukriLoc: "" },
  { id: "bengaluru", label: "Bengaluru", linkedinLoc: "Bengaluru, Karnataka, India", naukriLoc: "bengaluru" },
  { id: "ahmedabad", label: "Ahmedabad", linkedinLoc: "Ahmedabad, Gujarat, India", naukriLoc: "ahmedabad" },
  { id: "pune", label: "Pune", linkedinLoc: "Pune, Maharashtra, India", naukriLoc: "pune" },
  { id: "mumbai", label: "Mumbai", linkedinLoc: "Mumbai, Maharashtra, India", naukriLoc: "mumbai" },
  { id: "hyderabad", label: "Hyderabad", linkedinLoc: "Hyderabad, Telangana, India", naukriLoc: "hyderabad" },
  { id: "delhi-ncr", label: "Delhi NCR / Gurugram / Noida", linkedinLoc: "Gurugram, Haryana, India", naukriLoc: "delhi-ncr" }
];

export function buildIndiaJobLinks({
  query = "React Native Developer",
  locationId = "india-all",
  freshnessDays = 7,
  remoteOnly = false
} = {}) {
  const loc = INDIA_LOCATIONS.find((l) => l.id === locationId) || INDIA_LOCATIONS[0];
  const encodedQuery = encodeURIComponent(query);
  const seconds = freshnessDays <= 1 ? 86400 : freshnessDays <= 7 ? 604800 : 2592000;
  const naukriFreshness = freshnessDays <= 1 ? "1" : freshnessDays <= 3 ? "3" : freshnessDays <= 7 ? "7" : "15";

  const linkedinParams = new URLSearchParams({
    keywords: query,
    location: loc.linkedinLoc,
    f_TPR: `r${seconds}`,
    sortBy: "DD"
  });
  if (remoteOnly) {
    linkedinParams.set("f_WT", "2");
  }

  const slugQuery = query.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const naukriBase = loc.naukriLoc
    ? `https://www.naukri.com/${slugQuery}-jobs-in-${loc.naukriLoc}`
    : `https://www.naukri.com/${slugQuery}-jobs`;

  const naukriParams = new URLSearchParams({
    experience: "5",
    jobAge: naukriFreshness
  });
  if (remoteOnly) {
    naukriParams.set("wfhType", "2");
  }

  return [
    {
      portal: "LinkedIn India",
      badge: `Past ${freshnessDays}d • Date Sorted`,
      description: "Best for product companies, fintechs, and direct recruiter outreach.",
      url: `https://www.linkedin.com/jobs/search/?${linkedinParams.toString()}`
    },
    {
      portal: "Naukri.com",
      badge: `5+ Yrs • Age ≤ ${naukriFreshness}d`,
      description: "Highest volume of active Indian MNC, service, and product React Native openings.",
      url: `${naukriBase}?${naukriParams.toString()}`
    },
    {
      portal: "Instahyre",
      badge: "Curated India Product Roles",
      description: "High-signal product startups & unicorns in India (Razorpay, Swiggy, Zepto, etc.).",
      url: `https://www.instahyre.com/search-jobs/?skills=${encodedQuery}&job_type=0`
    },
    {
      portal: "Wellfound",
      badge: "Startups & Remote India",
      description: "Seed to Series-C startups hiring senior React Native & full-stack engineers.",
      url: `https://wellfound.com/role/l/react-native-developer/india`
    },
    {
      portal: "Hirist.tech",
      badge: "Tech & Mobile Specialist",
      description: "Dedicated Indian tech job board with strong React Native & Android/iOS listings.",
      url: `https://www.hirist.tech/k/react-native-jobs?minexp=4&maxexp=8`
    },
    {
      portal: "Cutshort",
      badge: "Fast-Response Startup Hiring",
      description: "Direct hiring-manager matches for senior mobile engineers across India.",
      url: `https://cutshort.io/jobs/react-native-jobs`
    }
  ];
}

export const SAMPLE_INDIAN_JDS = [
  {
    id: "fintech-bengaluru",
    title: "Senior React Native Engineer — Consumer Fintech (Bengaluru / Hybrid)",
    company: "FinPay Technologies India",
    role: "Senior React Native Engineer",
    location: "Bengaluru (Hybrid)",
    jd: `We are looking for a Senior React Native Engineer (4-7 years experience) to lead core mobile checkout, UPI/Razorpay payment flows, and high-reliability consumer experiences in Bengaluru.

Responsibilities:
- Architect and scale cross-platform iOS and Android apps using React Native (0.74+ / New Architecture, TurboModules, Fabric).
- Build custom Native Modules in Kotlin and Swift for biometric authentication, secure storage, and SDK integrations.
- Optimize app startup time, 60fps animations, memory usage, and offline-first state management with Redux Toolkit and TypeScript.
- Collaborate with backend teams on REST & GraphQL APIs, WebSocket real-time order updates, and Firebase push notifications.
- Lead code reviews, mentor junior developers, and maintain CI/CD pipelines via GitHub Actions and Fastlane/Play Store/App Store releases.

Good to have:
- Experience with Next.js or React.js web portals, monorepo setups, and automated testing (Jest / Detox).`
  },
  {
    id: "iot-healthtech-pune",
    title: "Lead Mobile Developer (React Native + BLE) — HealthTech / IoT (Remote India)",
    company: "PulseCare Connected Devices",
    role: "Lead React Native Developer",
    location: "Remote, India",
    jd: `Hiring a Lead React Native Developer with 5+ years of experience to own our wearable-connected patient safety mobile platform.

Key Requirements:
- Strong expertise in React Native, TypeScript, and bridging native Android (Kotlin/Java) & iOS (Swift/Objective-C) modules.
- Hands-on experience with Bluetooth Low Energy (BLE) background connectivity, background geolocation services, and push notifications (FCM/APNs).
- Proven track record of owning technical architecture, sprint planning, WBS estimations, and direct stakeholder collaboration.
- Experience integrating Google Maps SDK, real-time alerts, and secure role-based authentication.
- Familiarity with Firebase, offline data sync, and performance profiling.`
  },
  {
    id: "b2b-fullstack-ahmedabad",
    title: "Senior Mobile & Web Engineer (React Native + Next.js) — B2B Commerce",
    company: "BharatSupply Commerce",
    role: "Senior Software Engineer (React Native & Next.js)",
    location: "Ahmedabad / Remote",
    jd: `Looking for a Senior Full-Stack Mobile & Web Engineer (5+ years) to build our B2B & B2C commerce marketplace across mobile and web.

Must-Have Skills:
- Production experience shipping B2B/B2C apps in React Native and Next.js / React.js with TypeScript.
- State management using Redux Toolkit or Context API, GraphQL / REST API integration, and Tailwind CSS for web.
- Payment gateway integrations (Razorpay), invoicing/ERP workflows, and real-time push notifications.
- Experience with thermal Bluetooth printing or hardware peripherals is a strong plus.
- Agile delivery, mentoring engineers, and end-to-end ownership from architecture to App Store/Play Store deployment.`
  }
];
