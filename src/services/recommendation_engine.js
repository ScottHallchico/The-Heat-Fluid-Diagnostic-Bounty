function generateRecommendations(rankedCauses) {
  const recommendations = [];

  for (const rc of rankedCauses) {
    if (rc.cause === "Tube Fouling") {
      recommendations.push("Clean tubes");
      recommendations.push("Perform descaling");
      recommendations.push("Increase inspection frequency");
    } else if (rc.cause === "Scaling") {
      recommendations.push("Perform chemical descaling");
      recommendations.push("Check water treatment parameters");
    } else if (rc.cause === "Pump Wear") {
      recommendations.push("Inspect pump impeller and casing clearances");
      recommendations.push("Schedule pump maintenance or replacement");
    } else if (rc.cause === "Valve Restriction") {
      recommendations.push("Inspect all control and manual valves in the circuit");
      recommendations.push("Check for debris blocking the valve");
    } else if (rc.cause === "Short Circuiting / Channeling") {
      recommendations.push("Inspect internal baffles or distributor plates");
      recommendations.push("Redistribute packing or catalyst bed");
    } else {
      recommendations.push(`Investigate ${rc.cause}`);
    }
  }

  // Deduplicate
  return [...new Set(recommendations)];
}

module.exports = { generateRecommendations };
