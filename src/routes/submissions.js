const router = require("express").Router();
const Bounty = require("../models/Bounty");
const Submission = require("../models/Submission");
const User = require("../models/User");
const { httpError } = require("../utils/httpError");

router.post("/", async (req, res, next) => {
  try {
    const [bounty, user] = await Promise.all([
      Bounty.findById(req.body.bountyId),
      User.findById(req.body.userId)
    ]);

    if (!bounty) throw httpError(404, "Bounty not found");
    if (!user) throw httpError(404, "User not found");

    const submission = await Submission.create(req.body);

    await User.findByIdAndUpdate(req.body.userId, {
      $addToSet: { "portfolio.submissions": submission._id }
    });

    res.status(201).json(submission);
  } catch (error) {
    next(error);
  }
});

router.get("/user/:userId", async (req, res, next) => {
  try {
    const submissions = await Submission.find({ userId: req.params.userId })
      .populate("bountyId", "title category difficulty")
      .populate("traceId")
      .populate("evaluationId")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("bountyId")
      .populate("userId", "name email role")
      .populate("traceId")
      .populate("evaluationId");

    if (!submission) throw httpError(404, "Submission not found");
    res.json(submission);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
