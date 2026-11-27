const state = {
  masterProfile: null,
  tailored: null,
  analysis: null,
  latex: "",
  sampleJds: [],
  locations: [],
  applications: []
};

const els = {
  tabs: document.querySelectorAll(".tab"),
  panels: document.querySelectorAll(".tab-panel"),
  sampleJdSelect: document.getElementById("sample-jd-select"),
  companyInput: document.getElementById("company-input"),
  roleInput: document.getElementById("role-input"),
  portalInput: document.getElementById("portal-input"),
  jobUrlInput: document.getElementById("job-url-input"),
  maxProjectsSelect: document.getElementById("max-projects-select"),
  jdInput: document.getElementById("jd-input"),
  aiProvider: document.getElementById("ai-provider"),
  aiModel: document.getElementById("ai-model"),
  aiKey: document.getElementById("ai-key"),
  btnTailor: document.getElementById("btn-tailor"),
  btnAiEnhance: document.getElementById("btn-ai-enhance"),
  btnSaveApp: document.getElementById("btn-save-app"),
  atsScorePill: document.getElementById("ats-score-pill"),
  matchedChips: document.getElementById("matched-chips"),
  missingChips: document.getElementById("missing-chips"),
  editHeadline: document.getElementById("edit-headline"),
  editSummary: document.getElementById("edit-summary"),
  editSkillsContainer: document.getElementById("edit-skills-container"),
  editExperiencesContainer: document.getElementById("edit-experiences-container"),
  editProjectsContainer: document.getElementById("edit-projects-container"),
  btnRegenerateLatex: document.getElementById("btn-regenerate-latex"),
  switchBtns: document.querySelectorAll(".switch-btn"),
  viewPreview: document.getElementById("view-preview"),
  viewLatex: document.getElementById("view-latex"),
  viewEmail: document.getElementById("view-email"),
  latexCode: document.getElementById("latex-code"),
  emailTone: document.getElementById("email-tone"),
  emailRecruiter: document.getElementById("email-recruiter"),
  emailTo: document.getElementById("email-to"),
  emailSubject: document.getElementById("email-subject"),
  emailBody: document.getElementById("email-body"),
  emailSourcePill: document.getElementById("email-source-pill"),
  btnAiEmail: document.getElementById("btn-ai-email"),
  btnCopySubject: document.getElementById("btn-copy-subject"),
  btnCopyEmail: document.getElementById("btn-copy-email"),
  btnOpenMailto: document.getElementById("btn-open-mailto"),
  templateSelect: document.getElementById("template-select"),
  btnCopyLatex: document.getElementById("btn-copy-latex"),
  btnDownloadLatex: document.getElementById("btn-download-latex"),
  btnDownloadPdf: document.getElementById("btn-download-pdf"),
  btnSaveDisk: document.getElementById("btn-save-disk"),
  btnOpenOverleaf: document.getElementById("btn-open-overleaf"),
  statusBanner: document.getElementById("status-banner"),
  jobQuery: document.getElementById("job-query"),
  jobLocation: document.getElementById("job-location"),
  jobDays: document.getElementById("job-days"),
  jobRemote: document.getElementById("job-remote"),
  portalCards: document.getElementById("portal-cards"),
  sampleJdCards: document.getElementById("sample-jd-cards"),
  trackerCount: document.getElementById("tracker-count"),
  trackerTbody: document.getElementById("tracker-tbody"),
  masterProfileJson: document.getElementById("master-profile-json"),
  btnFormatProfile: document.getElementById("btn-format-profile"),
  btnSaveProfile: document.getElementById("btn-save-profile"),
  overleafForm: document.getElementById("overleaf-form"),
  overleafSnip: document.getElementById("overleaf-snip"),
  overleafSnipName: document.getElementById("overleaf-snip-name")
};

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showStatus(msg, isError = false) {
  els.statusBanner.textContent = msg;
  els.statusBanner.classList.remove("hidden", "error");
  if (isError) els.statusBanner.classList.add("error");
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

function sanitizeFileSlug(str) {
  return (str || "Resume")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 50);
}

