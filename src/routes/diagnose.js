const router = require("express").Router();
const PilotPlant = require("../models/PilotPlant");
const IndustrialPlant = require("../models/IndustrialPlant");
const DiagnosticTrace = require("../models/DiagnosticTrace");
const { runDiagnosticEngine } = require("../services/engineService");
const { comparePlants } = require("../services/comparison_engine");
const { evaluateRules } = require("../services/rule_engine");
const { validateHypotheses } = require("../services/physics_validation");
const { rankRootCauses } = require("../services/root_cause_ranker");
const { generateExplainableRCA } = require("../services/explainable_rca");
const { generateRecommendations } = require("../services/recommendation_engine");
const { httpError } = require("../utils/httpError");

// Run diagnosis
router.post("/", async (req, res, next) => {
  try {
    const { pilotDataId, industrialDataId } = req.body;
    
    // Load data
    const pilotData = await PilotPlant.findById(pilotDataId);
    const industryData = await IndustrialPlant.findById(industrialDataId);
    if (!pilotData || !industryData) throw httpError(404, "Plant data not found");

    // We can also call the Java engine here to get intermediate calculations
    // But since pilotData and industryData already have parameters, we just use them for comparison.
    const comparison = comparePlants(pilotData, industryData);
    const hypotheses = evaluateRules(comparison);
    const validatedHypotheses = validateHypotheses(hypotheses, comparison);
    const rankedCauses = rankRootCauses(validatedHypotheses);
    const rca = generateExplainableRCA(rankedCauses, comparison);
    const recommendations = generateRecommendations(rankedCauses);

    const report = {
      comparison,
      hypotheses: validatedHypotheses,
      rankedCauses,
      rca,
      recommendations,
      timestamp: new Date()
    };

    // Store the report in DiagnosticTrace or a new DiagnosticReports collection
    const trace = await DiagnosticTrace.create({
      submissionId: pilotDataId, // Mock submission ID for now
      layers: { integral: {}, differential: {}, scaling: {} },
      analyticsData: [],
      inferredCauses: rankedCauses.map(r => r.cause),
      validation: { checksPassed: true, warnings: [] },
      flowRegime: "unknown"
    });

    res.status(201).json({ report, traceId: trace._id });
  } catch (error) {
    next(error);
  }
});

// GET endpoints for the dashboard
router.get("/comparison/:traceId", async (req, res) => {
  res.json({ message: "Not fully implemented" });
});

module.exports = router;
