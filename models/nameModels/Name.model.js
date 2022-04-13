const { Schema, model } = require("mongoose");

/*
  Name is used to store a given string (a name) and reference it
  in the NameStats model
*/

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
