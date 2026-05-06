const router = require("express").Router();
const User = require("../models/User");
const Submission = require("../models/Submission");
const { httpError } = require("../utils/httpError");

router.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.email) query.email = req.query.email;
    const users = await User.find(query).limit(20);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw httpError(404, "User not found");
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/portfolio", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw httpError(404, "User not found");

    const submissions = await Submission.find({ userId: req.params.id })
      .populate("bountyId", "title category difficulty")
      .populate("traceId")
      .populate("evaluationId")
      .sort({ createdAt: -1 });

    res.json({
      user,
      submissions,
      averageScore: user.portfolio.averageScore
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
