const { Schema, model } = require('mongoose')

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
