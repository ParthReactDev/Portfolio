# RN Resume Studio

Standalone local web app & CLI for applying to recent **React Native** jobs in India, tailoring Parth Lunagaria's resume to a Job Description (JD), and exporting **Overleaf-ready LaTeX (`.tex`)**.

## Features

- **Latest Master Profile (`data/master-profile.json`)**: Pre-loaded with your latest portfolio data (Self-Employed July 2026–Present, Farmer B2B & B2C Portal, OneClick IT Consultancy, Alpha E Barcode Solutions, React Native New Architecture, Kotlin/Swift Native Modules, Next.js, BLE, Razorpay, etc.).
- **Hybrid JD Tailoring Engine**:
  - **Offline ATS Mode**: Extracts React Native & mobile engineering keywords from any JD, computes ATS match score, flags honest missing gaps, reorders skill categories, ranks experience bullets, selects the top relevant projects, and generates a tailored summary.
  - **Optional AI Polish**: Plug in a Gemini or OpenAI key in the UI (stored locally in `localStorage`) or via `GEMINI_API_KEY` / `OPENAI_API_KEY` env var to refine bullet phrasing without fabricating facts.
- **Overleaf & PDF Export**:
  - Live A4 preview + raw `.tex` viewer (`ATS Classic` and `Modern Teal` templates).
  - 1-click **Open in Overleaf**, **Copy `.tex`**, **Download `.tex`**, **Download PDF** (direct `.pdf` export via headless Edge/Chrome with clean `@media print` fallback), or **Save to `output/`**.
- **Autonomous AI Draft Email**: Automatically extracts company, role, recruiter name, and HR email directly from the JD, drafts the complete email using Gemini/OpenAI AI whenever an API key is configured (with smart JD-extracted fallback when offline), and includes your portfolio (`https://parth-lunagaria-portfolio.vercel.app/`), LinkedIn, phone, and 1-click Copy / `mailto:` launch.
- **Recent India React Native Jobs**: Date-sorted search links for LinkedIn India, Naukri, Instahyre, Wellfound, Hirist, and Cutshort, plus sample Indian JDs.
- **Local Application Tracker**: Saves applied/tailored jobs in `data/applications.json`.

## Run the Web Studio

```powershell
cd "d:\Next JS Project\parth-portfolio\rn-resume-studio"
node server.mjs
```

Open `http://127.0.0.1:4321` in your browser.

## Run via CLI

```powershell
cd "d:\Next JS Project\parth-portfolio\rn-resume-studio"
node cli.mjs --jd path\to\jd.txt --company "Razorpay" --role "Senior React Native Engineer" --pdf --email
```

## Run Tests

```powershell
cd "d:\Next JS Project\parth-portfolio\rn-resume-studio"
node --test tests\studio.test.mjs
```