function getExportBasename() {
  const nameSlug = sanitizeFileSlug(state.tailored?.basics?.name || "Parth_Lunagaria");
  const companySlug = sanitizeFileSlug(els.companyInput.value.trim() || "Tailored");
  return `${nameSlug}_${companySlug}_Resume`;
}

function getExportFilename() {
  return `${getExportBasename()}.tex`;
}

// Tabs navigation
els.tabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    els.tabs.forEach((t) => t.classList.remove("active"));
    els.panels.forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
  });
});

// Preview vs LaTeX vs Draft Email switch
els.switchBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    els.switchBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const view = btn.dataset.view;
    els.viewPreview.classList.toggle("hidden", view !== "preview");
    els.viewLatex.classList.toggle("hidden", view !== "latex");
    els.viewEmail.classList.toggle("hidden", view !== "email");
  });
});

function updateMailtoHref() {
  const to = encodeURIComponent(els.emailTo.value.trim());
  const subject = encodeURIComponent(els.emailSubject.value);
  const body = encodeURIComponent(els.emailBody.value);
  els.btnOpenMailto.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

function applyEmailDraft(draft) {
  if (!draft) return;
  if (draft.extracted) {
    if (!els.companyInput.value.trim() && draft.extracted.companyName) {
      els.companyInput.value = draft.extracted.companyName;
    }
    if (!els.roleInput.value.trim() && draft.extracted.targetRole) {
      els.roleInput.value = draft.extracted.targetRole;
    }
    if (!els.emailRecruiter.value.trim() && draft.extracted.recruiterName) {
      els.emailRecruiter.value = draft.extracted.recruiterName;
    }
    if (!els.emailTo.value.trim() && draft.extracted.recipientEmail) {
      els.emailTo.value = draft.extracted.recipientEmail;
    }
  }
  els.emailSubject.value = draft.subject || "";
  els.emailBody.value = draft.body || "";
  if (els.emailSourcePill) {
    els.emailSourcePill.textContent =
      draft.source === "ai"
        ? "AI-Drafted from JD"
        : "Auto-Drafted from JD (Smart Fallback)";
  }
  updateMailtoHref();
}

function renderAnalysis() {
  const a = state.analysis;
  if (!a) return;
  els.atsScorePill.textContent = `ATS Match: ${a.score}% (${a.matchedKeywords.length}/${a.totalDetected})`;

  els.matchedChips.innerHTML =
    a.matchedKeywords.length > 0
      ? a.matchedKeywords.map((k) => `<span class="chip chip-match">${escapeHtml(k.label)}</span>`).join("")
      : `<span class="hint">Paste a JD and click Tailor Resume to see matched keywords.</span>`;

  els.missingChips.innerHTML =
    a.missingKeywords.length > 0
      ? a.missingKeywords.map((k) => `<span class="chip chip-miss">${escapeHtml(k.label)}</span>`).join("")
      : `<span class="hint">No keyword gaps detected for this JD.</span>`;
}

function renderInlineEditors() {
  const r = state.tailored;
  if (!r) return;

  els.editHeadline.value = r.basics.headline || "";
  els.editSummary.value = r.basics.summary || "";

  // Skills editor
  els.editSkillsContainer.innerHTML = `<div class="sub-label">Skill Categories (Comma-separated, ordered by JD match)</div>` +
    r.skillCategories
      .map(
        (cat, idx) => `
      <div class="editor-block">
        <div class="editor-block-head"><span>${escapeHtml(cat.title)}</span></div>
        <input type="text" class="skill-cat-input" data-idx="${idx}" value="${escapeHtml(cat.skills.join(", "))}" />
      </div>`
      )
      .join("");

  // Experiences editor
  els.editExperiencesContainer.innerHTML = `<div class="sub-label">Work Experience Bullets (One bullet per line)</div>` +
    r.experiences
      .map(
        (exp, idx) => `
      <div class="editor-block">
        <div class="editor-block-head">
          <span>${escapeHtml(exp.role)} — ${escapeHtml(exp.company)}</span>
          <span class="hint">${escapeHtml(exp.duration)}</span>
        </div>
        <textarea rows="4" class="exp-bullets-input" data-idx="${idx}">${escapeHtml(exp.bullets.join("\n"))}</textarea>
      </div>`
      )
      .join("");

  // Projects editor
  els.editProjectsContainer.innerHTML = `<div class="sub-label">Selected Projects (One bullet per line)</div>` +
    r.projects
      .map(
        (proj, idx) => `
      <div class="editor-block">
        <div class="editor-block-head">
          <span>${escapeHtml(proj.title)} (${escapeHtml(proj.platform)})</span>
          <button type="button" class="btn btn-sm btn-danger remove-proj-btn" data-idx="${idx}">Remove</button>
        </div>
        <textarea rows="3" class="proj-bullets-input" data-idx="${idx}">${escapeHtml(proj.bullets.join("\n"))}</textarea>
      </div>`
      )
      .join("");

  document.querySelectorAll(".remove-proj-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const idx = Number(btn.dataset.idx);
      state.tailored.projects.splice(idx, 1);
      renderInlineEditors();
      await syncLatexAndPreview();
    });
  });
}

