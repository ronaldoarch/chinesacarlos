# Variáveis de Ambiente do Backend

## 📋 Lista Completa de Variáveis

### 🔴 OBRIGATÓRIAS

```env
# Porta do servidor
PORT=5000

# Ambiente
NODE_ENV=production

# MongoDB - Connection String
MONGODB_URI=mongodb://root:SUA_SENHA@mongodb-database-wsoogsogswocogg4og4k8k4w:27017/default

# JWT Secret - MUDE ISSO! Não use o padrão!
JWT_SECRET=seu-jwt-secret-super-seguro-aqui-mude-em-producao

# JWT Expiration
JWT_EXPIRE=7d

# URL do Frontend (para CORS)
FRONTEND_URL=https://seu-frontend.colify.app

# API Key da NXGATE (pagamentos PIX)
NXGATE_API_KEY=d6fd1a0ed8daf4b33754d9f7d494d697

# URL base para webhooks (URL pública do seu backend)
WEBHOOK_BASE_URL=https://seu-backend.colify.app
```

---

## 📝 Descrição Detalhada

### 1. PORT
**O que é:** Porta onde o servidor vai rodar
**Valor:** `5000`
**Exemplo:** `PORT=5000`

---

### 2. NODE_ENV
**O que é:** Ambiente de execução
**Valores possíveis:**
- `development` - Desenvolvimento
- `production` - Produção
**Exemplo:** `NODE_ENV=production`

---

### 3. MONGODB_URI
**O que é:** String de conexão com o MongoDB
**Formato:**
```
mongodb://usuario:senha@host:porta/database
```

**Para MongoDB no Colify:**
```
mongodb://root:SUA_SENHA@mongodb-database-wsoogsogswocogg4og4k8k4w:27017/default
```

**Para MongoDB Atlas:**
```
mongodb+srv://usuario:senha@cluster.mongodb.net/fortune-bet
```

**⚠️ IMPORTANTE:**
- Substitua `SUA_SENHA` pela senha real do MongoDB
- Substitua o host pelo hostname correto do seu MongoDB no Colify
- Substitua `default` pelo nome do banco que você quer usar

---

### 4. JWT_SECRET
**O que é:** Chave secreta para assinar tokens JWT
**⚠️ CRÍTICO:** 
- **NUNCA** use o valor padrão em produção!
- Use uma string aleatória longa e segura
- Exemplo: `JWT_SECRET=abc123xyz789def456ghi012jkl345mno678pqr901`

**Como gerar uma chave segura:**
```bash
# No terminal:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### 5. JWT_EXPIRE
**O que é:** Tempo de expiração dos tokens JWT
**Valores:**
- `7d` - 7 dias (recomendado)
- `1d` - 1 dia
- `24h` - 24 horas
- `1h` - 1 hora
**Exemplo:** `JWT_EXPIRE=7d`

---

### 6. FRONTEND_URL
**O que é:** URL do frontend (usado para CORS)
**Formato:** URL completa do seu frontend no Colify
**Exemplo:** `FRONTEND_URL=https://fortune-bet-frontend.colify.app`

**⚠️ IMPORTANTE:**
- Use HTTPS em produção
- Sem barra no final
- Sem `/api` no final (só a URL base)

---

### 7. NXGATE_API_KEY
**O que é:** Chave da API NXGATE para pagamentos PIX
**Valor atual:** `d6fd1a0ed8daf4b33754d9f7d494d697`
**⚠️ IMPORTANTE:**
- Use a chave real da sua conta NXGATE
- Não compartilhe esta chave publicamente

---

### 8. WEBHOOK_BASE_URL
**O que é:** URL pública do backend onde os webhooks serão recebidos
**Formato:** URL completa do seu backend no Colify
**Exemplo:** `WEBHOOK_BASE_URL=https://fortune-bet-backend.colify.app`

**⚠️ CRÍTICO:**
- Deve ser acessível publicamente (HTTPS)
- É onde a NXGATE vai enviar confirmações de pagamento
- Sem barra no final
- Use a URL real do seu backend no Colify

---

## 🎯 Exemplo Completo para Colify

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://root:minhasenha123@mongodb-database-wsoogsogswocogg4og4k8k4w:27017/fortune-bet
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_EXPIRE=7d
FRONTEND_URL=https://fortune-bet-frontend.colify.app
NXGATE_API_KEY=d6fd1a0ed8daf4b33754d9f7d494d697
WEBHOOK_BASE_URL=https://fortune-bet-backend.colify.app
```

---

## ✅ Checklist

Antes de fazer deploy, verifique:

- [ ] `PORT` configurado (5000)
- [ ] `NODE_ENV` = `production`
- [ ] `MONGODB_URI` com senha e host corretos
- [ ] `JWT_SECRET` alterado (não use o padrão!)
- [ ] `FRONTEND_URL` com URL real do frontend
- [ ] `WEBHOOK_BASE_URL` com URL real do backend
- [ ] `NXGATE_API_KEY` com sua chave real

---

## 🔐 Segurança

**NUNCA faça:**
- ❌ Commitar variáveis de ambiente no Git
- ❌ Usar `JWT_SECRET` padrão em produção
- ❌ Compartilhar `NXGATE_API_KEY` publicamente
- ❌ Usar senhas fracas no MongoDB

**SEMPRE faça:**
- ✅ Usar variáveis de ambiente no Colify
- ✅ Gerar `JWT_SECRET` seguro e único
- ✅ Usar HTTPS em produção
- ✅ Manter senhas seguras

---

## 🐛 Troubleshooting

### Erro de conexão com MongoDB
- Verifique se `MONGODB_URI` está correto
- Verifique se o MongoDB está rodando
- Verifique se a senha está correta

### Erro de CORS
- Verifique se `FRONTEND_URL` está correto
- Verifique se não tem barra no final
- Verifique se está usando HTTPS

### Webhooks não funcionam
- Verifique se `WEBHOOK_BASE_URL` está correto
- Verifique se a URL é acessível publicamente
- Verifique se está usando HTTPS
