import express from 'express'
import { handleSeamlessRequest } from '../controllers/seamless.controller.js'

const router = express.Router()

/** API Link Guide: agent_code 4916vini, agent_secret obrigatório */
function validateSeamlessAgent(req, res, next) {
  const agentCode = req.body?.agent_code
  const agentSecret = req.body?.agent_secret
  const expectedSecret = process.env.IGAMEWIN_AGENT_SECRET || ''
  const expectedCode = process.env.IGAMEWIN_AGENT_CODE || '4916vini'
  if (!agentSecret || agentSecret !== expectedSecret || agentCode !== expectedCode) {
    console.warn('[Seamless] INVALID_AGENT - code:', agentCode, 'expected:', expectedCode, 'secretMatch:', !!agentSecret && agentSecret === expectedSecret)
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
