/**
 * Auto-Draft Email Generator for React Native Job Applications (India)
 * Automatically extracts company, role, recruiter contact, and JD requirements,
 * and uses AI (Gemini / OpenAI) by default whenever an API key is configured.
 */

const DEFAULT_PORTFOLIO = "https://parth-lunagaria-portfolio.vercel.app/";

export function extractJdEmailMetadata(jdText = "", candidateEmail = "parthlunagaria11@gmail.com") {
  const text = String(jdText || "");
  if (!text.trim()) {
    return { recipientEmail: "", recruiterName: "", companyName: "", targetRole: "" };
  }

  // Extract recruiter / HR email from JD (skipping candidate's own email)
  const emailMatches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  const recipientEmail =
    emailMatches.find((em) => em.toLowerCase() !== candidateEmail.toLowerCase()) || "";

  // Extract recruiter name if mentioned near contact cues
  let recruiterName = "";
  const recruiterMatch = text.match(
    /(?:contact|reach\s+out\s+to|hr|recruiter|hiring\s+manager|attn|send\s+(?:your\s+)?(?:resume|cv)\s+to)\s*[:\-]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i
  );
  if (recruiterMatch?.[1]) {
    const candidate = recruiterMatch[1].trim();
    if (!/^(us|me|hr|team|email|resume|cv|our|the)$/i.test(candidate)) {
      recruiterName = candidate;
    }
  }

  // Extract company name from common JD patterns
  let companyName = "";
  const companyPatterns = [
    /(?:company|organization|organisation)\s*[:\-]\s*([^\n,|]{2,45})/i,
    /(?:about|join)\s+([A-Z][A-Za-z0-9&.\- ]{1,35})(?:\n|:|,|\.| is |\s+is\s+)/,
    /(?:opening|role|position|opportunity)\s+at\s+([A-Z][A-Za-z0-9&.\- ]{1,35})(?:\n|,|\.|!|$)/
  ];
  for (const re of companyPatterns) {
    const m = text.match(re);
    if (m?.[1]) {
      const cleaned = m[1].trim().replace(/[.!,]+$/, "");
      if (cleaned.length >= 2 && !/^(our|the|a|an|this|india|remote)$/i.test(cleaned)) {
        companyName = cleaned;
        break;
      }
    }
  }

  // Extract role title from common JD patterns
  let targetRole = "";
  const rolePatterns = [
    /(?:role|job\s*title|position|designation)\s*[:\-]\s*([^\n|]{3,65})/i,
    /(?:looking\s+for|hiring|seeking)\s+(?:a|an)\s+([A-Z][A-Za-z0-9+/().\- ]{3,55}?)(?:\s*\(|\s+with\s+|\s+to\s+|\s+in\s+|\n|,|\.)/i
  ];
  for (const re of rolePatterns) {
    const m = text.match(re);
    if (m?.[1]) {
      targetRole = m[1].trim().replace(/[.!,]+$/, "");
      break;
    }
  }

  return { recipientEmail, recruiterName, companyName, targetRole };
}

function pickTopSkills(analysis, tailored) {
  const matched = (analysis?.matchedKeywords || [])
    .filter((k) => !["b2b-b2c", "leadership"].includes(k.id))
    .map((k) => k.label);

  if (matched.length >= 3) {
    return matched.slice(0, 5);
  }

  const fromCategories = (tailored?.skillCategories || []).flatMap((c) => c.skills || []);
  return [...new Set([...matched, ...fromCategories])].slice(0, 5);
}

export function generateDraftEmail({
  profile,
  tailored,
  analysis,
  jdText = "",
  companyName = "",
  targetRole = "",
  recruiterName = "",
  recipientEmail = "",
  tone = "standard"
} = {}) {
  const resume = tailored || profile || {};
  const b = resume.basics || profile?.basics || {};
  const name = b.name || "Parth Lunagaria";
  const years = b.yearsOfExperience || "5+";
  const phone = b.phone || "+91 91069-60267";
  const email = b.email || "parthlunagaria11@gmail.com";
  const linkedin = b.linkedin || "https://www.linkedin.com/in/parth-lunagaria";
  const portfolio = b.portfolio || DEFAULT_PORTFOLIO;
  const location = b.location || "Ahmedabad, Gujarat, India";
  const availability = b.availability || "Immediate / Open to Remote & Hybrid across India";

  const extracted = extractJdEmailMetadata(jdText, email);
  const resolvedCompany = (companyName || extracted.companyName || "").trim();
  const resolvedRole = (targetRole || extracted.targetRole || b.headline || "Senior React Native Developer").trim();
  const resolvedRecruiter = (recruiterName || extracted.recruiterName || "").trim();
  const resolvedTo = (recipientEmail || extracted.recipientEmail || "").trim();

  const greeting = resolvedRecruiter ? `Hi ${resolvedRecruiter},` : "Hi Hiring Team,";

  const topSkills = pickTopSkills(analysis, resume);
  const skillsLine =
    topSkills.length > 0
      ? topSkills.join(", ")
      : "React Native, TypeScript, Native Modules (Kotlin/Swift), Redux Toolkit, GraphQL";

  const topProjects = (resume.projects || []).slice(0, 2);
  const projectSummary =
    topProjects.length > 0
      ? topProjects.map((p) => `${p.title} (${p.tagline})`).join(" and ")
      : "Travel Terminus (B2B/B2C booking engine) and ReqsQ (BLE wearable safety app)";

  let subject = "";
  let body = "";

  if (tone === "short") {
    subject = resolvedCompany
      ? `${resolvedRole} Application — ${name} (${years} Yrs React Native)`
      : `Application for ${resolvedRole} — ${name} (${years} Yrs React Native)`;

    body = [
      greeting,
      "",
      `I am reaching out regarding the ${resolvedRole} opening${resolvedCompany ? ` at ${resolvedCompany}` : ""}. I am a Senior React Native & Full-Stack Engineer with ${years} years of experience shipping production Android, iOS, and Next.js applications.`,
      "",
      `My hands-on stack aligns closely with your requirements: ${skillsLine}. Recently, I architected and delivered ${projectSummary}.`,
      "",
      `Portfolio: ${portfolio}`,
      `LinkedIn: ${linkedin}`,
      `Phone / WhatsApp: ${phone} | Location: ${location}`,
      "",
      `I have attached my updated resume for your review and would welcome a quick conversation.`,
      "",
      `Best regards,`,
      name
    ].join("\n");
  } else if (tone === "followup") {
    subject = resolvedCompany
      ? `Following Up: ${resolvedRole} Application — ${name}`
      : `Following Up: ${resolvedRole} — ${name}`;

    body = [
      greeting,
      "",
      `I hope you are doing well. I am following up on my application for the ${resolvedRole} position${resolvedCompany ? ` at ${resolvedCompany}` : ""}.`,
      "",
      `With ${years} years of experience building scalable React Native apps (${skillsLine}) and recent work including ${projectSummary}, I am very keen to contribute to your mobile engineering team.`,
      "",
      `You can also explore my work and case studies on my portfolio: ${portfolio}`,
      "",
      `Please let me know if there is any additional information I can share. Looking forward to hearing from you.`,
      "",
      `Best regards,`,
      name,
      `${phone} | ${email}`,
      `LinkedIn: ${linkedin}`
    ].join("\n");
  } else {
    subject = resolvedCompany
      ? `Application for ${resolvedRole} at ${resolvedCompany} | ${name} (${years} Yrs React Native)`
      : `Application for ${resolvedRole} | ${name} (${years} Yrs React Native)`;

    body = [
      greeting,
      "",
      `I am writing to apply for the ${resolvedRole} role${resolvedCompany ? ` at ${resolvedCompany}` : ""}. I bring ${years} years of experience architecting, scaling, and shipping high-performance React Native mobile apps across Android and iOS (along with Next.js web platforms) for B2B and B2C products.`,
      "",
      `Key highlights relevant to this role:`,
      `- Core Stack & Native Depth: Strong expertise in ${skillsLine}, with production focus on scalable mobile architecture and native Android/iOS integrations.`,
      `- Production Delivery: Delivered complex consumer and enterprise apps including ${projectSummary}.`,
      `- Ownership & Mentorship: Experienced in mobile app architecture, sprint planning, code reviews, mentoring engineers, and end-to-end client/product delivery.`,
      "",
      `Availability: ${availability} (Current base: ${location})`,
      `Portfolio: ${portfolio}`,
      `LinkedIn: ${linkedin}`,
      `Phone / WhatsApp: ${phone}`,
      "",
      `I have attached my tailored resume for your consideration. Would love to connect for an introductory discussion.`,
      "",
      `Best regards,`,
      name,
      email
    ].join("\n");
  }

  const mailtoUrl = `mailto:${encodeURIComponent(resolvedTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return {
    subject,
    body,
    to: resolvedTo,
    tone,
    portfolio,
    mailtoUrl,
    source: "smart-jd",
    extracted: {
      companyName: resolvedCompany,
      targetRole: resolvedRole,
      recruiterName: resolvedRecruiter,
      recipientEmail: resolvedTo
    }
  };
}

export async function enhanceEmailWithAI({
  jdText,
  draft,
  tailored,
  profile,
  companyName = "",
  targetRole = "",
  recruiterName = "",
  recipientEmail = "",
  tone = "standard",
  provider = "gemini",
  apiKey,
  model
}) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error("API key is required for AI email drafting.");
  }

  const resume = tailored || profile || {};
  const b = resume.basics || profile?.basics || {};
  const portfolio = b.portfolio || DEFAULT_PORTFOLIO;
  const linkedin = b.linkedin || "https://www.linkedin.com/in/parth-lunagaria";
  const phone = b.phone || "+91 91069-60267";
  const email = b.email || "parthlunagaria11@gmail.com";

  const systemInstruction = [
    "You are an autonomous job-application email writer for Parth Lunagaria, a Senior React Native & Full-Stack Engineer in India with 5+ years of experience.",
    "Given the Job Description (JD) and Parth's verified resume profile, automatically extract any details mentioned in the JD (company name, exact role title, recruiter/HR email, recruiter name, key technical priorities, work mode/location) and write a ready-to-send job application email from scratch.",
    "STRICT RULES:",
    "1. Never invent employers, degrees, metrics, or skills not present in Parth's profile.",
    `2. Always include these exact verified links/contacts in the email: Portfolio: ${portfolio}, LinkedIn: ${linkedin}, Phone: ${phone}, Email: ${email}.`,
    `3. Style requested: "${tone}" ("standard" = crisp 150-200 word HR/recruiter email with 3 JD-specific bullet highlights; "short" = punchy 80-110 word pitch for founders/managers; "followup" = polite follow-up).`,
    "4. Return ONLY valid JSON with exact keys: { \"to\": string, \"subject\": string, \"body\": string, \"companyName\": string, \"targetRole\": string, \"recruiterName\": string }."
  ].join("\n");

  const userPayload = JSON.stringify({
    overrides: {
      companyName: companyName || draft?.extracted?.companyName || "",
      targetRole: targetRole || draft?.extracted?.targetRole || "",
      recruiterName: recruiterName || draft?.extracted?.recruiterName || "",
      recipientEmail: recipientEmail || draft?.to || ""
    },
    jobDescription: (jdText || "").slice(0, 4500),
    candidateProfile: {
      basics: b,
      skills: resume.skillCategories || [],
      experiences: (resume.experiences || []).map((e) => ({
        role: e.role,
        company: e.company,
        duration: e.duration,
        bullets: e.bullets
      })),
      topProjects: (resume.projects || []).slice(0, 3).map((p) => ({
        title: p.title,
        platform: p.platform,
        tagline: p.tagline,
        bullets: p.bullets
      }))
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
        generationConfig: { temperature: 0.35, responseMimeType: "application/json" }
      })
    });
    if (!res.ok) {
      throw new Error(`Gemini API error (${res.status}): ${(await res.text()).slice(0, 250)}`);
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
        temperature: 0.35,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPayload }
        ]
      })
    });
    if (!res.ok) {
      throw new Error(`OpenAI API error (${res.status}): ${(await res.text()).slice(0, 250)}`);
    }
    const data = await res.json();
    rawText = data?.choices?.[0]?.message?.content || "";
  } else {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }

  const match = rawText.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI response did not contain valid JSON.");
  const parsed = JSON.parse(match[0]);

  const to = (recipientEmail || parsed.to || draft?.to || "").trim();
  const subject = (parsed.subject || draft?.subject || "").trim();
  let body = (parsed.body || draft?.body || "").trim();
  if (!body.includes(portfolio)) {
    body = `${body}\n\nPortfolio: ${portfolio}`;
  }

  return {
    ...(draft || {}),
    to,
    subject,
    body,
    tone,
    portfolio,
    source: "ai",
    extracted: {
      companyName: companyName || parsed.companyName || draft?.extracted?.companyName || "",
      targetRole: targetRole || parsed.targetRole || draft?.extracted?.targetRole || "",
      recruiterName: recruiterName || parsed.recruiterName || draft?.extracted?.recruiterName || "",
      recipientEmail: to
    },
    mailtoUrl: `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  };
}

export async function draftEmailAuto({
  profile,
  tailored,
  analysis,
  jdText = "",
  companyName = "",
  targetRole = "",
  recruiterName = "",
  recipientEmail = "",
  tone = "standard",
  provider = "gemini",
  apiKey = "",
  model
} = {}) {
  const baseline = generateDraftEmail({
    profile,
    tailored,
    analysis,
    jdText,
    companyName,
    targetRole,
    recruiterName,
    recipientEmail,
    tone
  });

  if (!apiKey || !apiKey.trim() || !jdText.trim()) {
    return baseline;
  }

  try {
    return await enhanceEmailWithAI({
      jdText,
      draft: baseline,
      tailored,
      profile,
      companyName,
      targetRole,
      recruiterName,
      recipientEmail,
      tone,
      provider,
      apiKey,
      model
    });
  } catch (err) {
    return {
      ...baseline,
      aiWarning: err.message
    };
  }
}
