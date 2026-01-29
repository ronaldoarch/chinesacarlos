import express from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { isAdmin } from '../middleware/admin.middleware.js'
import User from '../models/User.model.js'
import Referral from '../models/Referral.model.js'
import Transaction from '../models/Transaction.model.js'

const router = express.Router()

// @route   GET /api/affiliate/stats
// @desc    Get affiliate statistics for current user
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)

    // Get all referrals
    const referrals = await Referral.find({ referrer: userId })
      .populate('referred', 'username phone createdAt')
      .sort({ createdAt: -1 })

    // Calculate statistics
    const totalReferrals = referrals.length
    const qualifiedReferrals = referrals.filter(r => r.status === 'qualified').length
    const rewardedReferrals = referrals.filter(r => r.status === 'rewarded').length

    // Calculate totals from referrals
    const totalDeposits = referrals.reduce((sum, r) => sum + (r.totalDeposits || 0), 0)
    const totalBets = referrals.reduce((sum, r) => sum + (r.totalBets || 0), 0)
    const totalRewards = referrals.reduce((sum, r) => sum + (r.rewardAmount || 0), 0)

    res.json({
      success: true,
      data: {
        referralCode: user.referralCode,
        affiliateBalance: user.affiliateBalance || 0,
        totalReferrals,
        qualifiedReferrals,
        rewardedReferrals,
        totalDeposits,
        totalBets,
        totalRewards,
        referrals: referrals.map(r => ({
          id: r._id,
          referred: {
            username: r.referred?.username,
            phone: r.referred?.phone,
            createdAt: r.referred?.createdAt
          },
          status: r.status,
          totalDeposits: r.totalDeposits,
          totalBets: r.totalBets,
          rewardAmount: r.rewardAmount,
          qualifiedAt: r.qualifiedAt,
          rewardedAt: r.rewardedAt,
          createdAt: r.createdAt
        }))
      }
    })
  } catch (error) {
    console.error('Get affiliate stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas de afiliado',
      error: error.message
    })
  }
})

// @route   POST /api/affiliate/withdraw
// @desc    Withdraw affiliate balance
// @access  Private
router.post('/withdraw', protect, async (req, res) => {
  try {
    const { amount } = req.body
    const user = await User.findById(req.user._id)

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valor inválido'
      })
    }

    if (user.affiliateBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Saldo de afiliado insuficiente'
      })
    }

    // Transfer from affiliate balance to main balance
    user.affiliateBalance -= amount
    user.balance += amount
    await user.save()

    res.json({
      success: true,
      message: 'Transferência realizada com sucesso',
      data: {
        transferredAmount: amount,
        newAffiliateBalance: user.affiliateBalance,
        newBalance: user.balance
      }
    })
  } catch (error) {
    console.error('Affiliate withdraw error:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao realizar transferência',
      error: error.message
    })
  }
})

// @route   GET /api/affiliate/admin/all
// @desc    Get all affiliates (admin)
// @access  Private/Admin
router.get('/admin/all', protect, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    // Build query
    const query = {}
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { referralCode: { $regex: search, $options: 'i' } }
      ]
    }

    // Get users with referrals
    const users = await User.find(query)
      .select('username referralCode affiliateBalance totalReferrals qualifiedReferrals createdAt')
      .sort({ totalReferrals: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await User.countDocuments(query)

    // Get detailed stats for each user
    const affiliates = await Promise.all(
      users.map(async (user) => {
        const referrals = await Referral.find({ referrer: user._id })
        const qualified = referrals.filter(r => r.status === 'qualified').length
        const totalDeposits = referrals.reduce((sum, r) => sum + (r.totalDeposits || 0), 0)
        const totalBets = referrals.reduce((sum, r) => sum + (r.totalBets || 0), 0)
        const totalRewards = referrals.reduce((sum, r) => sum + (r.rewardAmount || 0), 0)

        return {
          id: user._id,
          username: user.username,
          referralCode: user.referralCode,
          affiliateBalance: user.affiliateBalance || 0,
          totalReferrals: referrals.length,
          qualifiedReferrals: qualified,
          totalDeposits,
          totalBets,
          totalRewards,
          createdAt: user.createdAt
        }
      })
    )

    res.json({
      success: true,
      data: {
        affiliates,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    })
  } catch (error) {
    console.error('Get all affiliates error:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar afiliados',
      error: error.message
    })
  }
})

// @route   GET /api/affiliate/admin/:userId
// @desc    Get affiliate details (admin)
// @access  Private/Admin
router.get('/admin/:userId', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      })
    }

    const referrals = await Referral.find({ referrer: user._id })
      .populate('referred', 'username phone balance totalDeposits totalBets createdAt')
      .sort({ createdAt: -1 })

    const stats = {
      totalReferrals: referrals.length,
      qualifiedReferrals: referrals.filter(r => r.status === 'qualified').length,
      rewardedReferrals: referrals.filter(r => r.status === 'rewarded').length,
      totalDeposits: referrals.reduce((sum, r) => sum + (r.totalDeposits || 0), 0),
      totalBets: referrals.reduce((sum, r) => sum + (r.totalBets || 0), 0),
      totalRewards: referrals.reduce((sum, r) => sum + (r.rewardAmount || 0), 0)
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          referralCode: user.referralCode,
          affiliateBalance: user.affiliateBalance || 0,
          createdAt: user.createdAt
        },
        stats,
        referrals: referrals.map(r => ({
          id: r._id,
          referred: r.referred,
          status: r.status,
          totalDeposits: r.totalDeposits,
          totalBets: r.totalBets,
          rewardAmount: r.rewardAmount,
          qualifiedAt: r.qualifiedAt,
          rewardedAt: r.rewardedAt,
          createdAt: r.createdAt
        }))
      }
    })
  } catch (error) {
    console.error('Get affiliate details error:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar detalhes do afiliado',
      error: error.message
    })
  }
})

export default router
