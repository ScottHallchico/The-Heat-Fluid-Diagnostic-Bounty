function comparePlants(pilotData, industryData) {
  const comparison = {};
  const parameters = [
    "density", "viscosity", "flowRate", "velocity", "pressure", 
    "temperature", "pipeDiameter", "pipeLength", "surfaceRoughness", 
    "specificHeat", "thermalConductivity", "heatDuty", "overallU", 
    "residenceTime", "foulingFactor", "conversion"
  ];

  for (const param of parameters) {
    if (pilotData[param] !== undefined && industryData[param] !== undefined) {
      const pilot = pilotData[param];
      const industry = industryData[param];
      const difference = industry - pilot;
      const percentageDifference = pilot !== 0 ? (difference / pilot) * 100 : 0;
      let severity = "low";
      if (Math.abs(percentageDifference) > 20) severity = "high";
      else if (Math.abs(percentageDifference) > 10) severity = "medium";

      comparison[param] = {
        pilot,
        industry,
        difference,
        percentageDifference,
        severity,
        isAbnormal: severity === "high"
      };
    }
  }

  return comparison;
}

module.exports = { comparePlants };
