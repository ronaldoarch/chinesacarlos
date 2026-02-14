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
        username: config.username,
        password: config.password ? '***' : '', // Não retornar senha real
        apiKey: config.apiKey, // Legacy
        webhookBaseUrl: config.webhookBaseUrl,
        apiUrl: config.apiUrl,
        defaultCpf: config.defaultCpf,
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
    const { username, password, apiKey, webhookBaseUrl, apiUrl, defaultCpf, isActive } = req.body

    let config = await GatewayConfig.findOne()
    
    if (!config) {
      config = new GatewayConfig({
        username: username || process.env.GATEBOX_USERNAME || '',
        password: password || process.env.GATEBOX_PASSWORD || '',
        apiKey: apiKey || process.env.NXGATE_API_KEY || '', // Legacy
        webhookBaseUrl: webhookBaseUrl || process.env.WEBHOOK_BASE_URL || 'http://localhost:5000',
        apiUrl: apiUrl || 'https://api.gatebox.com.br',
        defaultCpf: defaultCpf || process.env.GATEBOX_DEFAULT_CPF || '000.000.000-00'
      })
    }

    if (username !== undefined) config.username = username
    if (password !== undefined) config.password = password
    if (apiKey !== undefined) config.apiKey = apiKey // Legacy
    if (webhookBaseUrl !== undefined) config.webhookBaseUrl = webhookBaseUrl
    if (apiUrl !== undefined) config.apiUrl = apiUrl
    if (defaultCpf !== undefined) config.defaultCpf = defaultCpf
    if (isActive !== undefined) config.isActive = isActive

    await config.save()

    res.json({
      success: true,
      message: 'Configuração do gateway atualizada com sucesso',
      data: {
        username: config.username,
        password: config.password ? '***' : '', // Não retornar senha
        apiKey: config.apiKey, // Legacy
        webhookBaseUrl: config.webhookBaseUrl,
        apiUrl: config.apiUrl,
        defaultCpf: config.defaultCpf,
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
// @desc    Test gateway connection (validates config; optional real PIX test)
// @access  Private/Admin
router.post('/test', protect, isAdmin, async (req, res) => {
  try {
    const config = await GatewayConfig.getConfig()

    if (!config.username || !config.password || config.username.trim() === '' || config.password.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Username e Password não configurados'
      })
    }

    const { realTest } = req.body || {}
    if (realTest) {
      // Real test: call GATEBOX /v1/customers/pix/create-immediate-qrcode with minimal amount to validate response format
      const gateboxService = (await import('../services/gatebox.service.js')).default
      const webhookBase = config.webhookBaseUrl || process.env.WEBHOOK_BASE_URL || 'http://localhost:5000'
      const result = await gateboxService.generatePix({
        nome_pagador: 'Teste Admin',
        documento_pagador: '11144477735', // CPF válido para testes (Gatebox rejeita 00000000000)
        valor: 10,
        webhook: `${webhookBase}/api/webhooks/pix`,
        externalId: `test_${Date.now()}`
      })
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message || 'Falha ao chamar a API GATEBOX',
          data: { detail: result.error }
        })
      }
      const data = result.data || {}
      const hasCode = data.qrCode || data.pixCopyPaste || data.copyPaste || data.paymentCode || data.qr_code || data.qrcode || data.codigo_pix
      if (!hasCode) {
        console.warn('GATEBOX test response (no PIX code found):', JSON.stringify(result.data, null, 2))
        return res.status(400).json({
          success: false,
          message: 'API respondeu mas não retornou código PIX. Verifique o formato da resposta no backend.',
          data: { rawKeys: Object.keys(data) }
        })
      }
      return res.json({
        success: true,
        message: 'Teste real: PIX gerado com sucesso.',
        data: { credentialsConfigured: 'Sim', webhookBaseUrl: config.webhookBaseUrl, apiUrl: config.apiUrl }
      })
    }

    res.json({
      success: true,
      message: 'Configuração válida (teste rápido). Use "Teste real" para validar geração de PIX.',
      data: {
        credentialsConfigured: (config.username && config.password) ? 'Sim' : 'Não',
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
