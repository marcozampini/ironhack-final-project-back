const { Schema, model } = require("mongoose");

const nameStatsSchema = new Schema(
  {
    name: { type: Schema.Types.ObjectId, ref: 'Name', required: true },
    country: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
    mCount: { type: Number, default: 0 },
    fCount: { type: Number, default: 0 },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const NameStats = model("NameStats", nameStatsSchema);

module.exports = NameStats;
