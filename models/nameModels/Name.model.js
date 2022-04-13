const { Schema, model } = require("mongoose");

const nameSchema = new Schema(
  {
    value: {
      type: String,
      required: true
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Name = model("Name", nameSchema);

module.exports = Name;
