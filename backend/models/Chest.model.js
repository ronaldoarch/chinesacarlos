import mongoose from 'mongoose'

const chestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['invite', 'vip', 'daily'],
      required: true
    },
    rewardAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['locked', 'unlocked', 'claimed'],
      default: 'locked'
    },
    unlockedAt: {
      type: Date
    },
    claimedAt: {
      type: Date
    },
    metadata: {
      // For invite chests: number of referrals required
      referralsRequired: Number,
      // For VIP chests: level required
      vipLevelRequired: Number,
      // For daily chests: day number
      dayNumber: Number
    }
  },
  {
    timestamps: true
  }
)

// Index for efficient queries
chestSchema.index({ user: 1, type: 1, status: 1 })
chestSchema.index({ user: 1, createdAt: -1 })

export default mongoose.model('Chest', chestSchema)
