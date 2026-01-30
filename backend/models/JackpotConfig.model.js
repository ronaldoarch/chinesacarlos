import mongoose from 'mongoose'

const jackpotConfigSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      default: 15681020.40,
      min: 0
    }
  },
  { timestamps: true }
)

jackpotConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne()
  if (!config) {
    config = await this.create({ value: 15681020.40 })
  }
  return config
}

export default mongoose.model('JackpotConfig', jackpotConfigSchema)
