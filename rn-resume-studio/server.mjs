import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import {
  STUDIO_ROOT,
  readMasterProfile,
  writeMasterProfile,
  readApplications,
  writeApplications,
  saveTexOutput,
  saveBinaryOutput
} from "./lib/storage.mjs";
import { tailorResumeOffline, enhanceTailoredResumeWithAI } from "./lib/tailor.mjs";
import { generateOverleafLatex, sanitizeFilename } from "./lib/latex.mjs";
import { generatePdfBuffer } from "./lib/pdf.mjs";
import { draftEmailAuto, enhanceEmailWithAI } from "./lib/email.mjs";
import { INDIA_LOCATIONS, SAMPLE_INDIAN_JDS, buildIndiaJobLinks } from "./lib/jobs-india.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(STUDIO_ROOT, "public");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".tex": "application/x-tex; charset=utf-8",
  ".svg": "image/svg+xml"
};

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

async function readJsonBody(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > 2 * 1024 * 1024) {
      throw new Error("Request body too large");
    }
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

export function createStudioServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    const pathname = url.pathname;

    try {
      // API Routes
      if (pathname === "/api/health" && req.method === "GET") {
        return sendJson(res, 200, { ok: true, service: "rn-resume-studio" });
      }

      if (pathname === "/api/profile" && req.method === "GET") {
        const profile = await readMasterProfile();
        return sendJson(res, 200, { profile });
      }

      if (pathname === "/api/profile" && req.method === "PUT") {
        const body = await readJsonBody(req);
        if (!body?.profile?.basics) {
          return sendJson(res, 400, { error: "Invalid profile payload" });
        }
        const saved = await writeMasterProfile(body.profile);
        return sendJson(res, 200, { profile: saved });
      }

      if (pathname === "/api/jobs-india" && req.method === "GET") {
        const query = url.searchParams.get("query") || "React Native Developer";
        const locationId = url.searchParams.get("location") || "india-all";
        const freshnessDays = Number(url.searchParams.get("days") || "7");
        const remoteOnly = url.searchParams.get("remote") === "true";

        return sendJson(res, 200, {
          locations: INDIA_LOCATIONS,
          links: buildIndiaJobLinks({ query, locationId, freshnessDays, remoteOnly }),
          sampleJds: SAMPLE_INDIAN_JDS
        });
      }

      if (pathname === "/api/tailor" && req.method === "POST") {
        const body = await readJsonBody(req);
        const profile = body.profile || (await readMasterProfile());
        const result = tailorResumeOffline(profile, {
          jdText: body.jdText || "",
          targetRole: body.targetRole || "",
          companyName: body.companyName || "",
          maxProjects: typeof body.maxProjects === "number" ? body.maxProjects : 4
        });
        const latex = generateOverleafLatex(result.tailored, {
          template: body.template || "ats-classic"
        });

        const provider = body.provider || (process.env.GEMINI_API_KEY ? "gemini" : process.env.OPENAI_API_KEY ? "openai" : "gemini");
        const envKey = provider === "gemini" ? process.env.GEMINI_API_KEY : process.env.OPENAI_API_KEY;
        const apiKey = body.autoAi === false ? "" : body.apiKey || envKey || "";

        const emailDraft = await draftEmailAuto({
          profile,
          tailored: result.tailored,
          analysis: result.analysis,
          jdText: body.jdText || "",
          companyName: body.companyName || "",
          targetRole: body.targetRole || "",
          recruiterName: body.recruiterName || "",
          recipientEmail: body.recipientEmail || "",
          tone: body.emailTone || "standard",
          provider,
          apiKey,
          model: body.model
        });
        return sendJson(res, 200, {
          analysis: result.analysis,
          tailored: result.tailored,
          latex,
          emailDraft
        });
      }

      if (pathname === "/api/draft-email" && req.method === "POST") {
        const body = await readJsonBody(req);
        const profile = body.profile || (await readMasterProfile());
        const provider = body.provider || (process.env.GEMINI_API_KEY ? "gemini" : process.env.OPENAI_API_KEY ? "openai" : "gemini");
        const envKey = provider === "gemini" ? process.env.GEMINI_API_KEY : process.env.OPENAI_API_KEY;
        const apiKey = body.apiKey || envKey || "";

        if (body.requireAi && !apiKey) {
          return sendJson(res, 400, {
            error: `No ${provider.toUpperCase()} API key provided. Enter one in AI Settings or set ${provider === "gemini" ? "GEMINI_API_KEY" : "OPENAI_API_KEY"} in the environment.`
          });
        }

        const emailDraft = await draftEmailAuto({
          profile,
          tailored: body.tailored || profile,
          analysis: body.analysis,
          jdText: body.jdText || "",
          companyName: body.companyName || "",
          targetRole: body.targetRole || "",
          recruiterName: body.recruiterName || "",
          recipientEmail: body.recipientEmail || "",
          tone: body.tone || "standard",
          provider,
          apiKey,
          model: body.model
        });

        return sendJson(res, 200, { emailDraft });
      }

      if (pathname === "/api/ai-enhance" && req.method === "POST") {
        const body = await readJsonBody(req);
        const provider = body.provider || "gemini";
        const envKey =
          provider === "gemini"
            ? process.env.GEMINI_API_KEY
            : process.env.OPENAI_API_KEY;
        const apiKey = body.apiKey || envKey;

        if (!apiKey) {
          return sendJson(res, 400, {
            error: `No ${provider.toUpperCase()} API key provided. Enter one in AI Settings or set ${provider === "gemini" ? "GEMINI_API_KEY" : "OPENAI_API_KEY"} in the environment.`
          });
        }

        const profile = body.profile || (await readMasterProfile());
        const enhanced = await enhanceTailoredResumeWithAI({
          jdText: body.jdText || "",
          tailored: body.tailored,
          provider,
          apiKey,
          model: body.model
        });
        const latex = generateOverleafLatex(enhanced, {
          template: body.template || "ats-classic"
        });
        const emailDraft = await draftEmailAuto({
          profile,
          tailored: enhanced,
          analysis: body.analysis,
          jdText: body.jdText || "",
          companyName: body.companyName || "",
          targetRole: body.targetRole || "",
          recruiterName: body.recruiterName || "",
          recipientEmail: body.recipientEmail || "",
          tone: body.emailTone || "standard",
          provider,
          apiKey,
          model: body.model
        });
        return sendJson(res, 200, { tailored: enhanced, latex, emailDraft });
      }

      if (pathname === "/api/latex" && req.method === "POST") {
        const body = await readJsonBody(req);
        if (!body.resume) {
          return sendJson(res, 400, { error: "Missing resume payload" });
        }
        const latex = generateOverleafLatex(body.resume, {
          template: body.template || "ats-classic"
        });

        let savedPath = null;
        let filename = null;
        if (body.saveToDisk) {
          const baseName = sanitizeFilename(body.resume?.basics?.name || "Parth_Lunagaria");
          const companySlug = sanitizeFilename(body.companyName || "Tailored");
          filename = `${baseName}_${companySlug}_Resume.tex`;
          savedPath = await saveTexOutput(filename, latex);
        }

        return sendJson(res, 200, { latex, filename, savedPath });
      }

      if (pathname === "/api/pdf" && req.method === "POST") {
        const body = await readJsonBody(req);
        if (!body.resume) {
          return sendJson(res, 400, { error: "Missing resume payload" });
        }
        const pdfBuffer = await generatePdfBuffer(body.resume, {
          template: body.template || "ats-classic"
        });
        const baseName = sanitizeFilename(body.resume?.basics?.name || "Parth_Lunagaria");
        const companySlug = sanitizeFilename(body.companyName || "Tailored");
        const filename = `${baseName}_${companySlug}_Resume.pdf`;
        if (body.saveToDisk) {
          await saveBinaryOutput(filename, pdfBuffer);
        }
        res.writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": pdfBuffer.length
        });
        return res.end(pdfBuffer);
      }

      if (pathname === "/api/applications" && req.method === "GET") {
        const applications = await readApplications();
        return sendJson(res, 200, { applications });
      }

      if (pathname === "/api/applications" && req.method === "POST") {
        const body = await readJsonBody(req);
        const applications = await readApplications();
        const entry = {
          id: body.id || crypto.randomUUID(),
          company: body.company || "Untitled Company",
          role: body.role || "React Native Developer",
          location: body.location || "India",
          portal: body.portal || "LinkedIn / Naukri",
          jobUrl: body.jobUrl || "",
          matchScore: typeof body.matchScore === "number" ? body.matchScore : null,
          status: body.status || "Tailored",
          texFile: body.texFile || "",
          jdSnippet: (body.jdText || "").slice(0, 500),
          updatedAt: new Date().toISOString()
        };

        const idx = applications.findIndex((a) => a.id === entry.id);
        if (idx >= 0) {
          applications[idx] = { ...applications[idx], ...entry };
        } else {
          applications.unshift(entry);
        }

        await writeApplications(applications);
        return sendJson(res, 200, { entry, applications });
      }

      if (pathname.startsWith("/api/applications/") && req.method === "DELETE") {
        const id = decodeURIComponent(pathname.slice("/api/applications/".length));
        const applications = await readApplications();
        const next = applications.filter((a) => a.id !== id);
        await writeApplications(next);
        return sendJson(res, 200, { applications: next });
      }

      // Static files
      let filePath = path.join(PUBLIC_DIR, pathname === "/" ? "index.html" : pathname);
      const normalized = path.normalize(filePath);
      if (!normalized.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        return res.end("Forbidden");
      }

      try {
        const stat = await fs.stat(normalized);
        if (stat.isDirectory()) {
          filePath = path.join(normalized, "index.html");
        }
        const content = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          "Content-Type": MIME_TYPES[ext] || "application/octet-stream"
        });
        return res.end(content);
      } catch {
        res.writeHead(404);
        return res.end("Not Found");
      }
    } catch (err) {
      return sendJson(res, 500, { error: err?.message || "Internal Server Error" });
    }
  });
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const port = Number(process.env.PORT || 4321);
  const host = process.env.HOST || "127.0.0.1";
  const server = createStudioServer();
  server.listen(port, host, () => {
    console.log(`RN Resume Studio running at http://${host}:${port}`);
  });
}
