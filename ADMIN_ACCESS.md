# Como Acessar o Painel Administrativo

## 🌐 URLs de Acesso

### Desenvolvimento Local
```
http://localhost:3000/admin.html
```

### Produção (Colify)
```
https://seu-frontend.colify.app/admin.html
```

---

## 🔐 Passo a Passo para Acessar

### 1️⃣ Criar Usuário Admin

Primeiro, você precisa criar um usuário e torná-lo administrador.

#### Opção A: Via Script (Recomendado)

**No servidor/backend:**
```bash
cd backend
npm run create-admin <username> admin
```

**Exemplo:**
```bash
npm run create-admin joao admin
```

Isso atualiza o usuário existente para ter role `admin`.

#### Opção B: Manualmente no MongoDB

Se você tem acesso ao MongoDB:

```javascript
db.users.updateOne(
  { username: "seu_usuario" },
  { $set: { role: "admin" } }
)
```

Ou para super admin:
```javascript
db.users.updateOne(
  { username: "seu_usuario" },
  { $set: { role: "superadmin" } }
)
```

### 2️⃣ Fazer Login

1. Acesse a URL do admin: `https://seu-frontend.colify.app/admin.html`
2. Você será redirecionado para fazer login
3. Use o username e senha do usuário que você tornou admin

### 3️⃣ Acessar o Painel

Após o login, você terá acesso ao painel administrativo com:
- Dashboard
- Gerenciamento de Usuários
- Gerenciamento de Transações

---

## 📋 Checklist Completo

### Para Desenvolvimento Local

- [ ] Backend rodando em `http://localhost:5000`
- [ ] Frontend rodando em `http://localhost:3000`
- [ ] Criar usuário normal primeiro (via registro)
- [ ] Tornar usuário admin: `npm run create-admin <username> admin`
- [ ] Acessar: `http://localhost:3000/admin.html`
- [ ] Fazer login com usuário admin

### Para Produção (Colify)

- [ ] Backend deployado e rodando
- [ ] Frontend deployado e rodando
- [ ] Criar usuário normal primeiro (via registro no site)
- [ ] Conectar ao MongoDB do Colify
- [ ] Tornar usuário admin (via script ou MongoDB)
- [ ] Acessar: `https://seu-frontend.colify.app/admin.html`
- [ ] Fazer login com usuário admin

---

## 🔧 Criar Admin no Colify

### Método 1: Via Terminal do Backend

1. No Colify, vá no serviço do **Backend**
2. Abra o **Terminal**
3. Execute:
```bash
cd backend
npm run create-admin seu_usuario admin
```

### Método 2: Via MongoDB

1. Conecte ao MongoDB do Colify
2. Execute:
```javascript
use fortune-bet
db.users.updateOne(
  { username: "seu_usuario" },
  { $set: { role: "admin" } }
)
```

---

## 🎯 Roles Disponíveis

- **`user`** - Usuário normal (padrão)
- **`admin`** - Administrador (acesso ao painel admin)
- **`superadmin`** - Super administrador (pode alterar roles)

---

## 🐛 Problemas Comuns

### "Acesso Negado" aparece

**Causa:** Usuário não tem role `admin` ou `superadmin`

**Solução:**
1. Verifique se o usuário tem role admin:
```javascript
db.users.findOne({ username: "seu_usuario" })
```
2. Se não tiver, atualize:
```javascript
db.users.updateOne(
  { username: "seu_usuario" },
  { $set: { role: "admin" } }
)
```

### Não consigo fazer login

**Causa:** Usuário não existe ou senha incorreta

**Solução:**
1. Crie o usuário primeiro via registro normal
2. Depois torne-o admin

### Admin.html não carrega

**Causa:** Arquivo não está sendo servido corretamente

**Solução:**
- Verifique se o `admin.html` está na raiz do projeto frontend
- Verifique se o Vite está configurado para servir múltiplos entry points
- Em produção, verifique se o build incluiu o `admin.html`

---

## 📝 Exemplo Completo

### 1. Criar usuário normal
```
Acesse: https://seu-site.com
Clique em "Registrar"
Username: admin_user
Senha: senha123
```

### 2. Tornar admin
```bash
# No terminal do backend
npm run create-admin admin_user admin
```

### 3. Acessar admin
```
Acesse: https://seu-site.com/admin.html
Login: admin_user
Senha: senha123
```

---

## 🔐 Segurança

**IMPORTANTE:**
- ✅ Use senhas fortes para contas admin
- ✅ Não compartilhe credenciais admin
- ✅ Use HTTPS em produção
- ✅ Considere adicionar autenticação de dois fatores (futuro)
