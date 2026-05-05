const router = require("express").Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "transport-diagnostic-mongodb-backend" });
});

router.use("/users", require("./users"));
router.use("/bounties", require("./bounties"));
router.use("/submissions", require("./submissions"));
router.use("/diagnostic-traces", require("./diagnosticTraces"));
router.use("/datasets", require("./datasets"));
router.use("/evaluations", require("./evaluations"));

module.exports = router;
