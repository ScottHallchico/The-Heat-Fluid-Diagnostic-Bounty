const mongoose = require("mongoose");

const intermediateCalculationSchema = new mongoose.Schema(
  {
    step: {
      type: String,
      required: true,
      trim: true
    },
    value: mongoose.Schema.Types.Mixed,
    unit: String,
    equation: String
  },
  { _id: false }
);

const diagnosticTraceSchema = new mongoose.Schema(
  {
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
      unique: true,
      index: true
    },
    layers: {
      integral: {
        deltaP: Number,
        energyBalance: mongoose.Schema.Types.Mixed,
        heatDuty: Number
      },
      differential: {
        velocityProfile: mongoose.Schema.Types.Mixed,
        temperatureProfile: mongoose.Schema.Types.Mixed,
        boundaryLayer: mongoose.Schema.Types.Mixed
      },
      scaling: {
        Re: Number,
        Pr: Number,
        Nu: Number,
        frictionFactor: Number,
        dimensionlessGroups: mongoose.Schema.Types.Mixed
      }
    },
    flowRegime: {
      type: String,
      enum: ["laminar", "transition", "turbulent", "unknown"],
      default: "unknown"
    },
    intermediateCalculations: [intermediateCalculationSchema],
    inferredCauses: [
      {
        type: String,
        trim: true
      }
    ],
    validation: {
      checksPassed: {
        type: Boolean,
        default: false
      },
      warnings: [String],
      methods: [
        {
          type: String,
          enum: [
            "scaling_analysis",
            "simulation",
            "experimental_analogy",
            "data_analytics",
            "sanity_check",
            "peer_review"
          ]
        }
      ]
    },
    rawEngineResponse: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

module.exports = mongoose.model("DiagnosticTrace", diagnosticTraceSchema);
