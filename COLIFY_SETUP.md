# Configuração MongoDB no Colify

## 📋 Informações Importantes

Baseado nas imagens da configuração do MongoDB no Colify:

### 1. Status do Banco
- O MongoDB está **"Exited"** (parado)
- Você precisa clicar em **"Start"** para iniciar o banco

### 2. Configurações do MongoDB

**Credenciais:**
- **Username:** `root`
- **Password:** (a senha que você configurou)
- **Database:** `default` (ou o nome que você preferir)

**Imagem Docker:**
- `mongo:7` (MongoDB versão 7)

### 3. Mongo URL (Internal)

O Colify fornece uma **Mongo URL interna** que você deve usar na variável `MONGODB_URI`.

**Formato esperado:**
```
mongodb://root:senha@mongodb-database-wsoogsogswocogg4og4k8k4w:27017/default
```

Ou se for MongoDB Atlas (externo):
```
mongodb+srv://root:senha@cluster.mongodb.net/default
```

## 🔧 Configuração no Backend

### Variável de Ambiente no Colify

No serviço do **backend** no Colify, configure:

```env
MONGODB_URI=mongodb://root:SUA_SENHA@mongodb-database-wsoogsogswocogg4og4k8k4w:27017/default
```

**Importante:**
- Substitua `SUA_SENHA` pela senha real do MongoDB
- Substitua `mongodb-database-wsoogsogswocogg4og4k8k4w` pelo nome/host correto do seu serviço MongoDB
- Substitua `default` pelo nome do banco que você quer usar (ou deixe `default`)

### Se o MongoDB estiver em outro serviço

Se o MongoDB estiver em um serviço separado no Colify:

1. **Copie a "Mongo URL (internal)"** do painel do MongoDB
2. **Cole no campo `MONGODB_URI`** do serviço do backend
3. **Substitua a senha** se necessário

## ⚠️ Observações Importantes

### Port Mapping
Na imagem vejo `3000:5432` - isso parece incorreto:
- **5432** é porta do PostgreSQL
- **MongoDB** usa porta **27017** por padrão

**Correção sugerida:**
- Port mapping deveria ser: `27017:27017` ou similar
- Ou deixe o Colify gerenciar automaticamente

### Database Name
- O banco está configurado como `default`
- Você pode mudar para `fortune-bet` ou outro nome
- Se mudar, atualize também na `MONGODB_URI`

## 📝 Checklist

- [ ] MongoDB está **iniciado** (não "Exited")
- [ ] Copiou a **Mongo URL (internal)** do painel
- [ ] Configurou `MONGODB_URI` no serviço do backend
- [ ] Substituiu a senha na URL
- [ ] Verificou o nome do banco de dados
- [ ] Testou a conexão

## 🧪 Testar Conexão

Após configurar, você pode testar a conexão verificando os logs do backend:

```bash
# Nos logs do backend no Colify, você deve ver:
✅ Database Connected: [hostname]
```

Se aparecer erro, verifique:
1. MongoDB está rodando?
2. URL está correta?
3. Senha está correta?
4. Nome do serviço/host está correto?

## 🔐 Segurança

**Nunca commite a senha no código!**
- Use sempre variáveis de ambiente
- A senha deve estar apenas no painel do Colify
- Não compartilhe a URL completa com senha
