/**
 * Hybrid JD Tailoring Engine:
 * 1) Deterministic ATS keyword matcher, gap detector, bullet/project ranker, and summary builder.
 * 2) Optional Gemini / OpenAI API enhancer that refines phrasing without fabricating facts.
 */

const KEYWORD_CATALOG = [
  { id: "react-native", label: "React Native", category: "mobile", patterns: ["react native", "react-native", "rn developer", "rn engineer"] },
  { id: "new-architecture", label: "React Native New Architecture", category: "mobile", patterns: ["new architecture", "turbomodules", "turbomodule", "fabric", "jsi", "hermes"] },
  { id: "native-modules", label: "Native Modules (Kotlin / Swift)", category: "mobile", patterns: ["native module", "native modules", "native bridge", "kotlin", "swift", "objective-c", "java", "android sdk", "ios sdk"] },
  { id: "typescript", label: "TypeScript", category: "language", patterns: ["typescript", "ts"] },
  { id: "javascript", label: "JavaScript (ES6+)", category: "language", patterns: ["javascript", "es6", "ecmascript"] },
  { id: "redux", label: "Redux / Redux Toolkit", category: "state", patterns: ["redux", "redux toolkit", "rtk", "redux-saga", "redux-thunk"] },
  { id: "context-api", label: "Context API", category: "state", patterns: ["context api", "react context"] },
  { id: "zustand", label: "Zustand / MobX", category: "state", patterns: ["zustand", "mobx"] },
  { id: "graphql", label: "GraphQL / Apollo", category: "api", patterns: ["graphql", "apollo", "apollo client"] },
  { id: "rest", label: "RESTful APIs", category: "api", patterns: ["rest", "restful", "rest api", "rest apis", "axios", "fetch"] },
  { id: "websockets", label: "WebSockets / Real-time", category: "api", patterns: ["websocket", "websockets", "socket.io", "real-time", "realtime", "socket programming"] },
  { id: "firebase", label: "Firebase", category: "cloud", patterns: ["firebase", "firestore", "crashlytics", "fcm"] },
  { id: "push-notifications", label: "Push Notifications (FCM / APNs)", category: "mobile", patterns: ["push notification", "push notifications", "fcm", "apns", "notifee"] },
  { id: "ble", label: "BLE / Bluetooth", category: "hardware", patterns: ["ble", "bluetooth", "bluetooth low energy", "wearable", "thermal printer", "iot"] },
  { id: "geolocation", label: "Geolocation & Background Services", category: "mobile", patterns: ["geolocation", "gps", "location tracking", "geofencing", "background service", "background services", "background task"] },
  { id: "maps", label: "Google Maps SDK", category: "integrations", patterns: ["google maps", "maps sdk", "mapbox"] },
  { id: "biometrics", label: "Biometrics & Security", category: "mobile", patterns: ["biometric", "biometrics", "faceid", "touchid", "fingerprint", "secure storage", "keychain", "keystore"] },
  { id: "payments", label: "Payment Gateways (Razorpay / UPI)", category: "integrations", patterns: ["razorpay", "payment gateway", "payments", "upi", "stripe", "checkout", "billing", "invoicing"] },
  { id: "nextjs", label: "Next.js", category: "web", patterns: ["next.js", "nextjs"] },
  { id: "reactjs", label: "React.js", category: "web", patterns: ["react.js", "reactjs", "react js"] },
  { id: "tailwind", label: "Tailwind CSS", category: "web", patterns: ["tailwind", "tailwind css"] },
  { id: "monorepo", label: "Monorepo Architecture", category: "architecture", patterns: ["monorepo", "turborepo", "nx"] },
  { id: "architecture", label: "Mobile App Architecture", category: "architecture", patterns: ["architecture", "clean architecture", "mvvm", "modular", "scalable", "design patterns"] },
  { id: "offline", label: "Offline-First & Local Storage", category: "mobile", patterns: ["offline", "offline-first", "asyncstorage", "mmkv", "sqlite", "realm", "sync", "synchronization"] },
  { id: "performance", label: "Performance Optimization", category: "architecture", patterns: ["performance", "60fps", "startup time", "memory", "profiling", "flatlist", "flashlist", "optimization"] },
  { id: "animations", label: "Animations (Reanimated / Gesture Handler)", category: "mobile", patterns: ["reanimated", "gesture handler", "lottie", "animations", "60fps"] },
  { id: "testing", label: "Testing (Jest / Detox / RTL)", category: "quality", patterns: ["jest", "detox", "react native testing library", "unit testing", "e2e", "maestro"] },
  { id: "cicd", label: "CI/CD & Store Releases", category: "devops", patterns: ["ci/cd", "github actions", "fastlane", "play store", "app store", "codepush", "ota", "testflight", "deployment"] },
  { id: "leadership", label: "Tech Leadership & Mentorship", category: "leadership", patterns: ["lead", "leading", "mentor", "mentorship", "code review", "code reviews", "sprint planning", "agile", "scrum", "stakeholder", "wbs", "estimation"] },
  { id: "b2b-b2c", label: "B2B & B2C Platforms", category: "domain", patterns: ["b2b", "b2c", "e-commerce", "ecommerce", "marketplace", "fintech", "travel", "hrms", "erp", "retail", "healthtech", "agritech"] }
];

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function textMatchesPattern(textLower, pattern) {
  if (pattern.length <= 3 && !pattern.includes(".")) {
    const re = new RegExp(`(^|[^a-z0-9])${escapeRegExp(pattern)}([^a-z0-9]|$)`, "i");
    return re.test(textLower);
  }
  const re = new RegExp(`(^|[^a-z0-9])${escapeRegExp(pattern)}([^a-z0-9]|$)`, "i");
  return re.test(textLower);
}

