const mongoose = require("mongoose");

const datasetSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "fluid_properties",
        "geometry_equipment",
        "operating_conditions",
        "material_properties",
        "correlation",
        "sensor_measurement",
        "fouling_degradation",
        "procedural",
        "environmental",
        "ground_truth",
        "reference_case"
      ]
    },
    dataClass: {
      type: String,
      enum: ["static", "dynamic", "derived", "diagnostic"],
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    values: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    units: mongoose.Schema.Types.Mixed,
    source: {
      type: String,
      trim: true
    },
    sourceType: {
      type: String,
      enum: [
        "handbook",
        "nist",
        "refprop",
        "plant_scada",
        "aspen_hysys",
        "standard",
        "published_case_study",
        "internal_simulation",
        "manual_entry",
        "other"
      ],
      default: "manual_entry"
    },
    citation: String,
    reliability: {
      type: String,
      enum: ["low", "medium", "high", "verified"],
      default: "medium"
    },
    conventions: {
      unitSystem: {
        type: String,
        enum: ["SI", "Imperial", "mixed"],
        default: "SI"
      },
      notes: String
    },
    version: {
      type: String,
      default: "v1"
    }
  },
  { timestamps: true }
);

datasetSchema.index({ type: 1, name: 1 });

module.exports = mongoose.model("Dataset", datasetSchema);