function collectEditorChanges() {
  if (!state.tailored) return;
  state.tailored.basics.headline = els.editHeadline.value.trim();
  state.tailored.basics.summary = els.editSummary.value.trim();

  document.querySelectorAll(".skill-cat-input").forEach((input) => {
    const idx = Number(input.dataset.idx);
    state.tailored.skillCategories[idx].skills = input.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  });

  document.querySelectorAll(".exp-bullets-input").forEach((ta) => {
    const idx = Number(ta.dataset.idx);
    state.tailored.experiences[idx].bullets = ta.value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  });

  document.querySelectorAll(".proj-bullets-input").forEach((ta) => {
    const idx = Number(ta.dataset.idx);
    state.tailored.projects[idx].bullets = ta.value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  });
}

function renderA4Preview() {
  const r = state.tailored;
  if (!r) return;
  const b = r.basics || {};
  els.viewPreview.classList.toggle("modern-teal", els.templateSelect.value === "modern-teal");

  const skillsHtml = (r.skillCategories || [])
    .filter((c) => c.skills.length > 0)
    .map((c) => `<div><strong>${escapeHtml(c.title)}:</strong> ${escapeHtml(c.skills.join(", "))}</div>`)
    .join("");

  const expHtml = (r.experiences || [])
    .map(
      (exp) => `
    <div style="margin-bottom:0.45rem;">
      <div class="pv-row"><strong>${escapeHtml(exp.role)}</strong><span>${escapeHtml(exp.duration)}</span></div>
      <div class="pv-subrow"><span>${escapeHtml(exp.company)}</span><span>${escapeHtml(exp.location)}</span></div>
      <ul class="pv-list">${exp.bullets.map((pt) => `<li>${escapeHtml(pt)}</li>`).join("")}</ul>
    </div>`
    )
    .join("");

  const projHtml = (r.projects || [])
    .map(
      (proj) => `
    <div style="margin-bottom:0.42rem;">
      <div class="pv-row"><span><strong>${escapeHtml(proj.title)}</strong> | <em>${escapeHtml(proj.platform)}</em></span><em>${escapeHtml(proj.tagline)}</em></div>
      <ul class="pv-list">${proj.bullets.map((pt) => `<li>${escapeHtml(pt)}</li>`).join("")}</ul>
    </div>`
    )
    .join("");

  const eduHtml = (r.education || [])
    .map(
      (edu) => `
    <div class="pv-row"><strong>${escapeHtml(edu.institution)}</strong><span>${escapeHtml(edu.duration)}</span></div>
    <div class="pv-subrow"><span>${escapeHtml(edu.degree)}</span><span>${escapeHtml(edu.location)}</span></div>`
    )
    .join("");

  els.viewPreview.innerHTML = `
    <div class="pv-header">
      <div class="pv-name">${escapeHtml(b.name)}</div>
      <div class="pv-headline">${escapeHtml(b.headline)}</div>
      <div class="pv-contact">${escapeHtml(b.location)} | ${escapeHtml(b.phone)} | ${escapeHtml(b.email)} | ${escapeHtml(b.linkedinLabel || b.linkedin)}</div>
    </div>
    <div class="pv-section-title">Professional Summary</div>
    <div>${escapeHtml(b.summary)}</div>
    <div class="pv-section-title">Technical Skills</div>
    <div>${skillsHtml}</div>
    <div class="pv-section-title">Work Experience</div>
    <div>${expHtml}</div>
    <div class="pv-section-title">Key Projects</div>
    <div>${projHtml}</div>
    <div class="pv-section-title">Education</div>
    <div>${eduHtml}</div>
    ${b.languages?.length ? `<div style="margin-top:0.45rem;"><strong>Languages:</strong> ${escapeHtml(b.languages.join(", "))}</div>` : ""}
  `;
}

