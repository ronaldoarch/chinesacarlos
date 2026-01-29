import mongoose from 'mongoose'

const gameConfigSchema = new mongoose.Schema(
  {
    agentCode: {
      type: String,
      required: true,
      unique: true,
      default: 'Midaslabs'
    },
    agentToken: {
      type: String,
      required: true
    },
    agentSecret: {
      type: String,
      required: true
    },
    selectedProviders: {
      type: [String],
      default: [],
      validate: {
        validator: function(v) {
          return v.length <= 3
        },
        message: 'Máximo de 3 provedores permitidos'
      }
    },
    selectedGames: {
      type: [
        {
          providerCode: String,
          gameCode: String,
          gameName: String,
          banner: String
        }
      ],
      default: [],
      validate: {
        validator: function(v) {
          return v.length <= 15
        },
        message: 'Máximo de 15 jogos permitidos'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

// Ensure only one config exists
gameConfigSchema.statics.getConfig = async function() {
  let config = await this.findOne()
  if (!config) {
    config = await this.create({
      agentCode: process.env.IGAMEWIN_AGENT_CODE || 'Midaslabs',
      agentToken: process.env.IGAMEWIN_AGENT_TOKEN || '',
      agentSecret: process.env.IGAMEWIN_AGENT_SECRET || ''
    })
  }
  return config
}

export default mongoose.model('GameConfig', gameConfigSchema)
