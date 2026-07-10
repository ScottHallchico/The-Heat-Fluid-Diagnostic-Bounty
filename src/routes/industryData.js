const router = require("express").Router();
const IndustrialPlant = require("../models/IndustrialPlant");

router.post("/", async (req, res, next) => {
  try {
    const data = await IndustrialPlant.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