function buildProfileCorpus(profile) {
  const parts = [
    profile.basics?.headline || "",
    profile.basics?.summary || "",
    ...(profile.skillCategories || []).flatMap((c) => [c.title, ...(c.skills || [])]),
    ...(profile.experiences || []).flatMap((e) => [e.role, e.company, ...(e.tags || []), ...(e.bullets || [])]),
    ...(profile.projects || []).flatMap((p) => [p.title, p.platform, p.tagline, ...(p.tags || []), ...(p.bullets || [])])
  ];
  return parts.join("\n").toLowerCase();
}

export function extractKeywords(jdText, profile) {
  const jdLower = (jdText || "").toLowerCase();
  const profileCorpus = buildProfileCorpus(profile);

  const inJd = [];
  for (const kw of KEYWORD_CATALOG) {
    const matchedInJd = kw.patterns.some((p) => textMatchesPattern(jdLower, p));
    if (matchedInJd) {
      const inProfile =
        kw.patterns.some((p) => textMatchesPattern(profileCorpus, p)) ||
        (profile.experiences || []).some((e) => (e.tags || []).includes(kw.id)) ||
        (profile.projects || []).some((p) => (p.tags || []).includes(kw.id));
      inJd.push({ ...kw, inProfile });
    }
  }

  const matchedKeywords = inJd.filter((k) => k.inProfile);
  const missingKeywords = inJd.filter((k) => !k.inProfile);

  const total = inJd.length;
  const score = total === 0 ? 75 : Math.min(98, Math.round((matchedKeywords.length / total) * 100));

  return {
    totalDetected: total,
    score,
    matchedKeywords,
    missingKeywords
  };
}

function scoreTextAndTags(text, tags, matchedIds) {
  const lower = text.toLowerCase();
  let score = 0;
  for (const id of matchedIds) {
    if ((tags || []).includes(id)) {
      score += 3;
    }
    const kw = KEYWORD_CATALOG.find((k) => k.id === id);
    if (kw && kw.patterns.some((p) => textMatchesPattern(lower, p))) {
      score += 2;
    }
  }
  return score;
}

function inferHeadline(jdText, targetRole, profile) {
  if (targetRole && targetRole.trim()) {
    return targetRole.trim();
  }
  const lower = (jdText || "").toLowerCase();
  if (lower.includes("lead") && lower.includes("react native")) {
    return "Lead React Native Engineer";
  }
  if ((lower.includes("next.js") || lower.includes("nextjs")) && lower.includes("react native")) {
    return "Senior Software Engineer (React Native & Next.js)";
  }
  if (lower.includes("react native")) {
    return "Senior React Native Developer";
  }
  return profile.basics?.headline || "Senior Software Engineer";
}

