const router = require("express").Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "transport-diagnostic-mongodb-backend" });
});

router.use("/users", require("./users"));
router.use("/bounties", require("./bounties"));
router.use("/submissions", require("./submissions"));
router.use("/diagnose", require("./diagnose"));
router.use("/diagnostic-traces", require("./diagnosticTraces"));
router.use("/datasets", require("./datasets"));
router.use("/evaluations", require("./evaluations"));
router.use("/equipment", require("./equipment"));
router.use("/pilot-data", require("./pilotData"));
router.use("/industry-data", require("./industryData"));

// The new diagnostic routes
router.use("/biotech", require("./biotech"));
router.use("/run-diagnosis", require("./diagnose"));
router.get("/comparison", (req, res) => res.json({ message: "Comparison API" }));
router.get("/root-cause", (req, res) => res.json({ message: "Root Cause API" }));
router.get("/recommendations", (req, res) => res.json({ message: "Recommendations API" }));
router.get("/report", (req, res) => res.json({ message: "Report API" }));

module.exports = router;
