import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Database,
  FlaskConical,
  Gauge,
  GitBranch,
  Layers3,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Thermometer,
  UserRound
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import LandingPage from "./LandingPage";
import DiagnosticWizard from "./Wizard";
import "./landing.css";
import "./styles.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const defaultBounty = {
  title: "Unexpected pressure drop in cooling-water line",
  description:
    "A cooling-water circuit is showing a higher pressure drop than design while the operating team reports no intentional flow change.",
  category: "momentum",
  tags: "pressure_drop, fouling, pipeline",
  difficulty: "medium",
  industry: "chemical_process"
};

const defaultSubmission = {
  rho: 997,
  mu: 0.00089,
  consistencyIndexK: "",
  flowBehaviorIndexN: "",
  diameter: 0.05,
  length: 25,
  roughness: 0.000045,
  flowRate: 0.004,
  temperature: 25
};

function Dashboard() {
  const [activeTab, setActiveTab] = useState("workspace");
  const [status, setStatus] = useState("Checking backend...");
  const [bounties, setBounties] = useState([]);
  const [selectedBountyId, setSelectedBountyId] = useState("");
  const [student, setStudent] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [latestTrace, setLatestTrace] = useState(null);
  const [bountyForm, setBountyForm] = useState(defaultBounty);
  const [submissionForm, setSubmissionForm] = useState(defaultSubmission);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const selectedBounty = useMemo(
    () => bounties.find((bounty) => bounty._id === selectedBountyId) || bounties[0],
    [bounties, selectedBountyId]
  );

  useEffect(() => {
    bootstrap();
  }, []);

  async function bootstrap() {
    try {
      const health = await api("/health");
      setStatus(`${health.status} · ${health.service}`);
      const currentStudent = await ensureDemoStudent();
      setStudent(currentStudent);
      const bountyList = await api("/bounties");
      setBounties(bountyList);
      setSelectedBountyId(bountyList[0]?._id || "");
      if (currentStudent?._id) {
        const portfolioData = await api(`/users/${currentStudent._id}/portfolio`);
        setPortfolio(portfolioData);
      }
    } catch (error) {
      setStatus("Backend offline. Start it with npm run dev in the project root.");
      setNotice(error.message);
    }
  }

  async function ensureDemoStudent() {
    const users = await api("/users?email=student@example.com");
    if (users[0]) return users[0];
    return api("/users", {
      method: "POST",
      body: {
        name: "Demo Student",
        email: "student@example.com",
        role: "student"
      }
    });
  }

  async function createBounty(event) {
    event.preventDefault();
    setLoading(true);
    setNotice("");
    try {
      const bounty = await api("/bounties", {
        method: "POST",
        body: {
          title: bountyForm.title,
          description: bountyForm.description,
          category: bountyForm.category,
          tags: bountyForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          inputTemplate: buildInputTemplate(),
          expectedOutputs: ["deltaP", "Re", "frictionFactor"],
          difficulty: bountyForm.difficulty,
          metadata: {
            industry: bountyForm.industry,
            createdBy: student?._id
          }
        }
      });
      const updated = [bounty, ...bounties];
      setBounties(updated);
      setSelectedBountyId(bounty._id);
      setNotice("Bounty created and ready for diagnosis.");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitDiagnosis(event) {
    event.preventDefault();
    if (!selectedBounty || !student) {
      setNotice("Select a bounty and make sure the demo student is loaded.");
      return;
    }

    setLoading(true);
    setNotice("");
    try {
      const inputData = {
        fluidProperties: {
          rho: Number(submissionForm.rho),
          mu: submissionForm.mu ? Number(submissionForm.mu) : null,
          consistencyIndexK: submissionForm.consistencyIndexK ? Number(submissionForm.consistencyIndexK) : null,
          flowBehaviorIndexN: submissionForm.flowBehaviorIndexN ? Number(submissionForm.flowBehaviorIndexN) : null
        },
        geometry: {
          diameter: Number(submissionForm.diameter),
          length: Number(submissionForm.length),
          roughness: Number(submissionForm.roughness)
        },
        operatingConditions: {
          flowRate: Number(submissionForm.flowRate),
          temperature: Number(submissionForm.temperature)
        }
      };

      const submission = await api("/submissions", {
        method: "POST",
        body: {
          bountyId: selectedBounty._id,
          userId: student._id,
          inputData
        }
      });

      const trace = await api("/diagnose/run", {
        method: "POST",
        body: {
          submissionId: submission._id,
          inputData
        }
      });

      setLatestTrace(trace);
      const portfolioData = await api(`/users/${student._id}/portfolio`);
      setPortfolio(portfolioData);
      setNotice("Submission stored and diagnostic trace generated through the engine bridge.");
      setActiveTab("trace");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function evaluateSubmission(submissionId, form) {
    setLoading(true);
    setNotice("");
    try {
      await api("/evaluations", {
        method: "POST",
        body: {
          submissionId,
          scores: {
            physicsAccuracy: Number(form.physicsAccuracy),
            reasoningQuality: Number(form.reasoningQuality),
            validationStrength: Number(form.validationStrength),
          },
          feedback: form.feedback,
        },
      });
      const portfolioData = await api(`/users/${student._id}/portfolio`);
      setPortfolio(portfolioData);
      setNotice("Evaluation saved. Average score updated.");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><FlaskConical size={22} /></div>
          <div>
            <strong>Transport RCA</strong>
            <span>Diagnostic Bounty</span>
          </div>
        </div>

        <nav className="nav-list">
          <button className={activeTab === "workspace" ? "active" : ""} onClick={() => setActiveTab("workspace")}>
            <Gauge size={18} /> Workspace
          </button>
          <button className={activeTab === "wizard" ? "active" : ""} onClick={() => setActiveTab("wizard")}>
            <Activity size={18} /> Diagnostic Wizard
          </button>
          <button className={activeTab === "create" ? "active" : ""} onClick={() => setActiveTab("create")}>
            <Plus size={18} /> Create Bounty
          </button>
          <button className={activeTab === "trace" ? "active" : ""} onClick={() => setActiveTab("trace")}>
            <GitBranch size={18} /> Diagnostic Trace
          </button>
          <button className={activeTab === "portfolio" ? "active" : ""} onClick={() => setActiveTab("portfolio")}>
            <UserRound size={18} /> Portfolio
          </button>
          <button className={activeTab === "handoff" ? "active" : ""} onClick={() => setActiveTab("handoff")}>
            <ShieldCheck size={18} /> Engine Handoff
          </button>
        </nav>

        <div className="status-panel">
          <Database size={18} />
          <div>
            <span>Backend</span>
            <strong>{status}</strong>
          </div>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">MERN interface for plant troubleshooting</p>
            <h1>Heat and Fluid Diagnostic Bounty</h1>
          </div>
          <button className="primary-action" onClick={bootstrap}>
            <Activity size={18} /> Sync
          </button>
        </header>

        {notice && <div className="notice"><AlertTriangle size={18} /> {notice}</div>}

        {activeTab === "workspace" && (
          <Workspace
            bounties={bounties}
            selectedBounty={selectedBounty}
            selectedBountyId={selectedBountyId}
            setSelectedBountyId={setSelectedBountyId}
            submissionForm={submissionForm}
            setSubmissionForm={setSubmissionForm}
            submitDiagnosis={submitDiagnosis}
            loading={loading}
          />
        )}
        
        {activeTab === "wizard" && <DiagnosticWizard api={api} />}

        {activeTab === "create" && (
          <CreateBounty
            form={bountyForm}
            setForm={setBountyForm}
            createBounty={createBounty}
            loading={loading}
          />
        )}

        {activeTab === "trace" && <TraceView trace={latestTrace} />}
        {activeTab === "portfolio" && <Portfolio portfolio={portfolio} onEvaluate={evaluateSubmission} />}
        {activeTab === "handoff" && <Handoff />}
      </main>
    </div>
  );
}

function Workspace({
  bounties,
  selectedBounty,
  selectedBountyId,
  setSelectedBountyId,
  submissionForm,
  setSubmissionForm,
  submitDiagnosis,
  loading
}) {
  return (
    <section className="workspace-grid">
      <div className="panel bounty-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Open problems</p>
            <h2>Bounty Explorer</h2>
          </div>
          <Search size={20} />
        </div>

        <div className="bounty-list">
          {bounties.map((bounty) => (
            <button
              key={bounty._id}
              className={`bounty-item ${selectedBountyId === bounty._id ? "selected" : ""}`}
              onClick={() => setSelectedBountyId(bounty._id)}
            >
              <div className="bounty-item-header">
                <span>{bounty.category}</span>
                {bounty.metadata?.industry && (
                  <span className={`industry-badge ${bounty.metadata.industry}`}>
                    {bounty.metadata.industry}
                  </span>
                )}
              </div>
              <strong>{bounty.title}</strong>
              <small>{bounty.difficulty} · {(bounty.tags || []).join(", ")}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="panel details-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Selected case</p>
            <h2>{selectedBounty?.title || "No bounty selected"}</h2>
          </div>
          <Layers3 size={20} />
        </div>
        <p className="case-description">{selectedBounty?.description}</p>
        <div className="metric-row">
          <Metric icon={<Gauge size={18} />} label="Category" value={selectedBounty?.category || "-"} />
          <Metric icon={<BookOpen size={18} />} label="Difficulty" value={selectedBounty?.difficulty || "-"} />
          <Metric icon={<BarChart3 size={18} />} label="Outputs" value={(selectedBounty?.expectedOutputs || []).join(", ") || "-"} />
        </div>

        <form className="diagnosis-form" onSubmit={submitDiagnosis}>
          <h3>Submit Diagnosis</h3>
          <div className="form-grid">
            <NumberField label="Density rho" value={submissionForm.rho} field="rho" setForm={setSubmissionForm} />
            <NumberField label="Viscosity mu" value={submissionForm.mu} field="mu" setForm={setSubmissionForm} />
            <NumberField label="Consistency Index K" value={submissionForm.consistencyIndexK} field="consistencyIndexK" setForm={setSubmissionForm} />
            <NumberField label="Flow Behavior Index n" value={submissionForm.flowBehaviorIndexN} field="flowBehaviorIndexN" setForm={setSubmissionForm} />
            <NumberField label="Diameter" value={submissionForm.diameter} field="diameter" setForm={setSubmissionForm} />
            <NumberField label="Length" value={submissionForm.length} field="length" setForm={setSubmissionForm} />
            <NumberField label="Roughness" value={submissionForm.roughness} field="roughness" setForm={setSubmissionForm} />
            <NumberField label="Flow rate" value={submissionForm.flowRate} field="flowRate" setForm={setSubmissionForm} />
          </div>
          <button className="primary-action wide" disabled={loading || !selectedBounty}>
            <Send size={18} /> Store Submission and Run Diagnosis
          </button>
        </form>
      </div>
    </section>
  );
}

function CreateBounty({ form, setForm, createBounty, loading }) {
  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Problem intake</p>
          <h2>Create Industrial Bounty</h2>
        </div>
        <Plus size={20} />
      </div>
      <form onSubmit={createBounty} className="create-form">
        <label>
          Title
          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        </label>
        <label>
          Description
          <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        </label>
        <div className="form-grid">
          <label>
            Category
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              <option value="momentum">Momentum</option>
              <option value="heat">Heat</option>
              <option value="mass">Mass</option>
            </select>
          </label>
          <label>
            Difficulty
            <select value={form.difficulty} onChange={(event) => setForm({ ...form, difficulty: event.target.value })}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <label>
            Industry
            <select value={form.industry} onChange={(event) => setForm({ ...form, industry: event.target.value })}>
              <option value="biochemistry">Biochemistry</option>
              <option value="biotechnology">Biotechnology</option>
              <option value="chemical_process">Chemical Process</option>
              <option value="oil_and_gas">Oil & Gas</option>
            </select>
          </label>
          <label>
            Tags
            <input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} />
          </label>
        </div>
        <button className="primary-action wide" disabled={loading}>
          <Plus size={18} /> Create Bounty
        </button>
      </form>
    </section>
  );
}

function TraceView({ trace }) {
  const chartData = buildPressureChart(trace);
  return (
    <section className="trace-layout">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Explainable RCA</p>
            <h2>Diagnostic Trace</h2>
          </div>
          <GitBranch size={20} />
        </div>
        {!trace ? (
          <EmptyState text="Run a diagnosis from the workspace to see the trace." />
        ) : (
          <>
            <div className="metric-row">
              <Metric icon={<Gauge size={18} />} label="Re" value={trace.layers?.scaling?.Re ?? "-"} />
              <Metric icon={<Activity size={18} />} label="Flow regime" value={trace.flowRegime} />
              <Metric icon={<Thermometer size={18} />} label="Delta P" value={`${trace.layers?.integral?.deltaP ?? "-"} Pa`} />
            </div>
            <div className="cause-list">
              {(trace.inferredCauses || []).map((cause) => (
                <div key={cause} className="cause-item"><CheckCircle2 size={17} /> {cause}</div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="panel chart-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Parametric preview</p>
            <h2>Pressure Drop vs Velocity</h2>
          </div>
          <BarChart3 size={20} />
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d9e2ec" />
            <XAxis dataKey="velocity" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="deltaP" stroke="#0b7285" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="panel full-span">
        <h3>Intermediate Calculations</h3>
        <div className="trace-table">
          {(trace?.intermediateCalculations || []).map((item) => (
            <div key={item.step} className="trace-row">
              <strong>{item.step}</strong>
              <span>{item.value} {item.unit || ""}</span>
              <small>{item.equation}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Portfolio({ portfolio, onEvaluate }) {
  const [evalForms, setEvalForms] = React.useState({});

  function toggleForm(id) {
    setEvalForms((f) => ({ ...f, [id]: f[id] ? null : { physicsAccuracy: 8, reasoningQuality: 7, validationStrength: 7.5, feedback: "" } }));
  }

  function updateField(id, field, value) {
    setEvalForms((f) => ({ ...f, [id]: { ...f[id], [field]: value } }));
  }

  async function submit(submission) {
    const form = evalForms[submission._id];
    await onEvaluate(submission._id, form);
    setEvalForms((f) => ({ ...f, [submission._id]: null }));
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Student evidence</p>
          <h2>Diagnostic Portfolio</h2>
        </div>
        <UserRound size={20} />
      </div>
      {!portfolio ? (
        <EmptyState text="Portfolio will appear after backend sync." />
      ) : (
        <div className="portfolio-list">
          <div className="metric-row">
            <Metric icon={<UserRound size={18} />} label="Student" value={portfolio.user.name} />
            <Metric icon={<BarChart3 size={18} />} label="Average score" value={portfolio.averageScore || 0} />
            <Metric icon={<Database size={18} />} label="Submissions" value={portfolio.submissions.length} />
          </div>
          {portfolio.submissions.map((submission) => (
            <div key={submission._id} className="portfolio-item" style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>{submission.bountyId?.title || "Untitled bounty"}</strong>
                <span>{submission.status}</span>
              </div>
              <small>{submission.rootCause || "No root cause recorded"}</small>
              {submission.status !== "evaluated" && (
                <button
                  className="primary-action"
                  style={{ justifySelf: "start", padding: "6px 14px", minHeight: 34, fontSize: 13 }}
                  onClick={() => toggleForm(submission._id)}
                >
                  {evalForms[submission._id] ? "Cancel" : "Evaluate"}
                </button>
              )}
              {evalForms[submission._id] && (
                <div className="form-grid" style={{ marginTop: 6 }}>
                  <label>Physics Accuracy (0–10)
                    <input type="number" min="0" max="10" step="0.1" value={evalForms[submission._id].physicsAccuracy}
                      onChange={(e) => updateField(submission._id, "physicsAccuracy", Number(e.target.value))} />
                  </label>
                  <label>Reasoning Quality (0–10)
                    <input type="number" min="0" max="10" step="0.1" value={evalForms[submission._id].reasoningQuality}
                      onChange={(e) => updateField(submission._id, "reasoningQuality", Number(e.target.value))} />
                  </label>
                  <label>Validation Strength (0–10)
                    <input type="number" min="0" max="10" step="0.1" value={evalForms[submission._id].validationStrength}
                      onChange={(e) => updateField(submission._id, "validationStrength", Number(e.target.value))} />
                  </label>
                  <label>Feedback
                    <input value={evalForms[submission._id].feedback}
                      onChange={(e) => updateField(submission._id, "feedback", e.target.value)} />
                  </label>
                  <button className="primary-action wide" style={{ gridColumn: "1/-1" }} onClick={() => submit(submission)}>
                    <Send size={16} /> Submit Evaluation
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Handoff() {
  return (
    <section className="handoff-grid">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Integration contract</p>
            <h2>Java Engine Handoff</h2>
          </div>
          <ShieldCheck size={20} />
        </div>
        <div className="handoff-step">
          <strong>Frontend calls only one engine route</strong>
          <code>POST /api/diagnose/run</code>
        </div>
        <div className="handoff-step">
          <strong>Backend integration file</strong>
          <code>src/services/engineService.js</code>
        </div>
        <div className="handoff-step">
          <strong>Switch from mock to Java</strong>
          <code>USE_MOCK_ENGINE=false</code>
        </div>
        <div className="handoff-step">
          <strong>Expected Java endpoint</strong>
          <code>POST {"${JAVA_ENGINE_URL}"}/compute/run</code>
        </div>
      </div>
      <div className="panel">
        <h3>Payload Shape</h3>
        <pre>{`{
  submissionId,
  inputData: {
    fluidProperties: { rho, mu, k, Cp },
    geometry: { diameter, length, roughness },
    operatingConditions: { flowRate, temperature }
  }
}`}</pre>
      </div>
    </section>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="metric">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function NumberField({ label, value, field, setForm }) {
  return (
    <label>
      {label}
      <input
        type="number"
        step="any"
        value={value}
        onChange={(event) => setForm((form) => ({ ...form, [field]: event.target.value }))}
      />
    </label>
  );
}

function EmptyState({ text }) {
  return <div className="empty-state">{text}</div>;
}

function buildInputTemplate() {
  return {
    fluidProperties: {
      rho: { unit: "kg/m3", required: true },
      mu: { unit: "Pa.s", required: true }
    },
    geometry: {
      diameter: { unit: "m", required: true },
      length: { unit: "m", required: true },
      roughness: { unit: "m", required: true }
    },
    operatingConditions: {
      flowRate: { unit: "m3/s", required: true },
      temperature: { unit: "C", required: false }
    }
  };
}

function buildPressureChart(trace) {
  if (trace?.analyticsData && trace.analyticsData.length > 0) {
    return trace.analyticsData.map(dp => ({
      velocity: dp.velocity.toFixed(2),
      deltaP: Math.round(dp.deltaP),
      viscosity: dp.viscosity.toExponential(2)
    }));
  }
  
  const base = Number(trace?.layers?.integral?.deltaP || 9000);
  return [0.4, 0.7, 1, 1.3, 1.6].map((factor) => ({
    velocity: factor.toFixed(1),
    deltaP: Math.round(base * factor * factor)
  }));
}

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(data?.message || response.statusText);
  }
  return data;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
