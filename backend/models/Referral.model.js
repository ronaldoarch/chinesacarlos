import mongoose from 'mongoose'

const referralSchema = new mongoose.Schema(
  {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    referred: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    referralCode: {
      type: String,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['pending', 'qualified', 'rewarded'],
      default: 'pending'
    },
    totalDeposits: {
      type: Number,
      default: 0
    },
    totalBets: {
      type: Number,
      default: 0
    },
    rewardAmount: {
      type: Number,
      default: 0
    },
    rewardedAt: {
      type: Date
    },
    qualifiedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

// Indexes
referralSchema.index({ referrer: 1, status: 1 })
referralSchema.index({ referred: 1 })

export default mongoose.model('Referral', referralSchema)
