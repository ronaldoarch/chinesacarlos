import mongoose from 'mongoose'

const logoSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true
    },
    altText: {
      type: String,
      default: 'Logo'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

// Ensure only one active logo
logoSchema.pre('save', async function (next) {
  if (this.isActive && this.isNew) {
    // Deactivate all other logos
    await mongoose.model('Logo').updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    )
  }
  next()
})

// Static method to get active logo
logoSchema.statics.getActiveLogo = async function () {
  let logo = await this.findOne({ isActive: true })
  if (!logo) {
    // Create default logo if none exists
    logo = await this.create({
      imageUrl: '/logo_plataforma.png',
      altText: 'Logo',
      isActive: true
    })
  }
  return logo
}

export default mongoose.model('Logo', logoSchema)
