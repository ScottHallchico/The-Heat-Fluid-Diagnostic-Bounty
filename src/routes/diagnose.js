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
const Submission = require("../models/Submission");

// Legacy run endpoint
router.post("/run", async (req, res, next) => {
  try {
    const { submissionId } = req.body;
    const submission = await Submission.findById(submissionId);
    if (!submission) throw httpError(404, "Submission not found");

    const engineTrace = await runDiagnosticEngine({
      submissionId,
      inputData: req.body.inputData || submission.inputData,
      hypotheses: req.body.hypotheses || submission.hypotheses,
      rootCause: req.body.rootCause || submission.rootCause
    });

    const trace = await DiagnosticTrace.findOneAndUpdate(
      { submissionId },
      { submissionId, ...engineTrace },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    submission.traceId = trace._id;
    submission.status = "computed";
    await submission.save();

    res.status(201).json(trace);
  } catch (error) {
    next(error);
  }
});

router.post("/validate", async (req, res, next) => {
  try {
    const axios = require("axios");
    const { env } = require("../config/env");
    const { data } = await axios.post(`${env.javaEngineUrl}/compute/validate`, req.body);
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 502;
    const message = err.response?.data?.error || "Java compute engine error";
    next(httpError(status, message));
  }
});

// Run diagnosis (New workflow)
router.post("/", async (req, res, next) => {
  try {
    const { pilotDataId, industrialDataId, submissionId } = req.body;
    
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

    // Integrate the Java engine (runDiagnosticEngine) for physics verification
    let physicsTrace = null;
    try {
      const javaPayload = {
        fluidProperties: { 
          rho: industryData.density || pilotData.density || 997, 
          mu: industryData.viscosity || pilotData.viscosity || 0.00089 
        },
        geometry: { 
          diameter: industryData.pipeDiameter || industryData.tubeDiameter || pilotData.tubeDiameter || 0.05, 
          length: industryData.pipeLength || industryData.tubeLength || pilotData.tubeLength || 25, 
          roughness: industryData.surfaceRoughness || 0.000045 
        },
        operatingConditions: { 
          flowRate: industryData.flowRate || industryData.hotFluidFlowRate || pilotData.flowRate || 0.004, 
          temperature: industryData.temperature || 25 
        }
      };
      physicsTrace = await runDiagnosticEngine(javaPayload);
    } catch (err) {
      console.warn("Java Engine failed or skipped:", err.message);
    }

    const report = {
      comparison,
      hypotheses: validatedHypotheses,
      rankedCauses,
      rca,
      recommendations,
      physicsTrace,
      timestamp: new Date()
    };

    // Store the report in DiagnosticTrace
    // If a submissionId was provided (from the Bounty integration), link it
    const traceData = {
      submissionId: submissionId || pilotDataId, // Fallback for standalone mode
      layers: { integral: {}, differential: {}, scaling: {} },
      analyticsData: [],
      inferredCauses: rankedCauses.map(r => r.cause),
      validation: { checksPassed: true, warnings: [] },
      flowRegime: "unknown"
    };

    let trace;
    try {
      trace = await DiagnosticTrace.create(traceData);
    } catch (e) {
      if (e.code === 11000) {
        // Handle unique constraint on submissionId
        trace = await DiagnosticTrace.findOneAndUpdate(
          { submissionId: traceData.submissionId },
          traceData,
          { new: true }
        );
      } else {
        throw e;
      }
    }

    if (submissionId) {
      const Submission = require("../models/Submission");
      await Submission.findByIdAndUpdate(submissionId, {
        traceId: trace._id,
        status: "computed"
      });
    }

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
