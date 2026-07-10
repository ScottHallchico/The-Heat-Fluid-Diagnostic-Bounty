const mongoose = require("mongoose");

const plantDataSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true
    },
    density: Number,
    viscosity: Number,
    flowRate: Number,
    velocity: Number,
    pressure: Number,
    temperature: Number,
    pipeDiameter: Number,
    pipeLength: Number,
    surfaceRoughness: Number,
    specificHeat: Number,
    thermalConductivity: Number,
    heatDuty: Number,
    overallU: Number,
    residenceTime: Number,
    foulingFactor: Number,
    conversion: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("IndustrialPlant", plantDataSchema);
