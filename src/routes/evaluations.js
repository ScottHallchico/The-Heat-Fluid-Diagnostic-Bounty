const router = require("express").Router();
const Evaluation = require("../models/Evaluation");
const Submission = require("../models/Submission");
const User = require("../models/User");
const { httpError } = require("../utils/httpError");

router.post("/", async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.body.submissionId);
    if (!submission) throw httpError(404, "Submission not found");

    const evaluation = await Evaluation.create(req.body);

    submission.evaluationId = evaluation._id;
    submission.status = "evaluated";
    await submission.save();

    await refreshUserAverageScore(submission.userId);

    res.status(201).json(evaluation);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id).populate(
      "submissionId"
    );
    if (!evaluation) throw httpError(404, "Evaluation not found");
    res.json(evaluation);
  } catch (error) {
    next(error);
  }
});

async function refreshUserAverageScore(userId) {
  const submissions = await Submission.find({ userId }).populate("evaluationId");
  const scores = submissions
    .map((submission) => submission.evaluationId?.finalScore)
    .filter((score) => typeof score === "number");

  const averageScore =
    scores.length === 0
      ? 0
      : scores.reduce((sum, score) => sum + score, 0) / scores.length;

  await User.findByIdAndUpdate(userId, {
    "portfolio.averageScore": Number(averageScore.toFixed(2))
  });
}

module.exports = router;
