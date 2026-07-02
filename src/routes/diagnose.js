const router = require("express").Router();
const DiagnosticTrace = require("../models/DiagnosticTrace");
const Submission = require("../models/Submission");
const { runDiagnosticEngine } = require("../services/engineService");
const { httpError } = require("../utils/httpError");

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

module.exports = router;
