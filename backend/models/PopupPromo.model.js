import mongoose from 'mongoose'

const popupPromoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    linkUrl: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: true
    },
    startDate: {
      type: Date,
      default: null
    },
    endDate: {
      type: Date,
      default: null
    },
    showOncePerSession: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

popupPromoSchema.index({ active: 1, startDate: 1, endDate: 1 })
popupPromoSchema.index({ order: 1 })

export default mongoose.model('PopupPromo', popupPromoSchema)
