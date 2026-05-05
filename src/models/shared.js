const mongoose = require("mongoose");

const engineeringInputSchema = new mongoose.Schema(
  {
    fluidProperties: {
      rho: { type: Number, min: 0 },
      mu: { type: Number, min: 0 },
      k: { type: Number, min: 0 },
      Cp: { type: Number, min: 0 }
    },
    geometry: {
      diameter: { type: Number, min: 0 },
      length: { type: Number, min: 0 },
      roughness: { type: Number, min: 0 },
      area: { type: Number, min: 0 }
    },
    operatingConditions: {
      flowRate: { type: Number, min: 0 },
      massFlowRate: { type: Number, min: 0 },
      temperature: Number,
      inletTemperature: Number,
      outletTemperature: Number,
      pressure: Number,
      pumpHead: Number,
      velocity: { type: Number, min: 0 }
    },
    equipmentData: {
      heatExchangerType: String,
      surfaceArea: { type: Number, min: 0 },
      tubeLayout: String,
      tubePitch: { type: Number, min: 0 },
      foulingResistance: { type: Number, min: 0 }
    },
    measurementData: {
      pressureSensors: mongoose.Schema.Types.Mixed,
      temperatureSensors: mongoose.Schema.Types.Mixed,
      flowMeters: mongoose.Schema.Types.Mixed,
      calibration: mongoose.Schema.Types.Mixed,
      samplingFrequency: String
    },
    degradationData: {
      foulingResistanceOverTime: mongoose.Schema.Types.Mixed,
      corrosionData: mongoose.Schema.Types.Mixed,
      depositionThresholds: mongoose.Schema.Types.Mixed
    },
    proceduralData: {
      startupShutdown: String,
      cleaningSchedule: String,
      maintenanceLogs: mongoose.Schema.Types.Mixed,
      valveOperationHistory: mongoose.Schema.Types.Mixed
    },
    environmentalData: {
      ambientTemperature: Number,
      humidity: Number,
      windConditions: String,
      seasonalVariation: String
    }
  },
  { _id: false }
);

const inputTemplateFieldSchema = new mongoose.Schema(
  {
    unit: String,
    required: { type: Boolean, default: false },
    description: String
  },
  { _id: false }
);

const inputTemplateSchema = new mongoose.Schema(
  {
    fluidProperties: {
      rho: inputTemplateFieldSchema,
      mu: inputTemplateFieldSchema,
      k: inputTemplateFieldSchema,
      Cp: inputTemplateFieldSchema
    },
    geometry: {
      diameter: inputTemplateFieldSchema,
      length: inputTemplateFieldSchema,
      roughness: inputTemplateFieldSchema,
      area: inputTemplateFieldSchema
    },
    operatingConditions: {
      flowRate: inputTemplateFieldSchema,
      massFlowRate: inputTemplateFieldSchema,
      temperature: inputTemplateFieldSchema,
      inletTemperature: inputTemplateFieldSchema,
      outletTemperature: inputTemplateFieldSchema,
      pressure: inputTemplateFieldSchema,
      pumpHead: inputTemplateFieldSchema,
      velocity: inputTemplateFieldSchema
    },
    equipmentData: {
      heatExchangerType: inputTemplateFieldSchema,
      surfaceArea: inputTemplateFieldSchema,
      tubeLayout: inputTemplateFieldSchema,
      tubePitch: inputTemplateFieldSchema,
      foulingResistance: inputTemplateFieldSchema
    },
    measurementData: {
      pressureSensors: inputTemplateFieldSchema,
      temperatureSensors: inputTemplateFieldSchema,
      flowMeters: inputTemplateFieldSchema,
      calibration: inputTemplateFieldSchema,
      samplingFrequency: inputTemplateFieldSchema
    },
    degradationData: {
      foulingResistanceOverTime: inputTemplateFieldSchema,
      corrosionData: inputTemplateFieldSchema,
      depositionThresholds: inputTemplateFieldSchema
    },
    proceduralData: {
      startupShutdown: inputTemplateFieldSchema,
      cleaningSchedule: inputTemplateFieldSchema,
      maintenanceLogs: inputTemplateFieldSchema,
      valveOperationHistory: inputTemplateFieldSchema
    },
    environmentalData: {
      ambientTemperature: inputTemplateFieldSchema,
      humidity: inputTemplateFieldSchema,
      windConditions: inputTemplateFieldSchema,
      seasonalVariation: inputTemplateFieldSchema
    }
  },
  { _id: false }
);

module.exports = {
  engineeringInputSchema,
  inputTemplateSchema
};
