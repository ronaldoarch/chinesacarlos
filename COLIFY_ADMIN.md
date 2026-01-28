# Criar Admin no Colify - Guia Rápido

## 🎯 Passo a Passo no Colify

### 1️⃣ Listar Usuários Existentes

No terminal do backend no Colify, execute:

```bash
npm run list-users
```

Isso vai mostrar todos os usuários cadastrados com seus usernames.

### 2️⃣ Tornar Usuário Admin

Depois de ver a lista, use o **username real** (não "seu_usuario"):

```bash
npm run create-admin <username_real> admin
```

**Exemplo:**
```bash
npm run create-admin joao123 admin
```

### 3️⃣ Verificar

Execute novamente:
```bash
npm run list-users
```

O usuário deve aparecer com role `admin`.

---

## ⚠️ Erros Comuns

### ❌ "can't cd to backend"

**Causa:** Você já está no diretório backend ou a estrutura é diferente

**Solução:** 
- Não precisa fazer `cd backend`
- Execute direto: `npm run create-admin <username> admin`

### ❌ "Usuário não encontrado"

**Causa:** Você usou "seu_usuario" literalmente ou o username está errado

**Solução:**
1. Primeiro liste os usuários: `npm run list-users`
2. Use o username REAL que aparece na lista
3. Execute: `npm run create-admin <username_real> admin`

### ❌ "Role deve ser admin ou superadmin"

**Causa:** Você digitou o role errado ou com caracteres extras

**Solução:**
- Use exatamente: `admin` ou `superadmin`
- Sem espaços extras
- Sem caracteres especiais

---

## 📋 Exemplo Completo

### 1. Listar usuários
```bash
npm run list-users
```

**Saída esperada:**
```
📋 Usuários cadastrados:

────────────────────────────────────────────────────────────────────────────────
Username             | Role         | Status   | Cadastro
────────────────────────────────────────────────────────────────────────────────
joao123              | user         | Ativo    | 28/01/2026
maria456             | user         | Ativo    | 27/01/2026
```

### 2. Tornar admin
```bash
npm run create-admin joao123 admin
```

**Saída esperada:**
```
✅ Connected to MongoDB
✅ Usuário "joao123" agora é admin
📧 Você pode fazer login em https://seu-site.com/admin.html
```

### 3. Verificar
```bash
npm run list-users
```

Agora `joao123` deve aparecer com role `admin`.

---

## 🔐 Acessar o Admin

Depois de tornar o usuário admin:

1. Acesse: `https://seu-frontend.colify.app/admin.html`
2. Faça login com o username e senha do usuário admin
3. Você terá acesso ao painel administrativo

---

## 💡 Dica

Se você não sabe qual é o username do usuário:
1. Execute `npm run list-users` primeiro
2. Veja a lista de usuários
3. Use o username que aparece na lista

**NUNCA use "seu_usuario" - isso é apenas um exemplo!**
