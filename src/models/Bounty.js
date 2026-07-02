const mongoose = require("mongoose");
const { inputTemplateSchema } = require("./shared");

const bountySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ["momentum", "heat", "mass", "reaction_engineering", "chemical_processes"]
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true
      }
    ],
    inputTemplate: {
      type: inputTemplateSchema,
      required: true
    },
    expectedOutputs: [
      {
        type: String,
        trim: true
      }
    ],
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium"
    },
    metadata: {
      industry: { type: String, trim: true },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  },
  { timestamps: true }
);

bountySchema.index({ category: 1, difficulty: 1 });
bountySchema.index({ tags: 1 });

module.exports = mongoose.model("Bounty", bountySchema);
