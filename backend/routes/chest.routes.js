import express from 'express'
import { protect } from '../middleware/auth.middleware.js'
import Chest from '../models/Chest.model.js'
import User from '../models/User.model.js'
import Referral from '../models/Referral.model.js'

const router = express.Router()

// @route   GET /api/chests
// @desc    Get user chests
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id
    
    // Get invite chests based on referrals
    const referrals = await Referral.countDocuments({ referrer: userId, status: 'qualified' })
    
    // Define invite chest rewards
    const inviteChests = [
      { referralsRequired: 1, rewardAmount: 10 },
      { referralsRequired: 5, rewardAmount: 40 },
      { referralsRequired: 10, rewardAmount: 50 },
      { referralsRequired: 15, rewardAmount: 50 },
      { referralsRequired: 20, rewardAmount: 50 },
      { referralsRequired: 25, rewardAmount: 50 },
      { referralsRequired: 30, rewardAmount: 50 },
      { referralsRequired: 35, rewardAmount: 50 },
      { referralsRequired: 40, rewardAmount: 50 },
      { referralsRequired: 45, rewardAmount: 50 },
      { referralsRequired: 50, rewardAmount: 50 },
      { referralsRequired: 60, rewardAmount: 100 },
      { referralsRequired: 70, rewardAmount: 100 },
      { referralsRequired: 80, rewardAmount: 100 },
      { referralsRequired: 90, rewardAmount: 100 },
      { referralsRequired: 100, rewardAmount: 100 },
      { referralsRequired: 120, rewardAmount: 200 },
      { referralsRequired: 140, rewardAmount: 200 },
      { referralsRequired: 160, rewardAmount: 200 },
      { referralsRequired: 180, rewardAmount: 200 },
      { referralsRequired: 200, rewardAmount: 200 },
      { referralsRequired: 250, rewardAmount: 500 },
      { referralsRequired: 300, rewardAmount: 500 },
      { referralsRequired: 350, rewardAmount: 500 },
      { referralsRequired: 400, rewardAmount: 500 },
      { referralsRequired: 450, rewardAmount: 500 },
      { referralsRequired: 500, rewardAmount: 500 },
      { referralsRequired: 600, rewardAmount: 1000 },
      { referralsRequired: 700, rewardAmount: 1000 },
      { referralsRequired: 800, rewardAmount: 1000 },
      { referralsRequired: 900, rewardAmount: 1000 },
      { referralsRequired: 1000, rewardAmount: 1088 },
      { referralsRequired: 1200, rewardAmount: 2088 },
      { referralsRequired: 1400, rewardAmount: 2088 },
      { referralsRequired: 1600, rewardAmount: 2088 },
      { referralsRequired: 1800, rewardAmount: 2088 },
      { referralsRequired: 2000, rewardAmount: 2088 },
      { referralsRequired: 2500, rewardAmount: 5288 },
      { referralsRequired: 3000, rewardAmount: 5288 },
      { referralsRequired: 3500, rewardAmount: 5288 },
      { referralsRequired: 4000, rewardAmount: 5288 },
      { referralsRequired: 4500, rewardAmount: 5288 },
      { referralsRequired: 5000, rewardAmount: 5288 },
      { referralsRequired: 6000, rewardAmount: 10888 }
    ]

    const chests = []
    
    // Create or update invite chests
    for (const chestData of inviteChests) {
      let chest = await Chest.findOne({
        user: userId,
        type: 'invite',
        'metadata.referralsRequired': chestData.referralsRequired
      })

      if (!chest) {
        chest = await Chest.create({
          user: userId,
          type: 'invite',
          rewardAmount: chestData.rewardAmount,
          status: referrals >= chestData.referralsRequired ? 'unlocked' : 'locked',
          metadata: { referralsRequired: chestData.referralsRequired }
        })
      } else {
        // Update status if needed
        if (chest.status === 'locked' && referrals >= chestData.referralsRequired) {
          chest.status = 'unlocked'
          chest.unlockedAt = new Date()
          await chest.save()
        }
      }

      chests.push(chest)
    }

    res.json({
      success: true,
      data: {
        chests: chests.sort((a, b) => a.metadata.referralsRequired - b.metadata.referralsRequired),
        totalReferrals: referrals
      }
    })
  } catch (error) {
    console.error('Get chests error:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar baús',
      error: error.message
    })
  }
})

// @route   POST /api/chests/:id/claim
// @desc    Claim chest reward
// @access  Private
router.post('/:id/claim', protect, async (req, res) => {
  try {
    const chest = await Chest.findById(req.params.id)
    
    if (!chest) {
      return res.status(404).json({
        success: false,
        message: 'Baú não encontrado'
      })
    }

    if (chest.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para resgatar este baú'
      })
    }

    if (chest.status === 'locked') {
      return res.status(400).json({
        success: false,
        message: 'Este baú ainda está bloqueado'
      })
    }

    if (chest.status === 'claimed') {
      return res.status(400).json({
        success: false,
        message: 'Este baú já foi resgatado'
      })
    }

    // Add reward to user balance
    const user = await User.findById(req.user._id)
    if (chest.type === 'invite') {
      user.affiliateBalance += chest.rewardAmount
    } else {
      user.balance += chest.rewardAmount
    }
    await user.save()

    // Update chest status
    chest.status = 'claimed'
    chest.claimedAt = new Date()
    await chest.save()

    res.json({
      success: true,
      message: 'Recompensa resgatada com sucesso!',
      data: {
        rewardAmount: chest.rewardAmount,
        newBalance: chest.type === 'invite' ? user.affiliateBalance : user.balance
      }
    })
  } catch (error) {
    console.error('Claim chest error:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao resgatar baú',
      error: error.message
    })
  }
})

export default router
