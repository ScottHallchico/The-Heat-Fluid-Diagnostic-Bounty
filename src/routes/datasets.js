const router = require("express").Router();
const Dataset = require("../models/Dataset");

router.post("/", async (req, res, next) => {
  try {
    const dataset = await Dataset.create(req.body);
    res.status(201).json(dataset);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.type) query.type = req.query.type;

    const datasets = await Dataset.find(query).sort({ type: 1, name: 1 });
    res.json(datasets);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
