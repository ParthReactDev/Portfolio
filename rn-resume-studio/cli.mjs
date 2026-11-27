#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { readMasterProfile, saveTexOutput, saveBinaryOutput } from "./lib/storage.mjs";
import { tailorResumeOffline, enhanceTailoredResumeWithAI } from "./lib/tailor.mjs";
import { generateOverleafLatex, sanitizeFilename } from "./lib/latex.mjs";
import { generatePdfBuffer } from "./lib/pdf.mjs";
import { draftEmailAuto } from "./lib/email.mjs";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        args[key] = true;
      } else {
        args[key] = next;
        i++;
      }
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || !args.jd) {
    console.log(`
RN Resume Studio CLI — Tailor Resume to JD & Generate Overleaf .tex

Usage:
  node cli.mjs --jd <path-to-jd.txt> [--company "Company"] [--role "Senior React Native Engineer"] [--template ats-classic|modern-teal] [--projects 4] [--ai gemini|openai] [--pdf] [--email]
`);
    process.exit(args.help ? 0 : 1);
  }

  const jdText = await fs.readFile(path.resolve(args.jd), "utf8");
  const profile = await readMasterProfile();

  const result = tailorResumeOffline(profile, {
    jdText,
    companyName: args.company || "",
    targetRole: args.role || "",
    maxProjects: args.projects ? Number(args.projects) : 4
  });

  let tailored = result.tailored;
  if (args.ai) {
    const provider = args.ai === "openai" ? "openai" : "gemini";
    const apiKey = provider === "gemini" ? process.env.GEMINI_API_KEY : process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error(`Warning: --ai ${provider} requested, but ${provider === "gemini" ? "GEMINI_API_KEY" : "OPENAI_API_KEY"} is not set. Using offline ATS engine.`);
    } else {
      tailored = await enhanceTailoredResumeWithAI({ jdText, tailored, provider, apiKey });
    }
  }

  const latex = generateOverleafLatex(tailored, {
    template: args.template || "ats-classic"
  });

  const baseName = sanitizeFilename(tailored.basics.name);
  const companySlug = sanitizeFilename(args.company || "Tailored");
  const filename = `${baseName}_${companySlug}_Resume.tex`;
  const savedPath = await saveTexOutput(filename, latex);

  let savedPdfPath = null;
  if (args.pdf) {
    const pdfBuffer = await generatePdfBuffer(tailored, {
      template: args.template || "ats-classic"
    });
    savedPdfPath = await saveBinaryOutput(`${baseName}_${companySlug}_Resume.pdf`, pdfBuffer);
  }

  let savedEmailPath = null;
  if (args.email) {
    const provider = args.ai === "openai" ? "openai" : process.env.GEMINI_API_KEY ? "gemini" : process.env.OPENAI_API_KEY ? "openai" : "gemini";
    const apiKey = provider === "gemini" ? process.env.GEMINI_API_KEY : process.env.OPENAI_API_KEY;
    const draft = await draftEmailAuto({
      profile,
      tailored,
      analysis: result.analysis,
      jdText,
      companyName: args.company || "",
      targetRole: args.role || "",
      provider,
      apiKey: apiKey || ""
    });
    const emailTxt = `To: ${draft.to || ""}\nSubject: ${draft.subject}\n\n${draft.body}\n`;
    savedEmailPath = await saveTexOutput(`${baseName}_${companySlug}_Email.txt`, emailTxt);
  }

  console.log(`\nATS Match Score: ${result.analysis.score}% (${result.analysis.matchedKeywords.length}/${result.analysis.totalDetected} JD keywords matched)`);
  console.log(`Matched: ${result.analysis.matchedKeywords.map((k) => k.label).join(", ") || "None"}`);
  console.log(`Missing (Gaps): ${result.analysis.missingKeywords.map((k) => k.label).join(", ") || "None"}`);
  console.log(`Top Projects Selected: ${tailored.projects.map((p) => p.title).join(", ")}`);
  console.log(`\nSaved Overleaf LaTeX file:\n  ${savedPath}`);
  if (savedPdfPath) {
    console.log(`Saved PDF file:\n  ${savedPdfPath}`);
  }
  if (savedEmailPath) {
    console.log(`Saved Draft Email file:\n  ${savedEmailPath}`);
  }
  console.log("");
}

main().catch((err) => {
  console.error("CLI failed:", err.message);
  process.exit(1);
});
