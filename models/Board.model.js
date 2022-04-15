const { Schema, model } = require('mongoose')

/*
  Board are used to put lists and users in common around naming a baby
*/

const boardSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: {
      type: String,
      required: true,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
)

const Board = model('Board', boardSchema)

module.exports = Board
