function evaluateRules(comparison) {
  const rules = [
    {
      condition: (c) => c.pressure?.percentageDifference > 10 && c.overallU?.percentageDifference < -10 && c.velocity?.percentageDifference < -5,
      cause: "Tube Fouling",
      reason: "Increased resistance to flow and decreased heat transfer efficiency.",
      confidence: 92,
      evidence: ["Pressure Drop \u2191", "Overall U \u2193", "Velocity \u2193"]
    },
    {
      condition: (c) => c.pressure?.percentageDifference > 20 && c.overallU?.percentageDifference < -20,
      cause: "Scaling",
      reason: "Significant build-up on heat transfer surfaces.",
      confidence: 84,
      evidence: ["Pressure Drop \u2191\u2191", "Overall U \u2193\u2193"]
    },
    {
      condition: (c) => c.flowRate?.percentageDifference < -15 && c.pressure?.percentageDifference < -10,
      cause: "Pump Wear",
      reason: "Reduced capability of the pump to deliver flow and pressure.",
      confidence: 70,
      evidence: ["Flow Rate \u2193", "Pressure \u2193"]
    },
    {
      condition: (c) => c.pressure?.percentageDifference > 15 && c.flowRate?.percentageDifference < -10,
      cause: "Valve Restriction",
      reason: "A downstream valve is partially closed or blocked.",
      confidence: 66,
      evidence: ["Pressure \u2191", "Flow Rate \u2193"]
    },
    {
      condition: (c) => c.conversion?.percentageDifference < -10 && c.residenceTime?.percentageDifference < -10,
      cause: "Short Circuiting / Channeling",
      reason: "Fluid is bypassing the active zones, reducing effective residence time and conversion.",
      confidence: 80,
      evidence: ["Conversion \u2193", "Residence Time \u2193"]
    }
  ];

  const hypotheses = [];
  for (const rule of rules) {
    try {
      if (rule.condition(comparison)) {
        hypotheses.push({
          cause: rule.cause,
          reason: rule.reason,
          confidence: rule.confidence,
          evidence: rule.evidence
        });
      }
    } catch (e) {
      // safe evaluation
    }
  }
  return hypotheses;
}

module.exports = { evaluateRules };
