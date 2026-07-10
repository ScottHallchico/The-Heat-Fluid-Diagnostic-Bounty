const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    requiredInputs: [
      {
        type: String,
        trim: true
      }
    ],
    requiredEquations: [
      {
        type: String,
        trim: true
      }
    ],
    diagnosticRules: [
      {
        type: String,
        trim: true
      }
    ],
    outputs: [
      {
        type: String,
        trim: true
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Equipment", equipmentSchema);