async function syncLatexAndPreview(saveToDisk = false) {
  collectEditorChanges();
  renderA4Preview();
  const res = await api("/api/latex", {
    method: "POST",
    body: JSON.stringify({
      resume: state.tailored,
      template: els.templateSelect.value,
      companyName: els.companyInput.value.trim(),
      saveToDisk
    })
  });
  state.latex = res.latex;
  els.latexCode.value = res.latex;
  return res;
}

async function runTailor() {
  try {
    els.btnTailor.disabled = true;
    const provider = els.aiProvider.value;
    const apiKey = els.aiKey.value.trim();
    if (apiKey) {
      localStorage.setItem(`rn_studio_key_${provider}`, apiKey);
    }
    const data = await api("/api/tailor", {
      method: "POST",
      body: JSON.stringify({
        jdText: els.jdInput.value,
        targetRole: els.roleInput.value,
        companyName: els.companyInput.value,
        maxProjects: Number(els.maxProjectsSelect.value),
        template: els.templateSelect.value,
        emailTone: els.emailTone.value,
        recruiterName: els.emailRecruiter.value,
        recipientEmail: els.emailTo.value,
        provider,
        model: els.aiModel.value.trim() || undefined,
        apiKey: apiKey || undefined
      })
    });
    state.analysis = data.analysis;
    state.tailored = data.tailored;
    state.latex = data.latex;
    els.latexCode.value = data.latex;
    renderAnalysis();
    renderInlineEditors();
    renderA4Preview();
    applyEmailDraft(data.emailDraft);
    const emailMode = data.emailDraft?.source === "ai" ? "AI-drafted email" : "auto-drafted email";
    showStatus(`Tailored resume & ${emailMode} ready (${data.analysis.score}% ATS keyword match).`);
  } catch (err) {
    showStatus(err.message, true);
  } finally {
    els.btnTailor.disabled = false;
  }
}

async function refreshEmailDraft(requireAi = false) {
  try {
    if (requireAi) els.btnAiEmail.disabled = true;
    collectEditorChanges();
    const provider = els.aiProvider.value;
    const apiKey = els.aiKey.value.trim();
    if (apiKey) {
      localStorage.setItem(`rn_studio_key_${provider}`, apiKey);
    }
    const data = await api("/api/draft-email", {
      method: "POST",
      body: JSON.stringify({
        tailored: state.tailored,
        analysis: state.analysis,
        jdText: els.jdInput.value,
        companyName: els.companyInput.value,
        targetRole: els.roleInput.value,
        recruiterName: els.emailRecruiter.value,
        recipientEmail: els.emailTo.value,
        tone: els.emailTone.value,
        requireAi,
        provider,
        model: els.aiModel.value.trim() || undefined,
        apiKey: apiKey || undefined
      })
    });
    applyEmailDraft(data.emailDraft);
    if (data.emailDraft?.aiWarning) {
      showStatus(`Auto-drafted from JD (AI error: ${data.emailDraft.aiWarning})`, true);
    } else if (data.emailDraft?.source === "ai") {
      showStatus(`Email auto-drafted by ${provider.toUpperCase()} AI from JD & your profile.`);
    } else {
      showStatus("Email auto-drafted from JD & your profile.");
    }
  } catch (err) {
    showStatus(err.message, true);
  } finally {
    els.btnAiEmail.disabled = false;
  }
}

