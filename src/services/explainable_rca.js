function generateExplainableRCA(rankedCauses, comparison) {
  if (rankedCauses.length === 0) return { fiveWhy: [], fishbone: {} };

  const topCause = rankedCauses[0];
  const fiveWhy = [];
  
  if (topCause.cause === "Tube Fouling") {
    fiveWhy.push("Why did the heat transfer decrease? Overall U \u2193");
    fiveWhy.push("Why did Overall U decrease? Heat Transfer Coefficient \u2193");
    fiveWhy.push("Why did Heat Transfer Coefficient decrease? Thermal resistance increased.");
    fiveWhy.push("Why did thermal resistance increase? Deposition of material on tube walls.");
    fiveWhy.push("Why did material deposit? Tube Fouling.");
  } else if (topCause.cause === "Pump Wear") {
    fiveWhy.push("Why is the system underperforming? Flow rate \u2193");
    fiveWhy.push("Why is flow rate down? Pressure \u2193");
    fiveWhy.push("Why is pressure down? Pump is not delivering required head.");
    fiveWhy.push("Why is pump not delivering head? Increased internal clearances.");
    fiveWhy.push("Why are there increased clearances? Pump Wear.");
  } else if (topCause.cause === "Valve Restriction") {
    fiveWhy.push("Why is the flow rate low? Increased system resistance.");
    fiveWhy.push("Why is system resistance high? Pressure drop \u2191 across the system.");
    fiveWhy.push("Why is pressure drop high? A localized restriction exists.");
    fiveWhy.push("Why is there a restriction? A valve is partially closed or blocked.");
    fiveWhy.push("Why is it blocked? Valve Restriction.");
  } else {
    fiveWhy.push("Anomaly detected in parameters.");
    fiveWhy.push(`Abnormal variations led to ${topCause.cause}.`);
  }

  const fishbone = {
    Machine: topCause.cause === "Pump Wear" ? [topCause.cause] : [],
    Method: [],
    Material: topCause.cause === "Tube Fouling" || topCause.cause === "Scaling" ? [topCause.cause] : [],
    Measurement: comparison.velocity?.isAbnormal ? ["Velocity readings are abnormal"] : [],
    Environment: [],
    People: topCause.cause === "Valve Restriction" ? ["Manual valve misoperation"] : []
  };

  return { fiveWhy, fishbone };
}

module.exports = { generateExplainableRCA };
