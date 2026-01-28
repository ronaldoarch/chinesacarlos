import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.model.js'

dotenv.config()

const listUsers = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fortune-bet')
    console.log('✅ Connected to MongoDB\n')

    // Get all users
    const users = await User.find({}).select('username phone role isActive createdAt').sort({ createdAt: -1 })

    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado')
      console.log('💡 Crie um usuário primeiro através do registro normal\n')
      process.exit(0)
    }

    console.log('📋 Usuários cadastrados:\n')
    console.log('─'.repeat(80))
    console.log(`${'Username'.padEnd(20)} | ${'Role'.padEnd(12)} | ${'Status'.padEnd(8)} | Cadastro`)
    console.log('─'.repeat(80))

    users.forEach((user) => {
      const username = user.username.padEnd(20)
      const role = (user.role || 'user').padEnd(12)
      const status = user.isActive ? 'Ativo' : 'Inativo'
      const date = new Date(user.createdAt).toLocaleDateString('pt-BR')
      console.log(`${username} | ${role} | ${status.padEnd(8)} | ${date}`)
    })

    console.log('─'.repeat(80))
    console.log(`\nTotal: ${users.length} usuário(s)`)
    console.log('\n💡 Para tornar um usuário admin, use:')
    console.log('   npm run create-admin <username> admin\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }
}

listUsers()
