import mongoose from 'mongoose'

const trackingConfigSchema = new mongoose.Schema(
  {
    // Facebook Pixel ID
    facebookPixelId: {
      type: String,
      default: '',
      trim: true
    },
    // Facebook Access Token
    facebookAccessToken: {
      type: String,
      default: '',
      trim: true
    },
    // URL base do Webhook
    webhookBaseUrl: {
      type: String,
      default: '',
      trim: true
    },
    // Eventos ativos do Facebook (array de strings)
    activeFacebookEvents: {
      type: [String],
      default: ['Lead', 'CompleteRegistration', 'Purchase'],
      enum: ['Lead', 'CompleteRegistration', 'Purchase', 'AddToCart', 'InitiateCheckout', 'ViewContent']
    }
  },
  { timestamps: true }
)

// Ensure only one config exists
trackingConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne()
  if (!config) {
    config = await this.create({})
  }
  return config
}

export default mongoose.model('TrackingConfig', trackingConfigSchema)
