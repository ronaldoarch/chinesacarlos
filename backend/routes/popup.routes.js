import express from 'express'
import { body, validationResult } from 'express-validator'
import { protect } from '../middleware/auth.middleware.js'
import { isAdmin } from '../middleware/admin.middleware.js'
import PopupPromo from '../models/PopupPromo.model.js'

const router = express.Router()

// @route   GET /api/popups/active
// @desc    Get active popup to show on site (one per session logic on frontend)
// @access  Public
router.get('/active', async (req, res) => {
  try {
    const now = new Date()
    const popup = await PopupPromo.findOne({
      active: true,
      $and: [
        { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: null }, { endDate: { $gte: now } }] }
      ]
    })
      .sort({ order: 1 })
      .lean()

    if (!popup) {
      return res.json({ success: true, data: null })
    }

    res.json({
      success: true,
      data: {
        _id: popup._id,
        title: popup.title,
        content: popup.content,
        imageUrl: popup.imageUrl,
        linkUrl: popup.linkUrl,
        showOncePerSession: popup.showOncePerSession
      }
    })
  } catch (error) {
    console.error('Get active popup error:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar popup',
      error: error.message
    })
  }
})

// Admin routes below
router.use(protect)
router.use(isAdmin)

// @route   GET /api/popups
// @desc    List all popups
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const popups = await PopupPromo.find().sort({ order: 1, createdAt: -1 })
    res.json({
      success: true,
      data: { popups }
    })
  } catch (error) {
    console.error('List popups error:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao listar popups',
      error: error.message
    })
  }
})

// @route   POST /api/popups
// @desc    Create popup
// @access  Private/Admin
router.post(
  '/',
  [
    body('title').notEmpty().trim(),
    body('content').optional().trim(),
    body('imageUrl').optional().trim(),
    body('linkUrl').optional().trim(),
    body('active').optional().isBoolean(),
    body('startDate').optional().isISO8601(),
    body('endDate').optional().isISO8601(),
    body('showOncePerSession').optional().isBoolean(),
    body('order').optional().isInt({ min: 0 })
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

      const popup = await PopupPromo.create(req.body)
      res.status(201).json({
        success: true,
        message: 'Popup criado',
        data: { popup }
      })
    } catch (error) {
      console.error('Create popup error:', error)
      res.status(500).json({
        success: false,
        message: 'Erro ao criar popup',
        error: error.message
      })
    }
  }
)

// @route   GET /api/popups/:id
// @desc    Get single popup
// @access  Private/Admin
router.get('/:id', async (req, res) => {
  try {
    const popup = await PopupPromo.findById(req.params.id)
    if (!popup) {
      return res.status(404).json({
        success: false,
        message: 'Popup não encontrado'
      })
    }
    res.json({
      success: true,
      data: { popup }
    })
  } catch (error) {
    console.error('Get popup error:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar popup',
      error: error.message
    })
  }
})

// @route   PUT /api/popups/:id
// @desc    Update popup
// @access  Private/Admin
router.put(
  '/:id',
  [
    body('title').optional().notEmpty().trim(),
    body('content').optional().trim(),
    body('imageUrl').optional().trim(),
    body('linkUrl').optional().trim(),
    body('active').optional().isBoolean(),
    body('startDate').optional().isISO8601(),
    body('endDate').optional().isISO8601(),
    body('showOncePerSession').optional().isBoolean(),
    body('order').optional().isInt({ min: 0 })
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

      const popup = await PopupPromo.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      )
      if (!popup) {
        return res.status(404).json({
          success: false,
          message: 'Popup não encontrado'
        })
      }
      res.json({
        success: true,
        message: 'Popup atualizado',
        data: { popup }
      })
    } catch (error) {
      console.error('Update popup error:', error)
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar popup',
        error: error.message
      })
    }
  }
)

// @route   DELETE /api/popups/:id
// @desc    Delete popup
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const popup = await PopupPromo.findByIdAndDelete(req.params.id)
    if (!popup) {
      return res.status(404).json({
        success: false,
        message: 'Popup não encontrado'
      })
    }
    res.json({
      success: true,
      message: 'Popup removido',
      data: { id: popup._id }
    })
  } catch (error) {
    console.error('Delete popup error:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao remover popup',
      error: error.message
    })
  }
})

export default router
