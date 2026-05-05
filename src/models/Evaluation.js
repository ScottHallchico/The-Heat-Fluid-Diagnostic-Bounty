const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema(
  {
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
      unique: true,
      index: true
    },
    scores: {
      physicsAccuracy: {
        type: Number,
        min: 0,
        max: 10,
        required: true
      },
      reasoningQuality: {
        type: Number,
        min: 0,
        max: 10,
        required: true
      },
      validationStrength: {
        type: Number,
        min: 0,
        max: 10,
        required: true
      }
    },
    finalScore: {
      type: Number,
      min: 0,
      max: 10
    },
    rubric: {
      physics: String,
      reasoning: String,
      validation: String
    },
    feedback: String
  },
  { timestamps: true }
);

evaluationSchema.pre("save", function calculateFinalScore(next) {
  const { physicsAccuracy, reasoningQuality, validationStrength } = this.scores;
  this.finalScore =
    0.4 * physicsAccuracy + 0.3 * reasoningQuality + 0.3 * validationStrength;
  next();
});

module.exports = mongoose.model("Evaluation", evaluationSchema);
