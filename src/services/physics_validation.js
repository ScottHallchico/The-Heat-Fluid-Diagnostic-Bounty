function validateHypotheses(hypotheses, comparison) {
  const validated = [];
  for (const h of hypotheses) {
    let isValid = true;
    let validationNote = "";

    if (h.cause === "Valve Restriction") {
      if (comparison.pressure?.difference > 0 && comparison.velocity?.difference < 0) {
        validationNote = "Consistent: Pressure drop increased, Velocity decreased";
      } else {
        isValid = false;
        validationNote = "Inconsistent: Pressure and velocity trends do not match valve restriction";
      }
    } else if (h.cause === "Tube Fouling" || h.cause === "Scaling") {
      if (comparison.overallU?.difference < 0) {
        validationNote = "Consistent: Overall U decreased";
      } else {
        isValid = false;
        validationNote = "Inconsistent: Overall U did not decrease";
      }
    } else if (h.cause === "Pump Wear") {
      if (comparison.flowRate?.difference < 0 && comparison.pressure?.difference < 0) {
        validationNote = "Consistent: Flow rate and pressure decreased";
      } else {
        isValid = false;
        validationNote = "Inconsistent: Pump wear requires decrease in both flow and pressure";
      }
    } else {
      validationNote = "Consistent: No specific physics contradictions found";
    }

    if (isValid) {
      validated.push({
        ...h,
        validation: validationNote
      });
    }
  }
  return validated;
}

module.exports = { validateHypotheses };
