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
    return res.status(403).json({ status: 0, msg: 'INVALID_AGENT' })
  }
  next()
}

/** API Link Guide: POST Site EndPoint - user_balance & transaction */
router.post('/', validateSeamlessAgent, handleSeamlessRequest)

export default router
