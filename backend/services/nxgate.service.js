import axios from 'axios'
import GatewayConfig from '../models/GatewayConfig.model.js'

const NXGATE_API_URL = 'https://api.nxgate.com.br'
const NXGATE_API_KEY = process.env.NXGATE_API_KEY || 'd6fd1a0ed8daf4b33754d9f7d494d697'
const WEBHOOK_BASE_URL = process.env.WEBHOOK_BASE_URL || 'http://localhost:5000'

class NxgateService {
  constructor() {
    this.apiKey = NXGATE_API_KEY
    this.baseURL = NXGATE_API_URL
    this.webhookBaseUrl = WEBHOOK_BASE_URL
  }

  async getConfig() {
    try {
      const config = await GatewayConfig.getConfig()
      if (config && config.isActive) {
        this.apiKey = config.apiKey || this.apiKey
        this.baseURL = config.apiUrl || this.baseURL
        this.webhookBaseUrl = config.webhookBaseUrl || this.webhookBaseUrl
      }
    } catch (error) {
      console.error('Error loading gateway config:', error)
      // Use defaults from env
    }
  }

  /**
   * Gera um PIX para depósito
   * @param {Object} data - Dados do pagamento
   * @param {string} data.nome_pagador - Nome do pagador
   * @param {string} data.documento_pagador - CPF do pagador
   * @param {number} data.valor - Valor do pagamento
   * @param {string} data.webhook - URL do webhook
   * @returns {Promise<Object>} Resposta da API
   */
  async generatePix(data) {
    try {
      await this.getConfig()
      const payload = {
        nome_pagador: data.nome_pagador,
        documento_pagador: data.documento_pagador,
        valor: parseFloat(data.valor).toFixed(2),
        api_key: this.apiKey,
        webhook: data.webhook || `${this.webhookBaseUrl}/api/webhooks/pix`
      }

      const response = await axios.post(`${this.baseURL}/pix/gerar`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      })

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('NXGATE Generate PIX Error:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Erro ao gerar PIX'
      }
    }
  }

  /**
   * Cria um saque via PIX
   * @param {Object} data - Dados do saque
   * @param {number} data.valor - Valor do saque
   * @param {string} data.chave_pix - Chave PIX do recebedor
   * @param {string} data.tipo_chave - Tipo da chave (CPF, CNPJ, PHONE, EMAIL, RANDOM)
   * @param {string} data.documento - CPF do recebedor
   * @param {string} data.webhook - URL do webhook
   * @returns {Promise<Object>} Resposta da API
   */
  async withdrawPix(data) {
    try {
      await this.getConfig()
      const payload = {
        api_key: this.apiKey,
        valor: parseFloat(data.valor).toFixed(2),
        chave_pix: data.chave_pix,
        tipo_chave: data.tipo_chave,
        documento: data.documento,
        webhook: data.webhook || `${this.webhookBaseUrl}/api/webhooks/pix-withdraw`
      }

      const response = await axios.post(`${this.baseURL}/pix/sacar`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      })

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('NXGATE Withdraw PIX Error:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.message || 'Erro ao processar saque'
      }
    }
  }
}

export default new NxgateService()
