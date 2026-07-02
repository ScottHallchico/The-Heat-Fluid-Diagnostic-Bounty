const { env } = require("../config/env");

async function runDiagnosticEngine(payload) {
  if (env.useMockEngine) {
    return buildMockTrace(payload);
  }

  const javaPayload = payload.inputData || payload;
  const response = await fetch(`${env.javaEngineUrl}/compute/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(javaPayload)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Java engine failed: ${message || response.statusText}`);
  }

  return response.json();
}

function buildMockTrace(payload) {
  const input = payload.inputData || {};
  const fluid = input.fluidProperties || {};
  const geometry = input.geometry || {};
  const operating = input.operatingConditions || {};

  const rho = Number(fluid.rho || 997);
  const mu = Number(fluid.mu || 0.00089);
  const diameter = Number(geometry.diameter || 0.05);
  const length = Number(geometry.length || 25);
  const roughness = Number(geometry.roughness || 0.000045);
  const flowRate = Number(operating.flowRate || 0.004);
  const area = Math.PI * Math.pow(diameter, 2) / 4;
  const velocity = Number(operating.velocity || flowRate / area);
  const Re = rho * velocity * diameter / mu;
  const frictionFactor = estimateFrictionFactor(Re, roughness, diameter);
  const deltaP = frictionFactor * (length / diameter) * (rho * velocity * velocity / 2);
  const flowRegime = Re < 2300 ? "laminar" : Re < 4000 ? "transition" : "turbulent";

  return {
    layers: {
      integral: {
        deltaP: round(deltaP),
        energyBalance: {
          method: "Darcy-Weisbach pressure drop estimate",
          assumptions: ["steady flow", "single phase fluid", "constant properties"]
        }
      },
      differential: {
        velocityProfile: {
          dominantBehavior:
            flowRegime === "laminar" ? "parabolic profile expected" : "flattened turbulent profile expected"
        },
        boundaryLayer: {
          note: "Boundary layer detail reserved for Java/CFD engine integration."
        }
      },
      scaling: {
        Re: round(Re),
        Pr: fluid.Cp && fluid.k ? round((mu * fluid.Cp) / fluid.k) : null,
        Nu: null,
        frictionFactor: round(frictionFactor)
      }
    },
    flowRegime,
    intermediateCalculations: [
      { step: "Flow area", value: round(area), unit: "m2", equation: "A = pi D^2 / 4" },
      { step: "Velocity", value: round(velocity), unit: "m/s", equation: "v = Q / A" },
      { step: "Reynolds number", value: round(Re), equation: "Re = rho v D / mu" },
      {
        step: "Friction factor",
        value: round(frictionFactor),
        equation: Re < 2300 ? "f = 64 / Re" : "Haaland approximation"
      },
      { step: "Pressure drop", value: round(deltaP), unit: "Pa", equation: "dP = f(L/D)(rho v^2/2)" }
    ],
    inferredCauses: inferMockCauses(deltaP, roughness, payload.hypotheses),
    validation: {
      checksPassed: Number.isFinite(Re) && Number.isFinite(deltaP) && Re > 0 && deltaP > 0,
      warnings: buildWarnings(Re, deltaP, roughness),
      methods: ["scaling_analysis", "sanity_check"]
    },
    rawEngineResponse: {
      source: "mock-node-engine",
      replaceWith: "Set USE_MOCK_ENGINE=false and expose Java POST /compute/run."
    }
  };
}

function estimateFrictionFactor(Re, roughness, diameter) {
  if (Re <= 0) return 0;
  if (Re < 2300) return 64 / Re;
  const relativeRoughness = roughness / diameter;
  return Math.pow(
    -1.8 * Math.log10(Math.pow(relativeRoughness / 3.7, 1.11) + 6.9 / Re),
    -2
  );
}

function inferMockCauses(deltaP, roughness, hypotheses = []) {
  const causes = [];
  if (roughness > 0.0001) causes.push("Elevated roughness suggests fouling or internal corrosion.");
  if (deltaP > 10000) causes.push("Pressure drop is high enough to investigate blockage, fouling, or valve restriction.");
  if (hypotheses.some((item) => String(item).toLowerCase().includes("fouling"))) {
    causes.push("Student hypothesis mentions fouling; compare roughness and cleaning history.");
  }
  return causes.length ? causes : ["No severe anomaly detected in mock calculation; validate against plant data."];
}

function buildWarnings(Re, deltaP, roughness) {
  const warnings = [];
  if (Re > 100000) warnings.push("Very high Reynolds number; confirm flow rate and diameter units.");
  if (deltaP > 100000) warnings.push("Large pressure drop; check whether Pa/kPa units were mixed.");
  if (roughness <= 0) warnings.push("Roughness is missing or zero; friction factor may be optimistic.");
  return warnings;
}

function round(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return value;
  return Number(Number(value).toFixed(4));
}

module.exports = { runDiagnosticEngine };
