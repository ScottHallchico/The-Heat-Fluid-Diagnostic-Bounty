import React, { useState } from "react";
import { ArrowLeft, FlaskConical, Loader2, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import "./landing.css";
import "./styles.css";

const questions = [
  {
    id: "q1",
    title: "Penicillin Yield and Mixing",
    text: "Penicillin production is a secondary metabolite. Explain how a mixing problem could specifically affect penicillin yield, and what operational change you would recommend."
  },
  {
    id: "q2",
    title: "Non-Newtonian Broth",
    text: "Explain why Penicillium chrysogenum broth becomes non-Newtonian during fermentation, and at what stage of the fermentation you would expect this behaviour to be most pronounced."
  },
  {
    id: "q3",
    title: "Temperature Excursion (E. coli)",
    text: "The broth temperature has risen 2.5°C above the optimal setpoint for E. coli growth. Explain what happens to the culture at 39.5°C and the likely impact on recombinant insulin production."
  },
  {
    id: "q4",
    title: "Membrane Fouling",
    text: "The computed effective roughness has increased sevenfold. Identify TWO biological materials that could be responsible for this fouling and explain the mechanism by which each deposits."
  },
  {
    id: "q5",
    title: "Heat Exchanger Fouling",
    text: "Why does fouling reduce heat transfer in a shell-and-tube heat exchanger?"
  },
  {
    id: "q6",
    title: "SIP Sterilization",
    text: "Explain what SIP (Steam-in-Place) sterilization is, why it is necessary before each batch, and why it might cause protein fouling on the fermenter jacket."
  },
  {
    id: "q7",
    title: "Yogurt Production",
    text: "Why is lactic acid production important during yogurt manufacture?"
  },
  {
    id: "q8",
    title: "Diagnostic Reasoning (Yogurt)",
    text: "Hypotheses for slow lactic acid production: Low starter culture activity, Inadequate incubation temperature, Contamination. Which best explains the observation?"
  }
];

export default function BiotechPage() {
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
  const [variables, setVariables] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
      const res = await fetch(`${API_BASE}/biotech/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: selectedQuestion.text,
          variables,
          hypothesis
        })
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setResult(prev => (prev || "") + chunk);
      }
    } catch (err) {
      setResult("Failed to connect to the server.");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f8f9fa", width: "100%" }}>
      <header className="topbar" style={{ padding: "20px 40px", backgroundColor: "#fff", borderBottom: "1px solid #e9ecef" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button className="primary-action" style={{ background: "transparent", color: "#7048e8", border: "1px solid #7048e8", display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => navigate("/")}>
            <ArrowLeft size={18} /> Back
          </button>
          <div>
            <p className="eyebrow" style={{ color: "#7048e8" }}>Biotechnology & Bioprocess</p>
            <h1>AI Diagnostic Module</h1>
          </div>
        </div>
      </header>

      <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px" }}>
        <div className="panel" style={{ alignSelf: 'start' }}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Scenarios</p>
              <h2>Select a Problem</h2>
            </div>
            <FlaskConical size={20} color="#7048e8" />
          </div>
          <div className="bounty-list">
            {questions.map((q) => (
              <button 
                key={q.id} 
                className={`bounty-item ${selectedQuestion.id === q.id ? "selected" : ""}`}
                onClick={() => {
                  setSelectedQuestion(q);
                  setResult(null);
                }}
                style={selectedQuestion.id === q.id ? { borderColor: '#7048e8', background: '#f3f0ff' } : {}}
              >
                <strong style={selectedQuestion.id === q.id ? { color: '#7048e8' } : {}}>{q.title}</strong>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="panel details-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow" style={{ color: "#7048e8" }}>Current Scenario</p>
                <h2>{selectedQuestion.title}</h2>
              </div>
            </div>
            <p className="case-description" style={{ fontSize: "1.1rem", marginBottom: "20px", color: "#343a40" }}>
              {selectedQuestion.text}
            </p>

            <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
              <label>
                Input Variables (Optional Context)
                <textarea 
                  rows={3} 
                  style={{ width: "100%", padding: "10px", marginTop: "8px", borderRadius: "6px", border: "1px solid #ced4da" }}
                  placeholder="e.g. Temperature = 39.5 C, pH = 6.8..."
                  value={variables}
                  onChange={(e) => setVariables(e.target.value)}
                />
              </label>
              <label style={{ marginTop: "10px" }}>
                Your Hypothesis
                <textarea 
                  rows={4} 
                  style={{ width: "100%", padding: "10px", marginTop: "8px", borderRadius: "6px", border: "1px solid #ced4da" }}
                  placeholder="e.g. I believe the impeller shear rate is too low..."
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                />
              </label>
            </div>
            
            <button 
              className="primary-action wide" 
              style={{ marginTop: "20px", padding: "15px", fontSize: "16px", background: "#7048e8", borderColor: "#7048e8", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? <Loader2 size={18} className="spin" /> : <Cpu size={18} />}
              {loading ? " Analyzing with AI..." : " Get AI Diagnosis (5 Whys)"}
            </button>
          </div>

          {result && (
            <div className="panel" style={{ borderTop: "4px solid #7048e8" }}>
              <div className="panel-heading">
                <h2>AI Validation & RCA</h2>
              </div>
              <div style={{ lineHeight: "1.6", color: "#333", padding: "10px 0" }} className="markdown-body">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkMath]} 
                  rehypePlugins={[rehypeKatex]}
                >
                  {result}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
