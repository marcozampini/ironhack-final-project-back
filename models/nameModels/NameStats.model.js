const { Schema, model } = require("mongoose");

/*
  NameStats are used to count the number of times a name
  was given in a specific country, for male and female
*/

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
