import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { readMasterProfile } from "../lib/storage.mjs";
import { tailorResumeOffline, extractKeywords } from "../lib/tailor.mjs";
import { generateOverleafLatex, escapeLatex } from "../lib/latex.mjs";
import { renderPrintableResumeHtml, generatePdfBuffer } from "../lib/pdf.mjs";
import { generateDraftEmail, extractJdEmailMetadata } from "../lib/email.mjs";
import { buildIndiaJobLinks, SAMPLE_INDIAN_JDS } from "../lib/jobs-india.mjs";
import { createStudioServer } from "../server.mjs";

async function invokeServer(server, { method = "GET", url = "/", body = null } = {}) {
  const payload = body ? JSON.stringify(body) : null;
  const req = Readable.from(payload ? [Buffer.from(payload, "utf8")] : []);
  req.method = method;
  req.url = url;
  req.headers = payload ? { "content-type": "application/json" } : {};

  return await new Promise((resolve, reject) => {
    const chunks = [];
    let statusCode = 200;
    let headers = {};
    const res = {
      writeHead(code, hdrs = {}) {
        statusCode = code;
        headers = hdrs;
      },
      end(chunk) {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
        const buffer = Buffer.concat(chunks);
        const text = buffer.toString("utf8");
        resolve({ status: statusCode, headers, buffer, text, json: () => JSON.parse(text) });
      }
    };
    server.emit("request", req, res);
    setTimeout(() => reject(new Error(`Timeout on ${method} ${url}`)), 30000).unref();
  });
}

