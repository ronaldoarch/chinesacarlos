# 🔍 Como Verificar se o Usuário é Admin

## ⚠️ Problema

Você está logado, mas ainda recebe "Acesso Negado" no painel admin. Isso significa que o usuário **não tem role de admin** no banco de dados.

---

## 🔍 Verificar o Role do Usuário

### Opção 1: Verificar no Terminal do Colify

No terminal do Colify (serviço Backend):

```bash
# Verificar um usuário específico
npm run check-user ronaldo

# OU listar todos os usuários
npm run list-users
```

**Saída esperada:**
```
📋 Informações do Usuário:

────────────────────────────────────────────────────────────────────────────────
Username:     ronaldo
Email:        N/A
Phone:        (11) 98765-4321
Role:         user ❌
Ativo:        Sim ✅
Criado em:    28/01/2026 18:45:00
────────────────────────────────────────────────────────────────────────────────

⚠️  Este usuário NÃO é admin!

💡 Para tornar admin, execute:
   npm run create-admin ronaldo admin
```

### Opção 2: Verificar no Console do Navegador

1. Abra o console do navegador (F12)
2. Execute:

```javascript
// Verificar usuário atual
fetch('/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => {
  console.log('Usuário:', data.data?.user)
  console.log('Role:', data.data?.user?.role)
  console.log('É admin?', ['admin', 'superadmin'].includes(data.data?.user?.role))
})
```

---

## ✅ Tornar o Usuário Admin

### Passo 1: Verificar se o Usuário Existe

```bash
npm run list-users
```

Procure pelo username `ronaldo` na lista.

### Passo 2: Tornar Admin

```bash
# IMPORTANTE: Use o username EXATO da lista (sem < >)
npm run create-admin ronaldo admin
```

**Saída esperada:**
```
✅ Connected to MongoDB
✅ Usuário "ronaldo" agora é admin
```

### Passo 3: Verificar Novamente

```bash
npm run check-user ronaldo
```

Agora deve mostrar:
```
Role:         admin ✅
```

### Passo 4: Atualizar o Token

**IMPORTANTE:** Após tornar admin, você precisa:

1. **Fazer logout** no site
2. **Fazer login novamente** para atualizar o token JWT
3. **Acessar `/admin.html`** novamente

---

## 🐛 Por Que Precisa Fazer Logout/Login?

O token JWT contém as informações do usuário (incluindo o role) quando você faz login. Se você tornar um usuário admin **depois** de já estar logado, o token antigo ainda tem `role: 'user'`.

**Solução:** Fazer logout e login novamente para gerar um novo token com `role: 'admin'`.

---

## 🔄 Fluxo Completo

```bash
# 1. Verificar usuário atual
npm run check-user ronaldo

# 2. Se não for admin, tornar admin
npm run create-admin ronaldo admin

# 3. Verificar novamente
npm run check-user ronaldo

# 4. No navegador:
#    - Fazer logout
#    - Fazer login novamente
#    - Acessar /admin.html
```

---

## 💡 Dicas

1. **Sempre verifique o role** antes de tentar acessar o admin
2. **Use o username exato** (case-sensitive)
3. **Faça logout/login** após tornar admin
4. **Limpe o cache** se ainda não funcionar

---

## 🔐 Verificação Rápida no Console

Execute no console do navegador (F12):

```javascript
// Ver token
const token = localStorage.getItem('token')
console.log('Token existe?', !!token)

// Ver usuário e role
fetch('/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
.then(r => r.json())
.then(data => {
  const user = data.data?.user
  console.log('Username:', user?.username)
  console.log('Role:', user?.role)
  console.log('É admin?', ['admin', 'superadmin'].includes(user?.role))
  
  if (!['admin', 'superadmin'].includes(user?.role)) {
    console.log('❌ Usuário não é admin!')
    console.log('Execute no Colify: npm run create-admin ' + user?.username + ' admin')
  } else {
    console.log('✅ Usuário é admin!')
  }
})
```

---

## ✅ Checklist

- [ ] Usuário existe no banco de dados
- [ ] `npm run check-user ronaldo` mostra o role atual
- [ ] `npm run create-admin ronaldo admin` foi executado com sucesso
- [ ] `npm run check-user ronaldo` agora mostra `admin ✅`
- [ ] Logout feito no site
- [ ] Login feito novamente
- [ ] Token atualizado (verificar no console)
- [ ] Acessar `/admin.html` novamente

Se todos os itens estiverem marcados e ainda não funcionar, verifique os logs do backend.
