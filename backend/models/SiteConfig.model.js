import mongoose from 'mongoose'

const siteConfigSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      trim: true,
      default: 'NAKASBET',
      maxlength: [80, 'Nome do site muito longo']
    }
  },
  { timestamps: true }
)

siteConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne()
  if (!config) {
    config = await this.create({ siteName: 'NAKASBET' })
  }
  return config
}

export default mongoose.model('SiteConfig', siteConfigSchema)
