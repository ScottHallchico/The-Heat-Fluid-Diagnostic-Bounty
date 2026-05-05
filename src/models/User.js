const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      enum: ["student", "company", "faculty", "admin"],
      default: "student"
    },
    portfolio: {
      submissions: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Submission"
        }
      ],
      averageScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
