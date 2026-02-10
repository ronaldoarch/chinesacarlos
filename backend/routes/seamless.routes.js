import express from 'express'
import GameConfig from '../models/GameConfig.model.js'
import { handleSeamlessRequest } from '../controllers/seamless.controller.js'

const router = express.Router()

/** API Link Guide: agent_code e agent_secret — usa GameConfig (admin) ou .env */
async function validateSeamlessAgent(req, res, next) {
  const agentCode = req.body?.agent_code
  const agentSecret = req.body?.agent_secret
  let expectedSecret = process.env.IGAMEWIN_AGENT_SECRET || ''
  let expectedCode = process.env.IGAMEWIN_AGENT_CODE || '4916vini'
  try {
    const config = await GameConfig.getConfig()
    if (config?.agentSecret) expectedSecret = config.agentSecret
    if (config?.agentCode) expectedCode = config.agentCode
  } catch (e) {
    // fallback para env
  }
  if (!agentSecret || agentSecret !== expectedSecret || agentCode !== expectedCode) {
    const secretEmpty = !expectedSecret || expectedSecret.trim() === ''
    console.warn('[Seamless] INVALID_AGENT - code:', agentCode, 'secretMatch:', false, secretEmpty ? '→ agent_secret VAZIO: configure em Admin > Configuração de Jogos (copie do painel iGameWin para o agente 4916vini)' : '→ agent_secret diferente do painel iGameWin')
    return res.status(403).json({ status: 0, msg: 'INVALID_AGENT' })
  }
  next()
}

/** GET - para iGameWin validar que o endpoint está online */
router.get('/', (req, res) => {
  res.json({ status: 1, msg: 'Seamless endpoint OK', agent: process.env.IGAMEWIN_AGENT_CODE || '4916vini' })
})

/** API Link Guide: POST Site EndPoint - user_balance & transaction */
router.post('/', validateSeamlessAgent, handleSeamlessRequest)

export default router
