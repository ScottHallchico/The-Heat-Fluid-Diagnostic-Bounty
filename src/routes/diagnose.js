const router = require("express").Router();
const axios = require("axios");
const Submission = require("../models/Submission");
const DiagnosticTrace = require("../models/DiagnosticTrace");
const { env } = require("../config/env");
const { httpError } = require("../utils/httpError");

router.post("/run", async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.body.submissionId);
    if (!submission) throw httpError(404, "Submission not found");

    let javaResponse;
    try {
      const { data } = await axios.post(
        `${env.javaEngineUrl}/compute/run`,
        submission.inputData
      );
      javaResponse = data;
    } catch (err) {
      const status = err.response?.status || 502;
      const message = err.response?.data?.error || "Java compute engine error";
      throw httpError(status, message);
    }

    const trace = await DiagnosticTrace.create({
      submissionId: submission._id,
      layers: javaResponse.layers,
      flowRegime: javaResponse.flowRegime,
      inferredCauses: javaResponse.inferredCauses,
      validation: javaResponse.validation,
      rawEngineResponse: javaResponse
    });

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
    const { data } = await axios.post(
      `${env.javaEngineUrl}/compute/validate`,
      req.body
    );
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 502;
    const message = err.response?.data?.error || "Java compute engine error";
    next(httpError(status, message));
  }
});

module.exports = router;