function buildTailoredSummary({ profile, matchedKeywords, targetRole, companyName, jdText }) {
  const years = profile.basics?.yearsOfExperience || "5+";
  const topTech = matchedKeywords
    .filter((k) => !["b2b-b2c", "leadership"].includes(k.id))
    .slice(0, 6)
    .map((k) => k.label);

  const techText =
    topTech.length > 0
      ? topTech.join(", ")
      : "React Native, TypeScript, Next.js, Native Modules (Kotlin & Swift), GraphQL, and REST APIs";

  const hasLeadership = matchedKeywords.some((k) => k.id === "leadership");
  const lower = (jdText || "").toLowerCase();
  const domainHits = [];
  if (lower.includes("fintech") || lower.includes("upi") || lower.includes("razorpay") || lower.includes("payment")) {
    domainHits.push("FinTech & Payment Gateways");
  }
  if (lower.includes("b2b") || lower.includes("b2c") || lower.includes("commerce") || lower.includes("marketplace")) {
    domainHits.push("B2B & B2C Marketplaces");
  }
  if (lower.includes("ble") || lower.includes("bluetooth") || lower.includes("iot") || lower.includes("wearable")) {
    domainHits.push("BLE & IoT Wearables");
  }
  if (lower.includes("travel") || lower.includes("booking")) {
    domainHits.push("Travel & Booking Engines");
  }
  if (lower.includes("hrms") || lower.includes("erp") || lower.includes("enterprise")) {
    domainHits.push("Enterprise HRMS & ERP");
  }

  const rolePhrase = inferHeadline(jdText, targetRole, profile);
  const domainSentence =
    domainHits.length > 0
      ? ` Proven track record delivering production apps across ${domainHits.join(", ")}.`
      : " Proven track record delivering scalable B2B and B2C mobile and web platforms from architecture to store release.";

  const leadSentence = hasLeadership
    ? " Experienced in technical architecture, sprint planning, code reviews, mentoring engineers, and end-to-end client delivery."
    : " Focused on high-FPS UI responsiveness, offline-first reliability, and clean modular architecture across Android and iOS.";

  const targetTail = companyName ? ` Tailored for ${rolePhrase} impact at ${companyName}.` : "";

  return `Results-driven ${rolePhrase} with ${years} years of experience building scalable, high-performance Android, iOS, and web applications. Core expertise in ${techText}.${domainSentence}${leadSentence}${targetTail}`.replace(/\s+/g, " ").trim();
}

export function tailorResumeOffline(profile, { jdText = "", targetRole = "", companyName = "", maxProjects = 4 } = {}) {
  const analysis = extractKeywords(jdText, profile);
  const matchedIds = new Set(analysis.matchedKeywords.map((k) => k.id));

  // Reorder skills inside each category so JD-matched skills come first
  const skillCategories = (profile.skillCategories || []).map((cat) => {
    const scoredSkills = (cat.skills || []).map((skill, idx) => {
      const sLower = skill.toLowerCase();
      let relevance = 0;
      for (const kw of analysis.matchedKeywords) {
        if (kw.patterns.some((p) => textMatchesPattern(sLower, p)) || sLower.includes(kw.label.toLowerCase())) {
          relevance += 10;
        }
      }
      return { skill, relevance, idx };
    });
    scoredSkills.sort((a, b) => b.relevance - a.relevance || a.idx - b.idx);
    const catRelevance = scoredSkills.reduce((acc, s) => acc + s.relevance, 0);
    return {
      ...cat,
      relevance: catRelevance,
      skills: scoredSkills.map((s) => s.skill)
    };
  });
  skillCategories.sort((a, b) => b.relevance - a.relevance);

  // Keep experiences in reverse-chronological order, but rank bullets within each experience by JD relevance
  const experiences = (profile.experiences || []).map((exp) => {
    const rankedBullets = (exp.bullets || []).map((bullet, idx) => ({
      bullet,
      idx,
      score: scoreTextAndTags(bullet, exp.tags, matchedIds)
    }));
    rankedBullets.sort((a, b) => b.score - a.score || a.idx - b.idx);
    return {
      ...exp,
      relevanceScore: scoreTextAndTags([exp.role, ...(exp.bullets || [])].join(" "), exp.tags, matchedIds),
      bullets: rankedBullets.map((b) => b.bullet)
    };
  });

  // Rank projects by JD relevance and select top N
  const scoredProjects = (profile.projects || []).map((proj, idx) => ({
    ...proj,
    idx,
    relevanceScore: scoreTextAndTags(
      [proj.title, proj.platform, proj.tagline, ...(proj.bullets || [])].join(" "),
      proj.tags,
      matchedIds
    )
  }));
  scoredProjects.sort((a, b) => b.relevanceScore - a.relevanceScore || a.idx - b.idx);
  const selectedProjects = maxProjects > 0 ? scoredProjects.slice(0, maxProjects) : scoredProjects;

  const headline = inferHeadline(jdText, targetRole, profile);
  const summary = jdText.trim()
    ? buildTailoredSummary({ profile, matchedKeywords: analysis.matchedKeywords, targetRole, companyName, jdText })
    : profile.basics.summary;

  return {
    analysis,
    tailored: {
      basics: {
        ...profile.basics,
        headline,
        summary
      },
      skillCategories: skillCategories.map(({ relevance, ...rest }) => rest),
      experiences: experiences.map(({ relevanceScore, ...rest }) => rest),
      projects: selectedProjects.map(({ idx, ...rest }) => rest),
      allRankedProjects: scoredProjects.map(({ idx, ...rest }) => rest),
      education: profile.education || []
    }
  };
}

