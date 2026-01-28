# Guia de Deploy - Colify/Railway

## 🗄️ Banco de Dados: MongoDB

Este projeto usa **MongoDB** com **Mongoose**. Recomendamos usar **MongoDB Atlas** (gratuito) para produção.

## 📋 Configuração no Colify

### Variáveis de Ambiente

Configure as seguintes variáveis no painel do Colify:

```env
# Server
PORT=5000
NODE_ENV=production

# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/fortune-bet

# JWT
JWT_SECRET=seu-jwt-secret-super-seguro-aqui
JWT_EXPIRE=7d

# CORS - URL do seu frontend
FRONTEND_URL=https://seu-frontend.com

# NXGATE API
NXGATE_API_KEY=sua-api-key-nxgate
WEBHOOK_BASE_URL=https://seu-backend.colify.app
```

### Build e Start Commands

**Backend:**
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && npm start`

**Frontend:**
- Build Command: `cd chinesa-main && npm install && npm run build`
- Start Command: `cd chinesa-main && npm run preview`

## 🔧 Configuração do MongoDB Atlas

### Passo a Passo

1. **Crie uma conta gratuita** no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Crie um Cluster Gratuito:**
   - Escolha "Free" (M0)
   - Escolha a região mais próxima
   - Aguarde a criação (pode levar alguns minutos)

3. **Configure o acesso:**
   - Vá em "Database Access"
   - Crie um usuário com senha forte
   - Anote o usuário e senha

4. **Configure a Network Access:**
   - Vá em "Network Access"
   - Adicione `0.0.0.0/0` para permitir acesso de qualquer IP
   - Ou adicione o IP específico do Colify

5. **Obtenha a Connection String:**
   - Vá em "Database" > "Connect"
   - Escolha "Connect your application"
   - Copie a connection string
   - Substitua `<password>` pela senha do usuário criado
   - Substitua `<dbname>` por `fortune-bet` (ou o nome que preferir)

6. **Configure no Colify:**
   - Adicione a variável `MONGODB_URI` com a connection string completa
   - Exemplo: `mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/fortune-bet?retryWrites=true&w=majority`

## 🌐 Webhooks

**IMPORTANTE**: Configure `WEBHOOK_BASE_URL` com a URL pública do seu backend no Colify.

Exemplo:
```
WEBHOOK_BASE_URL=https://fortune-bet-backend.colify.app
```

## 📝 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados configurado e conectado
- [ ] `WEBHOOK_BASE_URL` apontando para URL pública
- [ ] `FRONTEND_URL` configurado corretamente
- [ ] `JWT_SECRET` definido (não use o padrão!)
- [ ] Build commands configurados
- [ ] Testar conexão com banco de dados
- [ ] Testar webhooks (usar ngrok para desenvolvimento)

## 🐛 Troubleshooting

### Erro de conexão com MongoDB

- Verifique se a `MONGODB_URI` está correta
- Verifique se substituiu `<password>` e `<dbname>` na connection string
- Verifique se o IP do Colify está na whitelist do MongoDB Atlas
- Verifique se o usuário tem permissões adequadas
- Teste a connection string localmente primeiro

### Webhooks não funcionam

- Verifique se `WEBHOOK_BASE_URL` está correto
- Verifique se a URL é acessível publicamente
- Use HTTPS (obrigatório em produção)

### CORS errors

- Verifique se `FRONTEND_URL` está correto
- Adicione a URL do frontend no CORS do backend

## 📚 Recursos

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Railway Docs](https://docs.railway.app/)
- [Colify Docs](https://docs.colify.app/)
