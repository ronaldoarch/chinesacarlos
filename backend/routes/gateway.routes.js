import express from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { isAdmin } from '../middleware/admin.middleware.js'
import GatewayConfig from '../models/GatewayConfig.model.js'

const router = express.Router()

// @route   GET /api/gateway/config
// @desc    Get gateway configuration
// @access  Private/Admin
router.get('/config', protect, isAdmin, async (req, res) => {
  try {
    const config = await GatewayConfig.getConfig()
    res.json({
      success: true,
      data: {
        apiKey: config.apiKey,
        webhookBaseUrl: config.webhookBaseUrl,
        apiUrl: config.apiUrl,
        isActive: config.isActive
      }
    })
  } catch (error) {
    console.error('Get gateway config error:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar configuração do gateway',
      error: error.message
    })
  }
})

// @route   PUT /api/gateway/config
// @desc    Update gateway configuration
// @access  Private/Admin
router.put('/config', protect, isAdmin, async (req, res) => {
  try {
    const { apiKey, webhookBaseUrl, apiUrl, isActive } = req.body

    let config = await GatewayConfig.findOne()
    
    if (!config) {
      config = new GatewayConfig({
        apiKey: apiKey || process.env.NXGATE_API_KEY || '',
        webhookBaseUrl: webhookBaseUrl || process.env.WEBHOOK_BASE_URL || 'http://localhost:5000',
        apiUrl: apiUrl || 'https://api.nxgate.com.br'
      })
    }

    if (apiKey !== undefined) config.apiKey = apiKey
    if (webhookBaseUrl !== undefined) config.webhookBaseUrl = webhookBaseUrl
    if (apiUrl !== undefined) config.apiUrl = apiUrl
    if (isActive !== undefined) config.isActive = isActive

    await config.save()

    res.json({
      success: true,
      message: 'Configuração do gateway atualizada com sucesso',
      data: {
        apiKey: config.apiKey,
        webhookBaseUrl: config.webhookBaseUrl,
        apiUrl: config.apiUrl,
        isActive: config.isActive
      }
    })
  } catch (error) {
    console.error('Update gateway config error:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar configuração do gateway',
      error: error.message
    })
  }
})

// @route   POST /api/gateway/test
// @desc    Test gateway connection
// @access  Private/Admin
router.post('/test', protect, isAdmin, async (req, res) => {
  try {
    const config = await GatewayConfig.getConfig()
    
    // Simple validation test - check if API key is set
    if (!config.apiKey || config.apiKey.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'API Key não configurada'
      })
    }

    // You can add a real API test here if NXGATE provides a test endpoint
    res.json({
      success: true,
      message: 'Configuração válida',
      data: {
        apiKeyConfigured: config.apiKey ? 'Sim' : 'Não',
        webhookBaseUrl: config.webhookBaseUrl,
        apiUrl: config.apiUrl
      }
    })
  } catch (error) {
    console.error('Test gateway error:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao testar gateway',
      error: error.message
    })
  }
})

export default router
