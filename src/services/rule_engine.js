function evaluateRules(comparison) {
  const rules = [
    // Shell & Tube
    {
      condition: (c) => c.foulingFactor?.percentageDifference > 10 || (c.hotOutletTemperature?.percentageDifference > 5 && c.coldOutletTemperature?.percentageDifference < -5),
      cause: "Tube Fouling / Scaling",
      reason: "Build-up on heat transfer surfaces is reducing the overall heat transfer coefficient.",
      confidence: 85,
      evidence: ["Thermal efficiency \u2193"]
    },
    {
      condition: (c) => c.pressure?.percentageDifference > 15 && c.hotFluidFlowRate?.percentageDifference < -10,
      cause: "Tube Blockage",
      reason: "Significant flow restriction detected, leading to high pressure and low flow.",
      confidence: 75,
      evidence: ["Pressure \u2191", "Flow Rate \u2193"]
    },
    // Pump
    {
      condition: (c) => c.npshAvailable?.percentageDifference < -10 || c.suctionPressure?.percentageDifference < -15,
      cause: "Cavitation",
      reason: "Available NPSH has dropped below required levels, causing vapor bubbles to form.",
      confidence: 90,
      evidence: ["NPSH \u2193", "Suction Pressure \u2193"]
    },
    {
      condition: (c) => c.motorPower?.percentageDifference > 15 && (c.flowRate?.percentageDifference >= -5 && c.flowRate?.percentageDifference <= 5),
      cause: "Bearing Wear",
      reason: "Pump requires significantly more power to maintain the same hydraulic output, indicating mechanical losses.",
      confidence: 85,
      evidence: ["Motor Power \u2191\u2191", "Flow Rate \u2194"]
    },
    // CSTR
    {
      condition: (c) => c.agitatorSpeed?.percentageDifference < -15,
      cause: "Poor Mixing",
      reason: "Agitator speed is too low to maintain homogeneity, leading to dead zones.",
      confidence: 80,
      evidence: ["Agitator Speed \u2193"]
    },
    {
      condition: (c) => c.rateConstant?.percentageDifference < -10 || c.catalystLoading?.percentageDifference < -10,
      cause: "Catalyst Deactivation",
      reason: "Loss of active sites on the catalyst is slowing down the reaction kinetics.",
      confidence: 88,
      evidence: ["Rate Constant \u2193", "Catalyst Loading \u2193"]
    },
    // PFR
    {
      condition: (c) => c.residenceTime?.percentageDifference < -15 || c.feedFlowRate?.percentageDifference > 15,
      cause: "Channeling / Low Residence Time",
      reason: "Fluid is traveling too quickly through the reactor bed, preventing full conversion.",
      confidence: 75,
      evidence: ["Flow Rate \u2191", "Residence Time \u2193"]
    },
    {
      condition: (c) => c.pressure?.percentageDifference > 20,
      cause: "Catalyst Bed Fouling",
      reason: "Particulate build-up in the plug flow reactor is causing a severe pressure drop.",
      confidence: 80,
      evidence: ["Pressure \u2191\u2191"]
    },
    // Distillation Column
    {
      condition: (c) => c.refluxRatio?.percentageDifference < -10 || c.condenserDuty?.percentageDifference < -10,
      cause: "Low Reflux Ratio",
      reason: "Insufficient liquid is being returned to the column, reducing separation efficiency.",
      confidence: 85,
      evidence: ["Reflux Ratio \u2193"]
    },
    {
      condition: (c) => c.pressure?.percentageDifference > 15 && c.trayEfficiency?.percentageDifference < -10,
      cause: "Flooding / Tray Damage",
      reason: "High pressure drop combined with low efficiency indicates vapor is bypassing liquid or liquid is backing up.",
      confidence: 82,
      evidence: ["Pressure \u2191", "Tray Efficiency \u2193"]
    },
    // Generic Catch-All
    {
      condition: (c) => {
        return Object.values(c).some(val => val.isAbnormal);
      },
      cause: "System Parameter Deviation",
      reason: "Significant deviation detected across one or more critical engineering parameters. Manual inspection required.",
      confidence: 50,
      evidence: ["Abnormal variances detected in parameters"]
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
