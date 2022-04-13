const { Schema, model } = require('mongoose')

/*
  Group are used to put wishlists and users in common around naming a baby
*/

const groupSchema = new Schema(
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

const Group = model('Group', groupSchema)

module.exports = Group