async function runAiEnhance() {
  if (!els.jdInput.value.trim()) {
    showStatus("Paste a Job Description first before running AI polish.", true);
    return;
  }
  try {
    els.btnAiEnhance.disabled = true;
    collectEditorChanges();
    const provider = els.aiProvider.value;
    const apiKey = els.aiKey.value.trim();
    if (apiKey) {
      localStorage.setItem(`rn_studio_key_${provider}`, apiKey);
    }
    const data = await api("/api/ai-enhance", {
      method: "POST",
      body: JSON.stringify({
        jdText: els.jdInput.value,
        tailored: state.tailored,
        analysis: state.analysis,
        companyName: els.companyInput.value,
        targetRole: els.roleInput.value,
        recruiterName: els.emailRecruiter.value,
        recipientEmail: els.emailTo.value,
        emailTone: els.emailTone.value,
        provider,
        model: els.aiModel.value.trim() || undefined,
        apiKey: apiKey || undefined,
        template: els.templateSelect.value
      })
    });
    state.tailored = data.tailored;
    state.latex = data.latex;
    els.latexCode.value = data.latex;
    renderInlineEditors();
    renderA4Preview();
    applyEmailDraft(data.emailDraft);
    showStatus(`AI tailored resume & auto-drafted email via ${provider.toUpperCase()}.`);
  } catch (err) {
    showStatus(err.message, true);
  } finally {
    els.btnAiEnhance.disabled = false;
  }
}

