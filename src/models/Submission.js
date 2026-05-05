const mongoose = require("mongoose");
const { engineeringInputSchema } = require("./shared");

const submissionSchema = new mongoose.Schema(
  {
    bountyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bounty",
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    inputData: {
      type: engineeringInputSchema,
      required: true
    },
    hypotheses: [
      {
        type: String,
        trim: true
      }
    ],
    rootCause: {
      type: String,
      trim: true
    },
    traceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiagnosticTrace"
    },
    evaluationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evaluation"
    },
    status: {
      type: String,
      enum: ["submitted", "computed", "evaluated"],
      default: "submitted"
    }
  },
  { timestamps: true }
);

submissionSchema.index({ userId: 1, bountyId: 1 });

module.exports = mongoose.model("Submission", submissionSchema);
