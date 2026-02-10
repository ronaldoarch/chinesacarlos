import User from '../models/User.model.js'
import GameTxnLog from '../models/GameTxnLog.model.js'
import igamewinService from '../services/igamewin.service.js'

/** API Link Guide: Seamless Site API - user_balance & transaction */
export async function handleSeamlessRequest(req, res) {
  try {
    const { method, user_code } = req.body
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Seamless]', method, 'user_code:', user_code)
    }
    if (!method || !user_code) {
      return res.status(400).json({ status: 0, msg: 'INVALID_PARAMETER' })
    }

    const user = await User.findById(user_code)
    if (!user) {
      return res.status(404).json({ status: 0, msg: 'INVALID_USER', user_balance: 0 })
    }

    if (method === 'user_balance') {
      const balanceReais = Math.max(0, user.balance || 0)
      const balanceCents = Math.round(balanceReais * 100)
      return res.json({ status: 1, user_balance: balanceCents })
    }

    if (method === 'transaction') {
      const isSamples = igamewinService.isSamplesMode()
      const { game_type, slot } = req.body
      const slotData = slot || req.body[game_type] || {}
      const txnId = slotData.txn_id
      const txnType = slotData.txn_type || 'debit_credit'
      const betCents = Number(slotData.bet_money ?? slotData.bet ?? 0)
      const winCents = Number(slotData.win_money ?? slotData.win ?? 0)

      if (!txnId) {
        return res.status(400).json({ status: 0, msg: 'INVALID_PARAMETER' })
      }

      const existing = await GameTxnLog.findOne({ txnId })
      if (existing) {
        const balanceCents = Math.round((existing.balanceAfterReais || 0) * 100)
        return res.json({ status: 1, user_balance: balanceCents })
      }

      if (isSamples) {
        const balanceCents = Math.round((user.balance || 0) * 100)
        await GameTxnLog.create({
          txnId,
          user: user._id,
          gameType: game_type,
          providerCode: slotData.provider_code,
          gameCode: slotData.game_code,
          txnType: slotData.txn_type || 'debit_credit',
          betCents,
          winCents,
          balanceAfterReais: user.balance || 0
        })
        return res.json({ status: 1, user_balance: balanceCents })
      }

      let deltaReais = 0
      if (txnType === 'debit') {
        deltaReais = -betCents / 100
      } else if (txnType === 'credit') {
        deltaReais = winCents / 100
      } else {
        deltaReais = (winCents - betCents) / 100
      }

      const currentBalance = Math.max(0, user.balance || 0)
      const newBalance = currentBalance + deltaReais

      if (newBalance < 0) {
        return res.json({ status: 0, msg: 'INSUFFICIENT_USER_FUNDS', user_balance: 0 })
      }

      user.balance = newBalance
      user.bonusBalance = Math.min(user.bonusBalance || 0, user.balance)
      if (deltaReais < 0) {
        user.totalBets = (user.totalBets || 0) + Math.abs(deltaReais)
      }
      await user.save()

      await GameTxnLog.create({
        txnId,
        user: user._id,
        gameType: game_type,
        providerCode: slotData.provider_code,
        gameCode: slotData.game_code,
        txnType,
        betCents,
        winCents,
        balanceAfterReais: newBalance
      })

      return res.json({ status: 1, user_balance: Math.round(newBalance * 100) })
    }

    return res.status(400).json({ status: 0, msg: 'INVALID_METHOD' })
  } catch (error) {
    console.error('Seamless API error:', error)
    return res.status(500).json({ status: 0, msg: 'INTERNAL_ERROR' })
  }
}
