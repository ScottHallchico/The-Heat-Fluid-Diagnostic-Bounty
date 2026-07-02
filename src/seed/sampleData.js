const mongoose = require("mongoose");
const { env } = require("../config/env");
const Bounty = require("../models/Bounty");
const User = require("../models/User");
const Dataset = require("../models/Dataset");

async function seed() {
  await mongoose.connect(env.mongodbUri);
  console.log("Dropping existing database...");
  await mongoose.connection.db.dropDatabase();

  let user = await User.findOne({ email: "student@example.com" });
  if (!user) {
    user = await User.create({
      name: "Demo Student",
      email: "student@example.com",
      role: "student"
    });
  }

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
      industry: "biochemistry",
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

  // BIOTECH BOUNTIES
  await Bounty.create({
    title: "Unexpected Pressure Drop in Bioreactor Piping",
    description: "In a pharmaceutical fermenter, sterile media is pumped through stainless steel piping. Pressure drop has increased over weeks. Diagnose if it is biofilm formation, partial blockage, or pump impeller wear.",
    category: "momentum",
    tags: ["pressure_drop", "biofilm", "biotech"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true }, mu: { unit: "Pa.s", required: true } },
      geometry: { diameter: { unit: "m", required: true }, length: { unit: "m", required: true }, roughness: { unit: "m", required: true } },
      operatingConditions: { flowRate: { unit: "m3/s", required: true } }
    },
    expectedOutputs: ["deltaP", "Re", "frictionFactor"],
    difficulty: "medium",
    metadata: { industry: "biotechnology", createdBy: user._id }
  });

  await Bounty.create({
    title: "Fermenter Jacket Heat Exchanger Underperformance",
    description: "Microbial metabolism generates heat removed by a cooling jacket. The heat transfer coefficient has decreased. Diagnose if it's protein fouling, mineral scale, or biofilm.",
    category: "heat",
    tags: ["fouling", "nusselt", "biotech"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true }, mu: { unit: "Pa.s", required: true }, k: { unit: "W/m.K", required: true }, Cp: { unit: "J/kg.K", required: true } },
      geometry: { diameter: { unit: "m", required: true }, length: { unit: "m", required: true }, area: { unit: "m2", required: true } },
      operatingConditions: { flowRate: { unit: "m3/s", required: true }, inletTemperature: { unit: "C", required: true }, outletTemperature: { unit: "C", required: true } }
    },
    expectedOutputs: ["Nu", "h", "heatDuty"],
    difficulty: "hard",
    metadata: { industry: "biotechnology", createdBy: user._id }
  });

  await Bounty.create({
    title: "Non-Newtonian Fermentation Broth Behaviour",
    description: "A fungal fermentation system produces a broth that exhibits non-Newtonian, shear-thinning behaviour. Standard viscosity measurements fail to predict pressure drop accurately. Use consistency index (K) and flow behaviour index (n) to diagnose.",
    category: "momentum",
    tags: ["non_newtonian", "shear_thinning", "biotech", "rheology"],
    inputTemplate: {
      fluidProperties: { 
        rho: { unit: "kg/m3", required: true }, 
        consistencyIndexK: { unit: "Pa.s^n", required: true },
        flowBehaviorIndexN: { unit: "dimensionless", required: true } 
      },
      geometry: { diameter: { unit: "m", required: true }, length: { unit: "m", required: true }, roughness: { unit: "m", required: true } },
      operatingConditions: { flowRate: { unit: "m3/s", required: true } }
    },
    expectedOutputs: ["deltaP", "Re", "frictionFactor"],
    difficulty: "hard",
    metadata: { industry: "biotechnology", createdBy: user._id }
  });

  await Bounty.create({
    title: "Mixing Regime Misclassification During Scale-Up",
    description: "Bioprocess scaled from 10 L to 10,000 L. The production scale is experiencing poor oxygen transfer and non-uniform mixing. Calculate the Reynolds number at the large scale to determine if the flow regime has incorrectly shifted from turbulent to transitional.",
    category: "momentum",
    tags: ["scale_up", "mixing", "reynolds", "biotech"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true }, mu: { unit: "Pa.s", required: true } },
      geometry: { diameter: { unit: "m", required: true } },
      operatingConditions: { velocity: { unit: "m/s", required: true } }
    },
    expectedOutputs: ["Re"],
    difficulty: "hard",
    metadata: { industry: "biotechnology", createdBy: user._id }
  });

  await Bounty.create({
    title: "Pressure Drop Across Sterile Filtration Systems",
    description: "During downstream processing, fermentation broth is passed through a sterile filter. The transmembrane pressure drop has increased significantly. Diagnose if this is due to progressive membrane fouling (increased resistance) or a pump failure.",
    category: "momentum",
    tags: ["filtration", "fouling", "pressure_drop", "biotech"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true }, mu: { unit: "Pa.s", required: true } },
      geometry: { diameter: { unit: "m", required: true }, length: { unit: "m", required: true }, roughness: { unit: "m", required: true } },
      operatingConditions: { flowRate: { unit: "m3/s", required: true } }
    },
    expectedOutputs: ["deltaP", "frictionFactor"],
    difficulty: "medium",
    metadata: { industry: "biotechnology", createdBy: user._id }
  });

  // CHEMISTRY BOUNTIES
  const chemBounties = require("./chemistryBounties");
  for (const bounty of chemBounties) {
    await Bounty.create({
      ...bounty,
      metadata: { industry: "biochemistry", createdBy: user._id }
    });
  }

  await mongoose.disconnect();
  console.log("Seed data inserted");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
