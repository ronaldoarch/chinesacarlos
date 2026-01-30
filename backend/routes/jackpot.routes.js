import express from 'express'
import { body, validationResult } from 'express-validator'
import { protect } from '../middleware/auth.middleware.js'
import { isAdmin } from '../middleware/admin.middleware.js'
import JackpotConfig from '../models/JackpotConfig.model.js'

const router = express.Router()

// @route   GET /api/jackpot
// @desc    Get current jackpot value (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const config = await JackpotConfig.getConfig()
    res.json({
      success: true,
      data: {
        value: config.value,
        updatedAt: config.updatedAt
      }
    })
  } catch (error) {
    console.error('Get jackpot error:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar jackpot',
      error: error.message
    })
  }
})

// @route   PUT /api/jackpot
// @desc    Update jackpot value
// @access  Private/Admin
router.put(
  '/',
  protect,
  isAdmin,
  [body('value').isFloat({ min: 0 })],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Valor inválido',
          errors: errors.array()
        })
      }

      const config = await JackpotConfig.getConfig()
      config.value = req.body.value
      await config.save()

      res.json({
        success: true,
        message: 'Jackpot atualizado',
        data: {
          value: config.value,
          updatedAt: config.updatedAt
        }
      })
    } catch (error) {
      console.error('Update jackpot error:', error)
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar jackpot',
        error: error.message
      })
    }
  }
)

export default router