// Jobs India tab
async function refreshIndiaJobs() {
  const params = new URLSearchParams({
    query: els.jobQuery.value.trim() || "React Native Developer",
    location: els.jobLocation.value || "india-all",
    days: els.jobDays.value || "7",
    remote: String(els.jobRemote.checked)
  });
  const data = await api(`/api/jobs-india?${params.toString()}`);

  if (els.jobLocation.options.length === 0) {
    state.locations = data.locations;
    els.jobLocation.innerHTML = data.locations
      .map((l) => `<option value="${escapeHtml(l.id)}">${escapeHtml(l.label)}</option>`)
      .join("");
  }

  els.portalCards.innerHTML = data.links
    .map(
      (link) => `
    <div class="portal-card">
      <div>
        <h3>${escapeHtml(link.portal)}</h3>
        <span class="portal-badge">${escapeHtml(link.badge)}</span>
        <p style="margin-top:0.5rem;">${escapeHtml(link.description)}</p>
      </div>
      <a class="btn btn-primary" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">Open Recent Jobs &rarr;</a>
    </div>`
    )
    .join("");

  if (state.sampleJds.length === 0) {
    state.sampleJds = data.sampleJds;
    els.sampleJdSelect.innerHTML =
      `<option value="">Load sample Indian RN JD...</option>` +
      data.sampleJds.map((s) => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.title)}</option>`).join("");

    els.sampleJdCards.innerHTML = data.sampleJds
      .map(
        (s) => `
      <div class="portal-card">
        <div>
          <h3>${escapeHtml(s.role)}</h3>
          <span class="portal-badge">${escapeHtml(s.company)} • ${escapeHtml(s.location)}</span>
          <p style="margin-top:0.5rem;">${escapeHtml(s.jd.slice(0, 150))}...</p>
        </div>
        <button class="btn btn-accent load-sample-btn" data-id="${escapeHtml(s.id)}">Load &amp; Tailor Resume</button>
      </div>`
      )
      .join("");

    document.querySelectorAll(".load-sample-btn").forEach((btn) => {
      btn.addEventListener("click", () => loadSampleJd(btn.dataset.id));
    });
  }
}

async function loadSampleJd(id) {
  const sample = state.sampleJds.find((s) => s.id === id);
  if (!sample) return;
  els.companyInput.value = sample.company;
  els.roleInput.value = sample.role;
  els.jdInput.value = sample.jd;
  // Switch back to Tailor tab
  document.querySelector('.tab[data-tab="tailor"]').click();
  await runTailor();
}

// Application Tracker
async function loadApplications() {
  const data = await api("/api/applications");
  state.applications = data.applications || [];
  renderApplications();
}

function renderApplications() {
  els.trackerCount.textContent = String(state.applications.length);
  if (state.applications.length === 0) {
    els.trackerTbody.innerHTML = `<tr><td colspan="7" class="hint">No saved applications yet. Tailor a resume and click "Save to Tracker".</td></tr>`;
    return;
  }

  els.trackerTbody.innerHTML = state.applications
    .map(
      (app) => `
    <tr>
      <td>
        <strong>${escapeHtml(app.company)}</strong><br/>
        <span class="hint">${escapeHtml(app.role)}</span>
      </td>
      <td>${escapeHtml(app.portal)}<br/><span class="hint">${escapeHtml(app.location || "India")}</span></td>
      <td>${app.matchScore !== null ? `<span class="chip chip-match">${app.matchScore}%</span>` : "--"}</td>
      <td>
        <select class="select-sm tracker-status" data-id="${escapeHtml(app.id)}">
          ${["Saved", "Tailored", "Applied", "Interview", "Offer", "Rejected"]
            .map((st) => `<option value="${st}" ${app.status === st ? "selected" : ""}>${st}</option>`)
            .join("")}
        </select>
      </td>
      <td><code>${escapeHtml(app.texFile || "-")}</code></td>
      <td class="hint">${new Date(app.updatedAt).toLocaleDateString()}</td>
      <td>
        <div class="inline-actions">
          ${app.jobUrl ? `<a class="btn btn-sm btn-secondary" href="${escapeHtml(app.jobUrl)}" target="_blank" rel="noopener noreferrer">Job</a>` : ""}
          <button class="btn btn-sm btn-danger tracker-del" data-id="${escapeHtml(app.id)}">Delete</button>
        </div>
      </td>
    </tr>`
    )
    .join("");

  document.querySelectorAll(".tracker-status").forEach((sel) => {
    sel.addEventListener("change", async () => {
      const app = state.applications.find((a) => a.id === sel.dataset.id);
      if (!app) return;
      await api("/api/applications", {
        method: "POST",
        body: JSON.stringify({ ...app, status: sel.value })
      });
      await loadApplications();
    });
  });

  document.querySelectorAll(".tracker-del").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await api(`/api/applications/${encodeURIComponent(btn.dataset.id)}`, { method: "DELETE" });
      await loadApplications();
    });
  });
}

// Event Listeners
els.btnTailor.addEventListener("click", runTailor);
els.btnAiEnhance.addEventListener("click", runAiEnhance);
els.btnRegenerateLatex.addEventListener("click", async () => {
  await syncLatexAndPreview(false);
  showStatus("Synced inline edits to Live A4 Preview & LaTeX.");
});
els.templateSelect.addEventListener("change", () => syncLatexAndPreview(false));

els.sampleJdSelect.addEventListener("change", () => {
  if (els.sampleJdSelect.value) {
    loadSampleJd(els.sampleJdSelect.value);
  }
});

els.btnCopyLatex.addEventListener("click", async () => {
  await syncLatexAndPreview(false);
  await navigator.clipboard.writeText(state.latex);
  showStatus("Copied Overleaf-ready LaTeX (.tex) to clipboard!");
});

els.btnDownloadLatex.addEventListener("click", async () => {
  await syncLatexAndPreview(false);
  const filename = getExportFilename();
  const blob = new Blob([state.latex], { type: "application/x-tex;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showStatus(`Downloaded ${filename}. Upload to Overleaf or open directly!`);
});

els.btnDownloadPdf.addEventListener("click", async () => {
  try {
    els.btnDownloadPdf.disabled = true;
    showStatus("Generating PDF resume...");
    await syncLatexAndPreview(false);

    const res = await fetch("/api/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume: state.tailored,
        template: els.templateSelect.value,
        companyName: els.companyInput.value.trim(),
        saveToDisk: true
      })
    });

    if (!res.ok) {
      throw new Error("Server PDF renderer unavailable; opening browser Print-to-PDF.");
    }

    const blob = await res.blob();
    const pdfName = `${getExportBasename()}.pdf`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = pdfName;
    a.click();
    URL.revokeObjectURL(url);
    showStatus(`Downloaded ${pdfName} (and saved a copy in rn-resume-studio/output/).`);
  } catch (err) {
    showStatus(err.message, false);
    const prevHidden = els.viewPreview.classList.contains("hidden");
    if (prevHidden) {
      els.viewPreview.classList.remove("hidden");
      els.viewLatex.classList.add("hidden");
    }
    window.print();
  } finally {
    els.btnDownloadPdf.disabled = false;
  }
});

els.btnSaveDisk.addEventListener("click", async () => {
  const res = await syncLatexAndPreview(true);
  showStatus(`Saved ${res.filename} to rn-resume-studio/output/`);
});

els.btnOpenOverleaf.addEventListener("click", async () => {
  await syncLatexAndPreview(false);
  els.overleafSnip.value = state.latex;
  els.overleafSnipName.value = getExportFilename();
  els.overleafForm.submit();
  showStatus("Opened tailored LaTeX in a new Overleaf tab!");
});

els.btnSaveApp.addEventListener("click", async () => {
  const res = await syncLatexAndPreview(true);
  await api("/api/applications", {
    method: "POST",
    body: JSON.stringify({
      company: els.companyInput.value.trim() || "Target Company",
      role: els.roleInput.value.trim() || state.tailored?.basics?.headline || "React Native Developer",
      portal: els.portalInput.value.trim() || "LinkedIn India",
      jobUrl: els.jobUrlInput.value.trim(),
      matchScore: state.analysis?.score ?? null,
      status: "Tailored",
      texFile: res.filename || getExportFilename(),
      jdText: els.jdInput.value
    })
  });
  await loadApplications();
  showStatus(`Saved application & ${res.filename} to Tracker!`);
});

// Master profile editor
els.btnFormatProfile.addEventListener("click", () => {
  try {
    const parsed = JSON.parse(els.masterProfileJson.value);
    els.masterProfileJson.value = JSON.stringify(parsed, null, 2);
  } catch (err) {
    alert(`Invalid JSON: ${err.message}`);
  }
});

els.btnSaveProfile.addEventListener("click", async () => {
  try {
    const parsed = JSON.parse(els.masterProfileJson.value);
    const data = await api("/api/profile", {
      method: "PUT",
      body: JSON.stringify({ profile: parsed })
    });
    state.masterProfile = data.profile;
    await runTailor();
    alert("Master profile saved and resume re-synced!");
  } catch (err) {
    alert(`Failed to save profile: ${err.message}`);
  }
});

// Job filter listeners
[els.jobQuery, els.jobLocation, els.jobDays, els.jobRemote].forEach((el) => {
  el.addEventListener("change", refreshIndiaJobs);
});

els.aiProvider.addEventListener("change", () => {
  els.aiKey.value = localStorage.getItem(`rn_studio_key_${els.aiProvider.value}`) || "";
});

// Draft Email listeners
els.emailTone.addEventListener("change", () => refreshEmailDraft(false));
els.btnAiEmail.addEventListener("click", () => refreshEmailDraft(true));
[els.emailTo, els.emailSubject, els.emailBody].forEach((el) => {
  el.addEventListener("input", updateMailtoHref);
});
els.btnCopySubject.addEventListener("click", async () => {
  await navigator.clipboard.writeText(els.emailSubject.value);
  showStatus("Copied email subject to clipboard!");
});
els.btnCopyEmail.addEventListener("click", async () => {
  await navigator.clipboard.writeText(els.emailBody.value);
  showStatus("Copied email body (with portfolio link) to clipboard!");
});

async function init() {
  els.aiKey.value = localStorage.getItem(`rn_studio_key_${els.aiProvider.value}`) || "";
  const [profileRes] = await Promise.all([
    api("/api/profile"),
    refreshIndiaJobs(),
    loadApplications()
  ]);
  state.masterProfile = profileRes.profile;
  els.masterProfileJson.value = JSON.stringify(profileRes.profile, null, 2);
  await runTailor();
}

init().catch((err) => {
  showStatus(`Initialization error: ${err.message}`, true);
});
