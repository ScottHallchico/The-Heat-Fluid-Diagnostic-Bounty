function comparePlants(pilotData, industryData) {
  const comparison = {};
  
  // Convert Mongoose documents to plain objects if necessary
  const pilot = pilotData.toObject ? pilotData.toObject() : pilotData;
  const industry = industryData.toObject ? industryData.toObject() : industryData;
  
  // Dynamically iterate over all keys instead of a hardcoded list
  for (const param of Object.keys(pilot)) {
    // Skip database specific fields and non-numeric fields if necessary
    if (param === '_id' || param === '__v' || param === 'equipmentId') continue;
    
    if (pilot[param] !== undefined && industry[param] !== undefined) {
      const pilotVal = pilot[param];
      const indVal = industry[param];
      const difference = indVal - pilotVal;
      const percentageDifference = pilotVal !== 0 ? (difference / pilotVal) * 100 : 0;
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
