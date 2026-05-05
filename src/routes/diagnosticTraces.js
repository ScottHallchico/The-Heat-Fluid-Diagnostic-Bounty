const router = require("express").Router();
const DiagnosticTrace = require("../models/DiagnosticTrace");
const Submission = require("../models/Submission");
const { httpError } = require("../utils/httpError");

router.post("/", async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.body.submissionId);
    if (!submission) throw httpError(404, "Submission not found");

    const trace = await DiagnosticTrace.create(req.body);

    submission.traceId = trace._id;
    submission.status = "computed";
    await submission.save();

    res.status(201).json(trace);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const trace = await DiagnosticTrace.findById(req.params.id).populate(
      "submissionId"
    );
    if (!trace) throw httpError(404, "Diagnostic trace not found");
    res.json(trace);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
