const { Schema, model } = require('mongoose')

/*
  Wishlist are used to link a user to a group and a list of
  names.
*/

const wishlistSchema = new Schema(
  {
    group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
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

const Wishlist = model('Wishlist', wishlistSchema)

module.exports = Wishlist
