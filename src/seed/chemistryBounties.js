module.exports = [
  {
    title: "Sudden Increase in Pressure Drop Across a Packed Bed Reactor",
    description: "A packed bed catalytic reactor has operated normally for six months. Recently, operators observed a 35% increase in pressure drop while maintaining the same feed flow rate. Diagnose whether catalyst fouling, particle attrition, bed compaction, or feed contamination is the most likely root cause.",
    category: "momentum",
    tags: ["pressure_drop", "packed_bed", "fouling"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true }, mu: { unit: "Pa.s", required: true } },
      geometry: { diameter: { unit: "m", required: true }, length: { unit: "m", required: true }, area: { unit: "m2", required: false } },
      operatingConditions: { flowRate: { unit: "m3/s", required: true } }
    },
    expectedOutputs: ["deltaP", "Re", "bedVoidFraction"],
    difficulty: "medium"
  },
  {
    title: "Heat Exchanger Losing Thermal Efficiency",
    description: "A shell-and-tube heat exchanger requires significantly more steam to achieve the same outlet temperature as six months ago. Diagnose whether tube-side fouling, shell-side fouling, scaling, or steam supply fluctuations are responsible.",
    category: "heat",
    tags: ["heat_transfer", "fouling", "efficiency"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true }, Cp: { unit: "J/kg.K", required: true } },
      geometry: { area: { unit: "m2", required: true } },
      operatingConditions: { flowRate: { unit: "m3/s", required: true }, inletTemperature: { unit: "C", required: true }, outletTemperature: { unit: "C", required: true } }
    },
    expectedOutputs: ["Nu", "U", "heatDuty"],
    difficulty: "medium"
  },
  {
    title: "Distillation Column Product Off-Specification",
    description: "A distillation column producing ethanol suddenly delivers product below purity specifications despite unchanged feed composition. Diagnose whether tray fouling, flooding, weeping, or reflux ratio deviation is the likely cause.",
    category: "mass",
    tags: ["distillation", "mass_transfer", "flooding"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true } },
      geometry: { diameter: { unit: "m", required: true } },
      operatingConditions: { flowRate: { unit: "m3/s", required: true }, temperature: { unit: "C", required: false }, pressure: { unit: "Pa", required: false } }
    },
    expectedOutputs: ["trayEfficiency", "refluxRatio", "separationEfficiency"],
    difficulty: "hard"
  },
  {
    title: "Reduced Conversion in a CSTR",
    description: "A Continuous Stirred Tank Reactor (CSTR) shows a gradual decrease in conversion over several weeks of operation. Diagnose whether catalyst deactivation, temperature drift, poor mixing, or feed concentration changes are causing the problem.",
    category: "reaction_engineering",
    tags: ["reaction_engineering", "cstr", "catalyst"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true } },
      geometry: { diameter: { unit: "m", required: true } },
      operatingConditions: { flowRate: { unit: "m3/s", required: true }, temperature: { unit: "C", required: true } }
    },
    expectedOutputs: ["conversion", "DamkohlerNumber", "reactionRate"],
    difficulty: "medium"
  },
  {
    title: "Excessive Energy Consumption in Pumping System",
    description: "A chemical plant reports rising electricity costs associated with a process fluid pumping network. Flow rate remains unchanged. Diagnose whether pipe scaling, pump degradation, increased viscosity, or instrumentation errors are responsible.",
    category: "momentum",
    tags: ["pumping", "momentum", "energy"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true }, mu: { unit: "Pa.s", required: true } },
      geometry: { diameter: { unit: "m", required: true }, length: { unit: "m", required: true }, roughness: { unit: "m", required: true } },
      operatingConditions: { flowRate: { unit: "m3/s", required: true }, pumpHead: { unit: "m", required: true } }
    },
    expectedOutputs: ["pumpPower", "deltaP", "frictionFactor"],
    difficulty: "easy"
  },
  {
    title: "Cooling Water Network Underperformance",
    description: "A cooling water system fails to maintain process temperatures during summer operation. Diagnose whether heat exchanger fouling, reduced cooling tower efficiency, pump failure, or excessive thermal load is the root cause.",
    category: "heat",
    tags: ["cooling", "heat_transfer", "fouling"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true }, Cp: { unit: "J/kg.K", required: true } },
      geometry: { area: { unit: "m2", required: true } },
      operatingConditions: { flowRate: { unit: "m3/s", required: true }, inletTemperature: { unit: "C", required: true }, outletTemperature: { unit: "C", required: true } }
    },
    expectedOutputs: ["heatLoad", "coolingCapacity", "outletTemperature"],
    difficulty: "medium"
  },
  {
    title: "Reactor Hot Spot Formation",
    description: "Temperature sensors detect localized hot spots within an exothermic reactor. Diagnose whether catalyst channeling, poor mixing, excessive feed concentration, or cooling failure is responsible.",
    category: "heat",
    tags: ["reactor", "heat_transfer", "hotspot"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true }, k: { unit: "W/m.K", required: true }, Cp: { unit: "J/kg.K", required: true } },
      geometry: { diameter: { unit: "m", required: true }, length: { unit: "m", required: true } },
      operatingConditions: { flowRate: { unit: "m3/s", required: true }, temperature: { unit: "C", required: true } }
    },
    expectedOutputs: ["temperatureProfile", "heatGenerationRate", "hotspotLocation"],
    difficulty: "hard"
  },
  {
    title: "Amine Absorber CO₂ Removal Efficiency Drop",
    description: "A gas sweetening unit is removing less CO₂ than expected. Diagnose whether solvent degradation, packing fouling, reduced circulation rate, or gas bypassing is causing the efficiency loss.",
    category: "mass",
    tags: ["absorption", "mass_transfer", "co2"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true }, mu: { unit: "Pa.s", required: true } },
      geometry: { diameter: { unit: "m", required: true }, length: { unit: "m", required: true } },
      operatingConditions: { flowRate: { unit: "m3/s", required: true }, temperature: { unit: "C", required: true }, pressure: { unit: "Pa", required: true } }
    },
    expectedOutputs: ["absorptionEfficiency", "massTransferCoefficient", "CO2RemovalRate"],
    difficulty: "hard"
  },
  {
    title: "Vacuum Distillation Pressure Instability",
    description: "A vacuum distillation column experiences fluctuating operating pressures, leading to inconsistent product quality. Diagnose whether condenser fouling, vacuum pump degradation, air ingress, or instrumentation malfunction is responsible.",
    category: "chemical_processes",
    tags: ["distillation", "vacuum", "process_control"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true } },
      geometry: { diameter: { unit: "m", required: true } },
      operatingConditions: { pressure: { unit: "Pa", required: true }, flowRate: { unit: "m3/s", required: true } }
    },
    expectedOutputs: ["columnPressure", "condenserDuty", "vacuumEfficiency"],
    difficulty: "hard"
  },
  {
    title: "Unexpected Fouling in Crude Oil Preheater",
    description: "A refinery preheater experiences a continuous decline in heat transfer performance. Diagnose whether asphaltene deposition, scaling, flow maldistribution, or reduced steam quality is the dominant cause.",
    category: "heat",
    tags: ["heat_transfer", "fouling", "refinery"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true }, mu: { unit: "Pa.s", required: true }, Cp: { unit: "J/kg.K", required: true } },
      geometry: { area: { unit: "m2", required: true } },
      operatingConditions: { flowRate: { unit: "m3/s", required: true }, inletTemperature: { unit: "C", required: true }, outletTemperature: { unit: "C", required: true } }
    },
    expectedOutputs: ["foulingFactor", "heatDuty", "overallU"],
    difficulty: "medium"
  },
  {
    title: "Fluidized Bed Reactor Defluidization",
    description: "A fluidized bed reactor exhibits poor solids circulation and uneven temperature distribution. Diagnose whether particle agglomeration, excessive moisture, blower degradation, or distributor plate blockage is responsible.",
    category: "momentum",
    tags: ["fluidization", "momentum", "reactor"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true }, mu: { unit: "Pa.s", required: true } },
      geometry: { diameter: { unit: "m", required: true } },
      operatingConditions: { velocity: { unit: "m/s", required: true }, pressure: { unit: "Pa", required: true } }
    },
    expectedOutputs: ["minimumFluidizationVelocity", "pressureDrop", "bedExpansion"],
    difficulty: "hard"
  },
  {
    title: "Polymerization Reactor Viscosity Increase",
    description: "A polymer production reactor experiences a sudden rise in viscosity, causing mixing difficulties and poor product quality. Diagnose whether reaction runaway, catalyst overdose, temperature control failure, or feed contamination is responsible.",
    category: "reaction_engineering",
    tags: ["reaction_engineering", "viscosity", "polymer"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true }, mu: { unit: "Pa.s", required: true } },
      geometry: { diameter: { unit: "m", required: true } },
      operatingConditions: { temperature: { unit: "C", required: true }, velocity: { unit: "m/s", required: true } }
    },
    expectedOutputs: ["viscosity", "conversion", "mixingPower"],
    difficulty: "hard"
  },
  {
    title: "Spray Dryer Product Moisture Too High",
    description: "A spray drying unit produces powder with moisture content above specifications. Diagnose whether insufficient inlet air temperature, nozzle fouling, reduced airflow, or feed concentration changes are causing the issue.",
    category: "mass",
    tags: ["drying", "mass_transfer", "heat_transfer"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true } },
      geometry: { diameter: { unit: "m", required: true } },
      operatingConditions: { flowRate: { unit: "m3/s", required: true }, inletTemperature: { unit: "C", required: true }, outletTemperature: { unit: "C", required: true } }
    },
    expectedOutputs: ["moistureContent", "dryingRate", "outletAirTemperature"],
    difficulty: "medium"
  },
  {
    title: "Reverse Osmosis Membrane Fouling",
    description: "A desalination unit shows declining permeate flow and increasing pressure requirements. Diagnose whether biofouling, scaling, membrane compaction, or feed pretreatment failure is responsible.",
    category: "mass",
    tags: ["filtration", "mass_transfer", "fouling"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true }, mu: { unit: "Pa.s", required: true } },
      geometry: { area: { unit: "m2", required: true } },
      operatingConditions: { flowRate: { unit: "m3/s", required: true }, pressure: { unit: "Pa", required: true } }
    },
    expectedOutputs: ["permeateFlux", "transmembranePressure", "foulingResistance"],
    difficulty: "medium"
  },
  {
    title: "Reactor Scale-Up Failure",
    description: "A process that achieved 95% conversion in a pilot plant achieves only 70% conversion in a production-scale reactor. Diagnose whether mixing limitations, heat transfer limitations, residence time changes, or catalyst distribution issues caused the scale-up failure.",
    category: "reaction_engineering",
    tags: ["scale_up", "reaction_engineering", "mixing"],
    inputTemplate: {
      fluidProperties: { rho: { unit: "kg/m3", required: true }, mu: { unit: "Pa.s", required: true } },
      geometry: { diameter: { unit: "m", required: true } },
      operatingConditions: { flowRate: { unit: "m3/s", required: true }, temperature: { unit: "C", required: true } }
    },
    expectedOutputs: ["Re", "Nu", "conversion", "residenceTime"],
    difficulty: "hard"
  }
];
