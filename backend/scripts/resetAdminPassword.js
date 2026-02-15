import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.model.js'

dotenv.config()

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fortune-bet')
    console.log('✅ Conectado ao MongoDB')

    const args = process.argv.slice(2)
    const username = args[0]?.trim()?.toLowerCase()
    const newPassword = args[1]

    if (!username || !newPassword) {
      console.error('❌ Uso: npm run reset-admin-password <username> <nova_senha>')
      console.log('   Exemplo: npm run reset-admin-password admin Sccp2405@')
      process.exit(1)
    }

    const user = await User.findOne({ username })
    if (!user) {
      console.error(`❌ Usuário "${username}" não encontrado`)
      process.exit(1)
    }

    user.password = newPassword
    await user.save()

    console.log(`✅ Senha do usuário "${username}" alterada com sucesso`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }
}

resetAdminPassword()
