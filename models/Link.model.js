const { Schema, model } = require('mongoose')

/*
  Links are used to implement list of names in the wishlist of a used
  for a given group
*/

const linkSchema = new Schema(
  {
    wishlist: { type: Schema.Types.ObjectId, ref: 'Wishlist', required: true },
    name: { type: Schema.Types.ObjectId, ref: 'Name', required: true },
    weight: {
      type: Number,
      default: 0,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
)

const Link = model('Link', linkSchema)

module.exports = Link
