const router = require("express").Router();
const Bounty = require("../models/Bounty");
const { httpError } = require("../utils/httpError");

router.post("/", async (req, res, next) => {
  try {
    const bounty = await Bounty.create(req.body);
    res.status(201).json(bounty);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.category) query.category = req.query.category;
    if (req.query.difficulty) query.difficulty = req.query.difficulty;
    if (req.query.tag) query.tags = req.query.tag;

    const bounties = await Bounty.find(query).sort({ createdAt: -1 });
    res.json(bounties);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const bounty = await Bounty.findById(req.params.id);
    if (!bounty) throw httpError(404, "Bounty not found");
    res.json(bounty);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
