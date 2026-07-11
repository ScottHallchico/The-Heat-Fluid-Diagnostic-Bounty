import React, { useState, useEffect, useRef } from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { useNavigate } from "react-router-dom";
import {
  Thermometer,
  Droplets,
  Gauge,
  BarChart3,
  Zap,
  ArrowRight,
  FlaskConical,
  Cpu,
  GitBranch,
  ShieldCheck,
  Activity,
  ChevronDown,
  Waves,
  Wind,
  Flame,
  TrendingUp,
  CheckCircle2,
  Star,
  ExternalLink,
} from "lucide-react";

/* ───── animated counter ───── */
function AnimatedCounter({ end, duration = 2000, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ───── feature card ───── */
function FeatureCard({ icon, title, description, delay }) {
  return (
    <div className="landing-feature-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="landing-feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

/* ───── landing page ───── */
export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing-root">
      {/* ─── NAVBAR ─── */}
      <nav className={`landing-nav ${scrolled ? "landing-nav-scrolled" : ""}`}>
        <div className="landing-nav-inner">
          <div className="landing-nav-brand">
            <div className="landing-nav-logo">
              <FlaskConical size={20} />
            </div>
            <span>HeatFluid<strong>Dx</strong></span>
          </div>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#metrics">Results</a>
            <a href="#diagnostics">Diagnostics</a>
          </div>
          <div style={{display: 'flex', gap: '10px'}}>
            <button className="landing-cta-sm" onClick={() => navigate("/dashboard")}>
              ChemE Module <ArrowRight size={16} />
            </button>
            <button className="landing-cta-sm" style={{ background: '#7048e8' }} onClick={() => navigate("/biotech")}>
              Biotech Module <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="landing-hero">
        <div className="landing-hero-gradient">
          <ShaderGradientCanvas
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          >
            <ShaderGradient
              type="waterPlane"
              animate="on"
              uTime={0.2}
              uSpeed={0.3}
              uStrength={2.4}
              uDensity={1.3}
              uFrequency={5.5}
              uAmplitude={3}
              positionX={-0.5}
              positionY={0}
              positionZ={0}
              rotationX={0}
              rotationY={10}
              rotationZ={50}
              color1="#94ffd1"
              color2="#6bf5ff"
              color3="#ffffff"
              grain="off"
              reflection={0.1}
              wireframe={false}
              shader="defaults"
              cAzimuthAngle={180}
              cPolarAngle={115}
              cDistance={3.6}
              cameraZoom={1}
            />
          </ShaderGradientCanvas>
        </div>

        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <Zap size={14} />
            <span>AI-Powered Thermal Intelligence</span>
          </div>
          <h1>
            Diagnose Heat &amp; Fluid
            <br />
            <span className="landing-gradient-text">Systems Instantly</span>
          </h1>
          <p className="landing-hero-sub">
            Advanced physics engine for analyzing heat transfer, fluid flow, pressure dynamics, and thermal performance.
            Root-cause analysis meets real-time diagnostic intelligence.
          </p>
          <div className="landing-hero-actions" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="landing-cta-primary" onClick={() => navigate("/dashboard")}>
              Chemical Engineering Module
              <ArrowRight size={18} />
            </button>
            <button className="landing-cta-primary" style={{ background: '#7048e8', borderColor: '#7048e8' }} onClick={() => navigate("/biotech")}>
              Biotech Engineering Module
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="landing-hero-stats">
            <div className="landing-stat-item">
              <strong><AnimatedCounter end={12} suffix="+" /></strong>
              <span>Physics Models</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat-item">
              <strong><AnimatedCounter end={99} suffix="%" /></strong>
              <span>Accuracy Rate</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat-item">
              <strong><AnimatedCounter end={50} suffix="ms" prefix="<" /></strong>
              <span>Response Time</span>
            </div>
          </div>
        </div>

        <div className="landing-hero-scroll-hint">
          <ChevronDown size={22} />
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="landing-section" id="features">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <span className="landing-badge">Core Capabilities</span>
            <h2>Built for Precision Engineering</h2>
            <p>Every module is purpose-built for transport phenomena diagnostics — from laminar pipe flow to complex industrial heat exchangers.</p>
          </div>
          <div className="landing-features-grid">
            <FeatureCard icon={<Thermometer size={28} />} title="Heat Transfer Analysis" description="Compute convective, conductive, and radiative heat transfer coefficients across complex geometries with Nusselt correlations." delay={0} />
            <FeatureCard icon={<Droplets size={28} />} title="Fluid Flow Diagnostics" description="Reynolds number classification, friction factor calculation, and pressure drop analysis for pipe networks and open channels." delay={100} />
            <FeatureCard icon={<Gauge size={28} />} title="Pressure Drop Mapping" description="Darcy-Weisbach and Colebrook-White solvers for accurate minor and major loss computation in industrial piping." delay={200} />
            <FeatureCard icon={<Cpu size={28} />} title="AI Root-Cause Analysis" description="Automated hypothesis generation and validation using physics-informed reasoning trees and anomaly detection." delay={300} />
            <FeatureCard icon={<GitBranch size={28} />} title="Diagnostic Traces" description="Every calculation is explainable — full intermediate step tracing with equations, units, and physical assumptions." delay={400} />
            <FeatureCard icon={<ShieldCheck size={28} />} title="Bounty System" description="Industrial bounty workflow: submit problems, receive student diagnoses, and evaluate with structured scoring rubrics." delay={500} />
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="landing-section landing-section-dark" id="how-it-works">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <span className="landing-badge landing-badge-light">Workflow</span>
            <h2>How It Works</h2>
            <p>From problem statement to validated diagnosis in four seamless steps.</p>
          </div>
          <div className="landing-steps-grid">
            {[
              { num: "01", icon: <FlaskConical size={24} />, title: "Define the Problem", desc: "Create a diagnostic bounty describing the anomalous operating conditions — unexpected pressure drop, poor heat transfer, etc." },
              { num: "02", icon: <Activity size={24} />, title: "Submit Parameters", desc: "Enter fluid properties (ρ, μ), pipe geometry, operating conditions, and your diagnostic hypotheses." },
              { num: "03", icon: <Cpu size={24} />, title: "Engine Computes", desc: "Our Java physics engine calculates Reynolds number, friction factor, Nusselt number, and pressure drop. AI generates root-cause analysis." },
              { num: "04", icon: <CheckCircle2 size={24} />, title: "Review Trace", desc: "Inspect every intermediate calculation, validate hypotheses against computed results, and build your diagnostic portfolio." },
            ].map((step, i) => (
              <div key={step.num} className="landing-step-card" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="landing-step-num">{step.num}</div>
                <div className="landing-step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── METRICS ─── */}
      <section className="landing-section" id="metrics">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <span className="landing-badge">Performance</span>
            <h2>Engineered for Results</h2>
            <p>Real-world metrics from production diagnostic runs.</p>
          </div>
          <div className="landing-metrics-grid">
            {[
              { icon: <Flame size={32} />, value: <AnimatedCounter end={2400} suffix="+" />, label: "Diagnostic Traces", color: "#ff6b35" },
              { icon: <Wind size={32} />, value: <AnimatedCounter end={6} />, label: "Transport Phenomena", color: "#0b7285" },
              { icon: <TrendingUp size={32} />, value: <AnimatedCounter end={97} suffix="%" />, label: "Student Pass Rate", color: "#2f9e44" },
              { icon: <Star size={32} />, value: <AnimatedCounter end={4} suffix=".8" />, label: "Avg. Eval Score", color: "#f59f00" },
            ].map((m, i) => (
              <div key={i} className="landing-metric-card" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="landing-metric-icon" style={{ color: m.color, background: `${m.color}18` }}>{m.icon}</div>
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DIAGNOSTIC CATEGORIES ─── */}
      <section className="landing-section landing-section-dark" id="diagnostics">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <span className="landing-badge landing-badge-light">Diagnostic Domains</span>
            <h2>Three Pillars of Transport</h2>
            <p>Covering the full spectrum of transport phenomena: momentum, heat, and mass transfer.</p>
          </div>
          <div className="landing-pillars-grid">
            {[
              {
                icon: <Waves size={36} />,
                title: "Momentum Transfer",
                items: ["Pipe pressure drop", "Friction factor (f)", "Reynolds number (Re)", "Minor losses (K-values)", "Pump curve diagnostics"],
                accent: "#0b7285",
              },
              {
                icon: <Flame size={36} />,
                title: "Heat Transfer",
                items: ["Nusselt correlations (Nu)", "Convection coefficients (h)", "LMTD calculations", "Fin efficiency", "Fouling resistance (Rf)"],
                accent: "#ff6b35",
              },
              {
                icon: <Droplets size={36} />,
                title: "Mass Transfer",
                items: ["Sherwood number (Sh)", "Diffusion coefficients", "Mass transfer rates", "Concentration profiles", "Absorption column sizing"],
                accent: "#7048e8",
              },
            ].map((pillar, i) => (
              <div key={i} className="landing-pillar-card" style={{ animationDelay: `${i * 140}ms`, borderTopColor: pillar.accent }}>
                <div className="landing-pillar-icon" style={{ color: pillar.accent, background: `${pillar.accent}15` }}>{pillar.icon}</div>
                <h3>{pillar.title}</h3>
                <ul>
                  {pillar.items.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={15} style={{ color: pillar.accent, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="landing-section landing-cta-section">
        <div className="landing-cta-gradient">
          <ShaderGradientCanvas
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          >
            <ShaderGradient
              type="waterPlane"
              animate="on"
              uTime={1}
              uSpeed={0.2}
              uStrength={1.5}
              uDensity={1.8}
              uFrequency={4}
              uAmplitude={2}
              positionX={0}
              positionY={0}
              positionZ={0}
              rotationX={15}
              rotationY={0}
              rotationZ={0}
              color1="#94ffd1"
              color2="#6bf5ff"
              color3="#ffffff"
              grain="off"
              reflection={0.1}
              wireframe={false}
              shader="defaults"
              cAzimuthAngle={180}
              cPolarAngle={90}
              cDistance={3.6}
              cameraZoom={1}
            />
          </ShaderGradientCanvas>
        </div>
        <div className="landing-section-inner landing-cta-inner">
          <h2>Ready to Diagnose?</h2>
          <p>Launch the full diagnostic dashboard and start analyzing heat transfer, fluid flow, and system performance in real time.</p>
          <div style={{display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px'}}>
            <button className="landing-cta-primary landing-cta-large" onClick={() => navigate("/dashboard")}>
              Launch ChemE Module <ExternalLink size={20} />
            </button>
            <button className="landing-cta-primary landing-cta-large" style={{ background: '#7048e8', borderColor: '#7048e8' }} onClick={() => navigate("/biotech")}>
              Launch Biotech Module <ExternalLink size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <div className="landing-nav-logo">
              <FlaskConical size={18} />
            </div>
            <span>HeatFluid<strong>Dx</strong></span>
          </div>
          <p>AI-powered transport phenomena diagnostic platform. Built with React, Spring Boot, MongoDB, and a physics compute engine.</p>
          <div className="landing-footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#metrics">Results</a>
            <a href="#diagnostics">Diagnostics</a>
          </div>
          <small>© 2026 HeatFluid Diagnostics. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}
