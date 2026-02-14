# 🔧 Fix CORS - nakasbet.com.br

## 🐛 Problema

O console do navegador mostra:
```
Access to fetch at 'https://z484wssg0s4wskwgw8sksc8w.agenciamidas.com/api/...' 
from origin 'https://nakasbet.com.br' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ Solução

O **backend** (API em `agenciamidas.com`) precisa permitir requisições de `https://nakasbet.com.br`.

### Passo 1: Configurar o Backend no Coolify

1. No Coolify, vá no **projeto** que contém o **Backend** (não o frontend)
2. Encontre o serviço do Backend (o que está em `z484wssg0s4wskwgw8sksc8w.agenciamidas.com`)
3. Abra **Environment Variables**
4. Adicione ou atualize:

```env
FRONTEND_URL=https://nakasbet.com.br
```

**Ou**, se precisar de múltiplos domínios (www e sem www):

```env
CORS_ORIGINS=https://nakasbet.com.br,https://www.nakasbet.com.br
```

### Passo 2: Redeploy do Backend

Após alterar as variáveis:
1. Clique em **Save**
2. Clique em **Redeploy** ou **Restart**
3. Aguarde o deploy completar

### Passo 3: Verificar

1. Abra `https://nakasbet.com.br` no navegador
2. Abra o Console (F12)
3. Os erros de CORS devem desaparecer
4. O site deve carregar tema, banners, logo, etc.

## 📋 Checklist

- [ ] `FRONTEND_URL=https://nakasbet.com.br` no backend (sem barra no final)
- [ ] Backend foi redeployado após a alteração
- [ ] Frontend usa `VITE_API_URL=https://z484wssg0s4wskwgw8sksc8w.agenciamidas.com/api`

## ⚠️ Observação sobre VITE_API_URL

Nas suas screenshots do Coolify, o frontend tem `VITE_API_URL=https://api.nakasbet.com.br`, mas as requisições estão indo para `agenciamidas.com`. Isso indica que:

- O site em **nakasbet.com.br** foi buildado com `VITE_API_URL` apontando para `agenciamidas.com`
- Ou existe outro deploy (ex: outro projeto Coolify) servindo nakasbet.com.br

Se o frontend em nakasbet.com.br for o projeto **chinesacarlos** do Coolify, confira se `VITE_API_URL` está correto:
- Deve ser: `https://z484wssg0s4wskwgw8sksc8w.agenciamidas.com/api`
- Depois de alterar, faça **Redeploy** do frontend (Vite injeta a URL no build)
