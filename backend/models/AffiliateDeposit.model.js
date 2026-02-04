import mongoose from 'mongoose'

/**
 * Rastreia depósitos de usuários indicados por afiliados
 * Usado para calcular CPA (primeiro depósito) e RevShare (com lógica de pular depósitos)
 */
const affiliateDepositSchema = new mongoose.Schema(
  {
    affiliate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
      unique: true
    },
    depositAmount: {
      type: Number,
      required: true,
      min: 0
    },
    isFirstDeposit: {
      type: Boolean,
      default: false
    },
    // Posição no ciclo (ex: 1, 2, 3... até totalDepositsCycle)
    cyclePosition: {
      type: Number,
      default: 0
    },
    // Se este depósito deve ser "pulado" (não ganha RevShare)
    isSkipped: {
      type: Boolean,
      default: false
    },
    // Se CPA foi pago neste depósito
    cpaPaid: {
      type: Boolean,
      default: false
    },
    // Valor do CPA pago
    cpaAmount: {
      type: Number,
      default: 0
    },
    // Se RevShare foi calculado neste depósito
    revShareCalculated: {
      type: Boolean,
      default: false
    },
    // Valor do RevShare calculado
    revShareAmount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

// Índices compostos
affiliateDepositSchema.index({ affiliate: 1, referredUser: 1, createdAt: -1 })
affiliateDepositSchema.index({ referredUser: 1, isFirstDeposit: 1 })

export default mongoose.model('AffiliateDeposit', affiliateDepositSchema)