export async function enhanceTailoredResumeWithAI({
  jdText,
  tailored,
  provider = "gemini",
  apiKey,
  model
}) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error("API key is required for AI enhancement.");
  }

  const systemInstruction = [
    "You are an expert Indian tech resume editor specializing in Senior React Native & Full-Stack resumes for ATS and Overleaf.",
    "STRICT TRUTH RULE: Never invent companies, job titles, dates, degrees, metrics/percentages, or skills that are not already present in the provided candidate JSON.",
    "Only refine the summary and rephrase existing experience/project bullets so they naturally align with the Job Description terminology while remaining 100% factual.",
    "Keep bullets concise (1-2 lines each, strong action verbs, ATS-friendly plain text without markdown asterisks).",
    "Return ONLY valid JSON with exact keys: { \"headline\": string, \"summary\": string, \"experiences\": [{ \"id\": string, \"bullets\": string[] }], \"projects\": [{ \"id\": string, \"bullets\": string[] }] }."
  ].join("\n");

  const userPayload = JSON.stringify({
    jobDescription: jdText,
    candidateResume: {
      headline: tailored.basics.headline,
      summary: tailored.basics.summary,
      experiences: tailored.experiences.map((e) => ({ id: e.id, role: e.role, company: e.company, bullets: e.bullets })),
      projects: tailored.projects.map((p) => ({ id: p.id, title: p.title, platform: p.platform, bullets: p.bullets }))
    }
  });

  let rawText = "";

  if (provider === "gemini") {
    const geminiModel = model || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: userPayload }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json"
        }
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${errText.slice(0, 300)}`);
    }
    const data = await res.json();
    rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } else if (provider === "openai") {
    const openaiModel = model || "gpt-4o-mini";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: openaiModel,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPayload }
        ]
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${errText.slice(0, 300)}`);
    }
    const data = await res.json();
    rawText = data?.choices?.[0]?.message?.content || "";
  } else {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI response did not contain valid JSON.");
  }
  const parsed = JSON.parse(jsonMatch[0]);

  const expMap = new Map((parsed.experiences || []).map((e) => [e.id, e.bullets]));
  const projMap = new Map((parsed.projects || []).map((p) => [p.id, p.bullets]));

  return {
    ...tailored,
    basics: {
      ...tailored.basics,
      headline: parsed.headline || tailored.basics.headline,
      summary: parsed.summary || tailored.basics.summary
    },
    experiences: tailored.experiences.map((exp) => ({
      ...exp,
      bullets: Array.isArray(expMap.get(exp.id)) && expMap.get(exp.id).length > 0 ? expMap.get(exp.id) : exp.bullets
    })),
    projects: tailored.projects.map((proj) => ({
      ...proj,
      bullets: Array.isArray(projMap.get(proj.id)) && projMap.get(proj.id).length > 0 ? projMap.get(proj.id) : proj.bullets
    }))
  };
}
