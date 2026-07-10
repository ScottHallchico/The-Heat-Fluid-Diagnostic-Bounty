const router = require("express").Router();
const Equipment = require("../models/Equipment");

router.get("/", async (req, res, next) => {
  try {
    const equipment = await Equipment.find({});
    res.json(equipment);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const equipment = await Equipment.create(req.body);
    res.status(201).json(equipment);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
