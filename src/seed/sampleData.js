const mongoose = require("mongoose");
const { env } = require("../config/env");
const Bounty = require("../models/Bounty");
const User = require("../models/User");
const Dataset = require("../models/Dataset");
const Equipment = require("../models/Equipment");

async function seed() {
  await mongoose.connect(env.mongodbUri);
  console.log("Dropping existing database...");
  await mongoose.connection.db.dropDatabase();

  let user = await User.findOne({ email: "student@example.com" });
  if (!user) {
    user = await User.create({
      name: "Lead Engineer",
      email: "student@example.com",
      role: "student"
    });
  }

  console.log("Seeding Equipment library...");
  const equipmentList = [
    { 
      name: 'Shell & Tube Heat Exchanger', 
      requiredInputs: ['tubeDiameter', 'tubeLength', 'numberOfTubes', 'shellDiameter', 'density', 'viscosity', 'specificHeat', 'thermalConductivity', 'foulingFactor', 'hotFluidFlowRate', 'coldFluidFlowRate', 'hotInletTemperature', 'hotOutletTemperature', 'coldInletTemperature', 'coldOutletTemperature', 'pressure'], 
      outputs: ['reynoldsNumber', 'nusseltNumber', 'overallU', 'heatDuty', 'lmtd', 'pressureDrop'] 
    },
    { 
      name: 'Pump', 
      requiredInputs: ['suctionPressure', 'dischargePressure', 'flowRate', 'pumpSpeed', 'motorPower', 'density', 'viscosity', 'pipeDiameter', 'pipeLength', 'npshAvailable'], 
      outputs: ['pumpHead', 'pumpEfficiency', 'pressureRise', 'hydraulicPower', 'cavitationCheck'] 
    },
    { 
      name: 'CSTR', 
      requiredInputs: ['reactorVolume', 'feedFlowRate', 'feedConcentration', 'temperature', 'pressure', 'residenceTime', 'agitatorSpeed', 'catalystLoading', 'rateConstant'], 
      outputs: ['residenceTime', 'conversion', 'reactionRate', 'mixingEfficiency'] 
    },
    { 
      name: 'PFR', 
      requiredInputs: ['reactorLength', 'reactorDiameter', 'feedFlowRate', 'feedConcentration', 'temperature', 'pressure', 'catalystLoading'], 
      outputs: ['residenceTime', 'conversion', 'pressureDrop', 'velocity'] 
    },
    { 
      name: 'Distillation Column', 
      requiredInputs: ['feedFlowRate', 'feedComposition', 'temperature', 'pressure', 'refluxRatio', 'reboilerDuty', 'condenserDuty', 'numberOfTrays', 'trayEfficiency'], 
      outputs: ['productPurity', 'recovery', 'columnPressureDrop', 'refluxRequirement', 'separationEfficiency'] 
    }
  ];
  for (const eq of equipmentList) {
    await Equipment.create(eq);
  }

  console.log("Seeding Bounties (Questions 1-15)...");
  const bountiesData = [
    // Shell & Tube Heat Exchanger
    {
      title: "Q1: Low Heat Transfer Efficiency",
      description: "The pilot plant achieves 95% heat transfer efficiency, while the industrial heat exchanger achieves only 72%. Why is the industrial unit underperforming?",
      category: "heat",
      tags: ["heat_exchanger", "efficiency", "fouling"],
      difficulty: "medium",
      expectedOutputs: ["U", "LMTD", "Q", "ΔP"]
    },
    {
      title: "Q2: High Pressure Drop",
      description: "The pressure drop across the shell-and-tube heat exchanger has increased by 40% over the last six months. What is causing this increase?",
      category: "momentum",
      tags: ["heat_exchanger", "pressure_drop", "blockage"],
      difficulty: "medium",
      expectedOutputs: ["U", "LMTD", "Q", "ΔP"]
    },
    {
      title: "Q3: Cold Fluid Outlet Temp Low",
      description: "The outlet temperature of the cold fluid is significantly lower than the design value, even though steam flow remains constant. Why is heat transfer decreasing?",
      category: "heat",
      tags: ["heat_exchanger", "temperature", "scaling"],
      difficulty: "hard",
      expectedOutputs: ["U", "LMTD", "Q", "ΔP"]
    },
    // Pump
    {
      title: "Q4: High Power Consumption",
      description: "The industrial pump consumes 25% more power than the pilot plant while delivering the same flow rate. What could be the reason?",
      category: "momentum",
      tags: ["pump", "power", "efficiency"],
      difficulty: "medium",
      expectedOutputs: ["Head", "Efficiency"]
    },
    {
      title: "Q5: Low Discharge Pressure",
      description: "The discharge pressure of the pump is much lower than expected, resulting in reduced process performance. What is causing the pressure loss?",
      category: "momentum",
      tags: ["pump", "pressure", "wear"],
      difficulty: "hard",
      expectedOutputs: ["Head", "Efficiency"]
    },
    {
      title: "Q6: Vibrations and Noise",
      description: "Frequent pump vibrations and noise are observed during operation, and the flow rate has decreased compared to the pilot plant. What is the probable cause?",
      category: "momentum",
      tags: ["pump", "vibration", "cavitation"],
      difficulty: "medium",
      expectedOutputs: ["Head", "Efficiency"]
    },
    // CSTR
    {
      title: "Q7: Low Conversion in CSTR",
      description: "The pilot plant achieves 92% conversion, whereas the industrial CSTR achieves only 74% conversion. Why has the conversion decreased?",
      category: "reaction",
      tags: ["cstr", "conversion", "mixing"],
      difficulty: "medium",
      expectedOutputs: ["Conversion", "Residence Time"]
    },
    {
      title: "Q8: Slow Reaction Time",
      description: "The reaction takes much longer to reach completion in the industrial reactor than in the pilot plant. What process parameters should be investigated?",
      category: "reaction",
      tags: ["cstr", "kinetics", "temperature"],
      difficulty: "hard",
      expectedOutputs: ["Conversion", "Residence Time"]
    },
    {
      title: "Q9: Low Product Yield",
      description: "Despite maintaining the same feed concentration, the product yield from the industrial CSTR is significantly lower than the pilot plant. What could be the reason?",
      category: "reaction",
      tags: ["cstr", "yield", "deactivation"],
      difficulty: "hard",
      expectedOutputs: ["Conversion", "Residence Time"]
    },
    // PFR
    {
      title: "Q10: PFR Underperformance",
      description: "The product conversion in the industrial Plug Flow Reactor is considerably lower than in the pilot plant. Why is the reactor underperforming?",
      category: "reaction",
      tags: ["pfr", "conversion", "channeling"],
      difficulty: "medium",
      expectedOutputs: ["Conversion", "Pressure Drop"]
    },
    {
      title: "Q11: PFR Pressure Drop",
      description: "A significant pressure drop has developed across the industrial PFR, reducing throughput. What are the possible causes?",
      category: "momentum",
      tags: ["pfr", "pressure_drop", "fouling"],
      difficulty: "medium",
      expectedOutputs: ["Conversion", "Pressure Drop"]
    },
    {
      title: "Q12: Low Residence Time",
      description: "The residence time inside the industrial PFR is lower than the design value, resulting in incomplete conversion. Why is this occurring?",
      category: "reaction",
      tags: ["pfr", "residence_time", "flow_rate"],
      difficulty: "hard",
      expectedOutputs: ["Conversion", "Pressure Drop"]
    },
    // Distillation Column
    {
      title: "Q13: Low Product Purity",
      description: "The pilot plant produces 99% product purity, while the industrial distillation column produces only 93% purity. What factors are responsible for the reduction in separation efficiency?",
      category: "mass_transfer",
      tags: ["distillation", "purity", "reflux"],
      difficulty: "medium",
      expectedOutputs: ["Purity", "Recovery"]
    },
    {
      title: "Q14: High Energy Consumption",
      description: "The energy consumption of the industrial distillation column has increased significantly without improving product purity. Why is the column operating inefficiently?",
      category: "heat",
      tags: ["distillation", "energy", "efficiency"],
      difficulty: "hard",
      expectedOutputs: ["Purity", "Recovery"]
    },
    {
      title: "Q15: Pressure Drop & Purity Loss",
      description: "The pressure drop across the distillation column has increased, and product purity has decreased simultaneously. What could be the underlying problem?",
      category: "mass_transfer",
      tags: ["distillation", "pressure_drop", "flooding"],
      difficulty: "hard",
      expectedOutputs: ["Purity", "Recovery"]
    }
  ];

  for (const b of bountiesData) {
    await Bounty.create({
      ...b,
      metadata: { industry: "chemical", createdBy: user._id }
    });
  }

  await Dataset.create({
    type: "fluid_properties",
    dataClass: "static",
    name: "Water at 25C",
    values: { rho: 997, mu: 0.00089, k: 0.6, Cp: 4180 },
    units: { rho: "kg/m3", mu: "Pa.s", k: "W/m.K", Cp: "J/kg.K" },
    source: "NIST",
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