test("escapeLatex escapes special LaTeX characters safely", () => {
  const input = "React Native & Next.js — 100% $50 #1 _test {a} ~ ^ \\";
  const escaped = escapeLatex(input);
  assert.match(escaped, /\\&/);
  assert.match(escaped, /\\%/);
  assert.match(escaped, /\\\$/);
  assert.match(escaped, /\\#/);
  assert.match(escaped, /\\_/);
  assert.match(escaped, /\\\{a\\\}/);
  assert.match(escaped, /--/);
  assert.match(escaped, /\\textbackslash\{\}/);
});

test("tailorResumeOffline matches JD keywords, ranks BLE project for IoT JD, and flags missing gaps", async () => {
  const profile = await readMasterProfile();
  const iotJd = SAMPLE_INDIAN_JDS.find((j) => j.id === "iot-healthtech-pune");
  const { analysis, tailored } = tailorResumeOffline(profile, {
    jdText: `${iotJd.jd}\nNice to have: Detox E2E testing`,
    companyName: iotJd.company,
    targetRole: iotJd.role,
    maxProjects: 3
  });

  assert.ok(analysis.score > 60, `Expected ATS score > 60, got ${analysis.score}`);
  assert.ok(analysis.matchedKeywords.some((k) => k.id === "ble"));
  assert.ok(analysis.matchedKeywords.some((k) => k.id === "native-modules"));
  assert.ok(analysis.missingKeywords.some((k) => k.id === "testing"));
  assert.equal(tailored.projects.length, 3);
  assert.equal(tailored.projects[0].id, "proj-reqsq");
  assert.equal(tailored.basics.headline, iotJd.role);
});

test("generateOverleafLatex produces complete Overleaf-compilable document", async () => {
  const profile = await readMasterProfile();
  const { tailored } = tailorResumeOffline(profile, {
    jdText: SAMPLE_INDIAN_JDS[0].jd,
    companyName: "Razorpay",
    targetRole: "Senior React Native Engineer"
  });

  const tex = generateOverleafLatex(tailored, { template: "modern-teal" });
  assert.match(tex, /\\documentclass\[letterpaper,10\.5pt\]\{article\}/);
  assert.match(tex, /\\begin\{document\}/);
  assert.match(tex, /\\end\{document\}/);
  assert.match(tex, /Parth Lunagaria/);
  assert.match(tex, /Self-Employed/);
  assert.ok(!tex.includes("undefined"), "LaTeX output must not contain undefined");
});

test("buildIndiaJobLinks creates recent India React Native job URLs", () => {
  const links = buildIndiaJobLinks({
    query: "React Native",
    locationId: "bengaluru",
    freshnessDays: 3,
    remoteOnly: true
  });
  assert.equal(links.length, 6);
  const linkedin = links.find((l) => l.portal === "LinkedIn India");
  const naukri = links.find((l) => l.portal === "Naukri.com");
  assert.ok(linkedin.url.includes("Bengaluru"));
  assert.ok(linkedin.url.includes("f_WT=2"));
  assert.ok(naukri.url.includes("jobs-in-bengaluru"));
});

test("HTTP server serves UI and API endpoints cleanly", async () => {
  const server = createStudioServer();

  const health = (await invokeServer(server, { url: "/api/health" })).json();
  assert.equal(health.ok, true);

  const html = (await invokeServer(server, { url: "/" })).text;
  assert.match(html, /RN Resume Studio/);

  const profileRes = (await invokeServer(server, { url: "/api/profile" })).json();
  assert.equal(profileRes.profile.basics.name, "Parth Lunagaria");

  const tailorRes = (
    await invokeServer(server, {
      method: "POST",
      url: "/api/tailor",
      body: {
        jdText: SAMPLE_INDIAN_JDS[2].jd,
        companyName: "BharatSupply",
        targetRole: "Senior Software Engineer (React Native & Next.js)",
        maxProjects: 4
      }
    })
  ).json();

  assert.ok(tailorRes.analysis.score >= 70);
  assert.match(tailorRes.latex, /\\begin\{document\}/);
  assert.equal(tailorRes.tailored.projects[0].id, "proj-farmer");
});

test("extractKeywords ignores false substring matches", () => {
  const profile = { basics: {}, skillCategories: [], experiences: [], projects: [] };
  const result = extractKeywords("We value strong communication and charts.", profile);
  assert.ok(!result.matchedKeywords.some((k) => k.id === "typescript"));
  assert.ok(!result.missingKeywords.some((k) => k.id === "typescript"));
});

test("renderPrintableResumeHtml and /api/pdf generate valid PDF resume", async () => {
  const profile = await readMasterProfile();
  const { tailored } = tailorResumeOffline(profile, {
    jdText: SAMPLE_INDIAN_JDS[0].jd,
    companyName: "Razorpay",
    targetRole: "Senior React Native Engineer"
  });

  const html = renderPrintableResumeHtml(tailored, { template: "modern-teal" });
  assert.match(html, /Parth Lunagaria/);
  assert.match(html, /Senior React Native Engineer/);
  assert.match(html, /@page/);

  const pdfBuffer = await generatePdfBuffer(tailored, { template: "ats-classic" });
  assert.equal(pdfBuffer.subarray(0, 5).toString("ascii"), "%PDF-");

  const server = createStudioServer();
  const pdfRes = await invokeServer(server, {
    method: "POST",
    url: "/api/pdf",
    body: {
      resume: tailored,
      template: "ats-classic",
      companyName: "Razorpay"
    }
  });
  assert.equal(pdfRes.status, 200);
  assert.equal(pdfRes.headers["Content-Type"], "application/pdf");
  assert.equal(pdfRes.buffer.subarray(0, 5).toString("ascii"), "%PDF-");
});

test("master profile excludes removed CSS/UI skills and draft email includes portfolio URL", async () => {
  const profile = await readMasterProfile();
  const allSkills = profile.skillCategories.flatMap((c) => c.skills);
  assert.ok(!allSkills.includes("Tailwind CSS"));
  assert.ok(!allSkills.includes("HTML5 / CSS3"));
  assert.ok(!allSkills.includes("Responsive & Adaptive Mobile UI"));
  assert.equal(profile.basics.portfolio, "https://parth-lunagaria-portfolio.vercel.app/");

  const { analysis, tailored } = tailorResumeOffline(profile, {
    jdText: SAMPLE_INDIAN_JDS[0].jd,
    companyName: "Razorpay",
    targetRole: "Senior React Native Engineer"
  });

  const draft = generateDraftEmail({
    profile,
    tailored,
    analysis,
    companyName: "Razorpay",
    targetRole: "Senior React Native Engineer",
    recruiterName: "Priya",
    recipientEmail: "priya@razorpay.com",
    tone: "standard"
  });

  assert.match(draft.subject, /Razorpay/);
  assert.match(draft.body, /https:\/\/parth-lunagaria-portfolio\.vercel\.app\//);
  assert.match(draft.body, /Hi Priya,/);
  assert.ok(draft.mailtoUrl.startsWith("mailto:priya%40razorpay.com"));

  const server = createStudioServer();
  const res = await invokeServer(server, {
    method: "POST",
    url: "/api/draft-email",
    body: {
      tailored,
      analysis,
      companyName: "Razorpay",
      targetRole: "Senior React Native Engineer",
      tone: "short"
    }
  });
  assert.equal(res.status, 200);
  const data = res.json();
  assert.match(data.emailDraft.body, /https:\/\/parth-lunagaria-portfolio\.vercel\.app\//);
});

test("extractJdEmailMetadata auto-extracts recruiter email, company, and role from raw JD", async () => {
  const rawJd = `
    Company: Zepto Technologies
    Role: Lead React Native Developer
    We are hiring an experienced engineer in Bengaluru.
    Contact: Ananya Verma (talent@zeptonow.com)
  `;
  const meta = extractJdEmailMetadata(rawJd);
  assert.equal(meta.companyName, "Zepto Technologies");
  assert.equal(meta.targetRole, "Lead React Native Developer");
  assert.equal(meta.recruiterName, "Ananya Verma");
  assert.equal(meta.recipientEmail, "talent@zeptonow.com");

  const profile = await readMasterProfile();
  const { analysis, tailored } = tailorResumeOffline(profile, { jdText: rawJd });
  const autoDraft = generateDraftEmail({ profile, tailored, analysis, jdText: rawJd });
  assert.equal(autoDraft.to, "talent@zeptonow.com");
  assert.match(autoDraft.subject, /Zepto Technologies/);
  assert.match(autoDraft.body, /Hi Ananya Verma,/);
  assert.match(autoDraft.body, /https:\/\/parth-lunagaria-portfolio\.vercel\.app\//);
});
