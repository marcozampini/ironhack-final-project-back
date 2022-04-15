const { Schema, model } = require('mongoose')

/*
  List are used to link a user to a board and a list of
  names.
*/

const listSchema = new Schema(
  {
    board: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status : {
      type: String,
      enum: ['pending', 'accepted', 'archived'],
      required: true
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
)

const List = model('List', listSchema)

module.exports = List
