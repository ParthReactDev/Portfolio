import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";

const execFileAsync = promisify(execFile);

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderPrintableResumeHtml(resume, options = {}) {
  const template = options.template === "modern-teal" ? "modern-teal" : "ats-classic";
  const accentColor = template === "modern-teal" ? "#0f766e" : "#111827";
  const linkColor = template === "modern-teal" ? "#0e7490" : "#1d4ed8";

  const b = resume.basics || {};
  const skills = resume.skillCategories || [];
  const experiences = resume.experiences || [];
  const projects = resume.projects || [];
  const education = resume.education || [];

  const phoneHref = `tel:${(b.phone || "").replace(/[^+\d]/g, "")}`;
  const linkedinHref = b.linkedin || "https://www.linkedin.com/in/parth-lunagaria";
  const linkedinLabel = b.linkedinLabel || linkedinHref.replace(/^https?:\/\/(www\.)?/, "");

  const skillsHtml = skills
    .filter((c) => (c.skills || []).length > 0)
    .map(
      (c) =>
        `<div class="skill-row"><strong>${escapeHtml(c.title)}:</strong> ${escapeHtml(c.skills.join(", "))}</div>`
    )
    .join("\n");

  const expHtml = experiences
    .map(
      (exp) => `
      <div class="entry">
        <div class="row"><strong>${escapeHtml(exp.role)}</strong><span>${escapeHtml(exp.duration)}</span></div>
        <div class="subrow"><span>${escapeHtml(exp.company)}</span><span>${escapeHtml(exp.location)}</span></div>
        <ul>${(exp.bullets || []).filter(Boolean).map((pt) => `<li>${escapeHtml(pt)}</li>`).join("")}</ul>
      </div>`
    )
    .join("\n");

  const projHtml = projects
    .map(
      (proj) => `
      <div class="entry">
        <div class="row"><span><strong>${escapeHtml(proj.title)}</strong> | <em>${escapeHtml(proj.platform || "")}</em></span><em>${escapeHtml(proj.tagline || "")}</em></div>
        <ul>${(proj.bullets || []).filter(Boolean).map((pt) => `<li>${escapeHtml(pt)}</li>`).join("")}</ul>
      </div>`
    )
    .join("\n");

  const eduHtml = education
    .map(
      (edu) => `
      <div class="entry">
        <div class="row"><strong>${escapeHtml(edu.institution)}</strong><span>${escapeHtml(edu.duration)}</span></div>
        <div class="subrow"><span>${escapeHtml(edu.degree)}</span><span>${escapeHtml(edu.location)}</span></div>
      </div>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(b.name || "Resume")} - Resume</title>
<style>
  @page {
    size: letter portrait;
    margin: 0.45in 0.5in;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: "Georgia", "Times New Roman", serif;
    color: #111827;
    font-size: 10pt;
    line-height: 1.32;
  }
  a { color: ${linkColor}; text-decoration: none; }
  .header { text-align: center; margin-bottom: 8px; }
  .name {
    font-size: 19pt;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${accentColor};
    margin: 0;
  }
  .headline {
    font-size: 10pt;
    font-weight: 700;
    margin-top: 2px;
  }
  .contact {
    font-size: 9pt;
    color: #374151;
    margin-top: 3px;
  }
  .section-title {
    font-size: 10.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${accentColor};
    border-bottom: 1.2px solid ${accentColor};
    padding-bottom: 2px;
    margin: 9px 0 5px;
    page-break-after: avoid;
  }
  .summary { font-size: 9.5pt; margin-bottom: 4px; }
  .skill-row { font-size: 9.4pt; margin-bottom: 2px; }
  .entry { margin-bottom: 6px; page-break-inside: avoid; }
  .row { display: flex; justify-content: space-between; gap: 10px; font-size: 9.6pt; }
  .subrow { display: flex; justify-content: space-between; gap: 10px; font-size: 9pt; font-style: italic; color: #374151; }
  ul { margin: 2px 0 0; padding-left: 15px; }
  li { font-size: 9.3pt; margin-bottom: 2px; }
  .langs { font-size: 9.3pt; margin-top: 4px; }
</style>
</head>
<body>
  <div class="header">
    <h1 class="name">${escapeHtml(b.name || "Parth Lunagaria")}</h1>
    <div class="headline">${escapeHtml(b.headline || "Senior Software Engineer")}</div>
    <div class="contact">
      ${escapeHtml(b.location || "")} |
      <a href="${escapeHtml(phoneHref)}">${escapeHtml(b.phone || "")}</a> |
      <a href="mailto:${escapeHtml(b.email || "")}">${escapeHtml(b.email || "")}</a> |
      <a href="${escapeHtml(linkedinHref)}">${escapeHtml(linkedinLabel)}</a>
    </div>
  </div>

  <div class="section-title">Professional Summary</div>
  <div class="summary">${escapeHtml(b.summary || "")}</div>

  <div class="section-title">Technical Skills</div>
  <div>${skillsHtml}</div>

  <div class="section-title">Work Experience</div>
  <div>${expHtml}</div>

  <div class="section-title">Key Projects</div>
  <div>${projHtml}</div>

  <div class="section-title">Education</div>
  <div>${eduHtml}</div>
  ${Array.isArray(b.languages) && b.languages.length > 0 ? `<div class="langs"><strong>Languages:</strong> ${escapeHtml(b.languages.join(", "))}</div>` : ""}
</body>
</html>`;
}

async function findExecutable(candidates) {
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (path.isAbsolute(candidate)) {
      try {
        await fs.access(candidate);
        return candidate;
      } catch {
        continue;
      }
    }
    try {
      const cmd = process.platform === "win32" ? "where" : "which";
      const { stdout } = await execFileAsync(cmd, [candidate], { timeout: 3000 });
      const first = stdout.split(/\r?\n/).find((l) => l.trim());
      if (first) return first.trim();
    } catch {
      // keep searching
    }
  }
  return null;
}

export async function findBrowserBinary() {
  return findExecutable([
    process.env.RESUME_PDF_BROWSER,
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "msedge",
    "chrome",
    "google-chrome",
    "chromium"
  ]);
}

export async function generatePdfBuffer(resume, options = {}) {
  const browserPath = await findBrowserBinary();
  if (!browserPath) {
    throw new Error("No headless Edge/Chrome binary found on this machine. Use the browser Print-to-PDF fallback.");
  }

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "rn-resume-pdf-"));
  const htmlPath = path.join(tmpDir, "resume.html");
  const pdfPath = path.join(tmpDir, "resume.pdf");
  const profileDir = path.join(tmpDir, "profile");

  try {
    const html = renderPrintableResumeHtml(resume, options);
    await fs.writeFile(htmlPath, html, "utf8");

    const fileUrl = pathToFileURL(htmlPath).href;
    await execFileAsync(
      browserPath,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        `--user-data-dir=${profileDir}`,
        "--no-first-run",
        "--disable-extensions",
        "--print-to-pdf-no-header",
        `--print-to-pdf=${pdfPath}`,
        fileUrl
      ],
      { timeout: 30000 }
    );

    const pdfBuffer = await fs.readFile(pdfPath);
    if (!pdfBuffer || pdfBuffer.length < 100 || !pdfBuffer.subarray(0, 5).toString("ascii").startsWith("%PDF-")) {
      throw new Error("Generated file is not a valid PDF.");
    }
    return pdfBuffer;
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}
