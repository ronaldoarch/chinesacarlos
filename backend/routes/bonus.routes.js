import express from 'express'
import { body, validationResult } from 'express-validator'
import { protect } from '../middleware/auth.middleware.js'
import { isAdmin } from '../middleware/admin.middleware.js'
import BonusConfig from '../models/BonusConfig.model.js'

const router = express.Router()

// @route   GET /api/bonus/config
// @desc    Get bonus config (public - for deposit modal, chests)
// @access  Public
router.get('/config', async (req, res) => {
  try {
    const config = await BonusConfig.getConfig()
    res.json({
      success: true,
      data: {
        minDeposit: config.minDeposit ?? 10,
        maxDeposit: config.maxDeposit ?? 10000,
        firstDepositBonusPercent: config.firstDepositBonusPercent,
        depositTiers: config.depositTiers,
        affiliateBonusPercent: config.affiliateBonusPercent,
        chestTiers: config.chestTiers
      }
    })
  } catch (error) {
    console.error('Get bonus config error:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar configuração de bônus',
      error: error.message
    })
  }
})

// @route   GET /api/bonus/config/admin
// @desc    Get full bonus config (admin)
// @access  Private/Admin
router.get('/config/admin', protect, isAdmin, async (req, res) => {
  try {
    const config = await BonusConfig.getConfig()
    res.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('Get admin bonus config error:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar configuração',
      error: error.message
    })
  }
})

// @route   PUT /api/bonus/config
// @desc    Update bonus config
// @access  Private/Admin
router.put(
  '/config',
  protect,
  isAdmin,
  [
    body('minDeposit').optional().isFloat({ min: 1, max: 100000 }),
    body('maxDeposit').optional().isFloat({ min: 1, max: 1000000 }),
    body('firstDepositBonusPercent').optional().isFloat({ min: 0, max: 100 }),
    body('depositTiers').optional().isArray(),
    body('affiliateBonusPercent').optional().isFloat({ min: 0, max: 100 }),
    body('chestTiers').optional().isArray()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        })
      }

      const config = await BonusConfig.getConfig()
      const { minDeposit, maxDeposit, firstDepositBonusPercent, depositTiers, affiliateBonusPercent, chestTiers } = req.body

      if (minDeposit !== undefined) config.minDeposit = minDeposit
      if (maxDeposit !== undefined) config.maxDeposit = maxDeposit
      if (firstDepositBonusPercent !== undefined) config.firstDepositBonusPercent = firstDepositBonusPercent
      if (depositTiers !== undefined) config.depositTiers = depositTiers
      if (affiliateBonusPercent !== undefined) config.affiliateBonusPercent = affiliateBonusPercent
      if (chestTiers !== undefined) config.chestTiers = chestTiers

      if (config.minDeposit > config.maxDeposit) {
        return res.status(400).json({
          success: false,
          message: 'Valor mínimo não pode ser maior que o valor máximo'
        })
      }

      await config.save()

      res.json({
        success: true,
        message: 'Configuração de bônus atualizada',
        data: config
      })
    } catch (error) {
      console.error('Update bonus config error:', error)
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar configuração',
        error: error.message
      })
    }
  }
)

export default router
