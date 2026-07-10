const router = require("express").Router();
const PilotPlant = require("../models/PilotPlant");

router.post("/", async (req, res, next) => {
  try {
    const data = await PilotPlant.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
