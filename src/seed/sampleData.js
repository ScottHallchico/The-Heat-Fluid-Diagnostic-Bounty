const mongoose = require("mongoose");
const { env } = require("../config/env");
const Bounty = require("../models/Bounty");
const User = require("../models/User");
const Dataset = require("../models/Dataset");

async function seed() {
  await mongoose.connect(env.mongodbUri);

  const user = await User.create({
    name: "Demo Student",
    email: "student@example.com",
    role: "student"
  });

  await Bounty.create({
    title: "Unexpected pressure drop in pipeline",
    description:
      "A plant reports a higher than expected pressure drop while flow rate remains close to design. Diagnose whether fouling, roughness change, or pump degradation is the likely root cause.",
    category: "momentum",
    tags: ["pressure_drop", "fouling", "pipeline"],
    inputTemplate: {
      fluidProperties: {
        rho: { unit: "kg/m3", required: true },
        mu: { unit: "Pa.s", required: true }
      },
      geometry: {
        diameter: { unit: "m", required: true },
        length: { unit: "m", required: true },
        roughness: { unit: "m", required: true }
      },
      operatingConditions: {
        flowRate: { unit: "m3/s", required: true },
        temperature: { unit: "C", required: false }
      }
    },
    expectedOutputs: ["deltaP", "Re", "frictionFactor"],
    difficulty: "medium",
    metadata: {
      industry: "oil_and_gas",
      createdBy: user._id
    }
  });

  await Dataset.create({
    type: "fluid_properties",
    dataClass: "static",
    name: "Water at 25C",
    values: {
      rho: 997,
      mu: 0.00089,
      k: 0.6,
      Cp: 4180
    },
    units: {
      rho: "kg/m3",
      mu: "Pa.s",
      k: "W/m.K",
      Cp: "J/kg.K"
    },
    source: "NIST Chemistry WebBook / standard reference placeholder",
    sourceType: "nist",
    reliability: "high",
    version: "v1"
  });

  await mongoose.disconnect();
  console.log("Seed data inserted");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
