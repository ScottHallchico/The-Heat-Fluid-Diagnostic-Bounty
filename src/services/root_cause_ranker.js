function rankRootCauses(validatedHypotheses) {
  return validatedHypotheses.sort((a, b) => b.confidence - a.confidence);
}

module.exports = { rankRootCauses };
