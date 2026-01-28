import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.model.js'

dotenv.config()

const checkUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fortune-bet')
    console.log('✅ Connected to MongoDB\n')

    // Get username from command line
    const args = process.argv.slice(2)
    const username = args[0]?.trim().toLowerCase()

    if (!username) {
      console.error('❌ Por favor, forneça o username')
      console.log('')
      console.log('Uso: node scripts/checkUser.js <username>')
      console.log('')
      console.log('Exemplo:')
      console.log('  node scripts/checkUser.js ronaldo')
      process.exit(1)
    }

    // Find user
    const user = await User.findOne({ username })

    if (!user) {
      console.error(`❌ Usuário "${username}" não encontrado`)
      console.log('💡 Verifique o username ou liste todos os usuários:')
      console.log('   npm run list-users')
      process.exit(1)
    }

    // Display user info
    console.log('📋 Informações do Usuário:\n')
    console.log('─'.repeat(80))
    console.log(`Username:     ${user.username}`)
    console.log(`Email:        ${user.email || 'N/A'}`)
    console.log(`Phone:        ${user.phone || 'N/A'}`)
    console.log(`Role:         ${user.role || 'user'} ${user.role === 'admin' || user.role === 'superadmin' ? '✅' : '❌'}`)
    console.log(`Ativo:        ${user.isActive ? 'Sim ✅' : 'Não ❌'}`)
    console.log(`Criado em:    ${new Date(user.createdAt).toLocaleString('pt-BR')}`)
    console.log('─'.repeat(80))

    if (user.role !== 'admin' && user.role !== 'superadmin') {
      console.log('\n⚠️  Este usuário NÃO é admin!')
      console.log('\n💡 Para tornar admin, execute:')
      console.log(`   npm run create-admin ${username} admin`)
    } else {
      console.log('\n✅ Este usuário É admin e pode acessar o painel administrativo!')
      console.log('\n💡 Se ainda não conseguir acessar:')
      console.log('   1. Faça logout e login novamente')
      console.log('   2. Limpe o cache do navegador')
      console.log('   3. Verifique o token no localStorage')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }
}

checkUser()
