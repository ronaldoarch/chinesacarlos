# Verificação de Webhooks PIX

Este documento descreve como verificar se os webhooks do gateway estão corretamente configurados para que o saldo seja creditado quando o cliente deposita.

## Fluxo do Depósito

1. **Cliente** gera PIX no app → Backend cria transação e chama NXGATE
2. **NXGATE** gera QR Code e registra a URL do webhook que receberá a confirmação
3. **Cliente** paga o PIX
4. **NXGATE** envia POST para a URL do webhook com status "pago"
5. **Backend** recebe webhook, atualiza transação e credita saldo no usuário

## Checklist de Configuração

### 1. URL do Webhook (crítico)

A URL deve ser **pública e acessível pela internet** (HTTPS em produção).

**Onde configurar:**
- **Admin → Gateway**: campo "URL base do Webhook"
- **Variável de ambiente**: `WEBHOOK_BASE_URL`

**Prioridade:** O valor do Admin (Gateway) tem prioridade sobre a variável de ambiente.

**URLs esperadas:**
- Depósitos: `https://SEU-BACKEND/api/webhooks/pix`
- Saques: `https://SEU-BACKEND/api/webhooks/pix-withdraw`

**Exemplo para Colify:**
```
https://fortune-bet-backend.colify.app
```
(sem barra no final)

### 2. Backend acessível

- O backend deve estar rodando e acessível na internet
- Em desenvolvimento local, use **ngrok** para expor: `ngrok http 5000`
- A URL do ngrok deve ser configurada no Admin ou em `WEBHOOK_BASE_URL`

### 3. Verificar se o webhook está sendo recebido

**Admin → Rastreamento → Webhooks**

Lista todas as chamadas recebidas em `/api/webhooks/pix` e `/api/webhooks/pix-withdraw`.

- Se **não aparecer nada** após o pagamento: a URL está errada ou o gateway não consegue alcançar seu backend
- Se **aparecer** mas o saldo não creditou: verificar o formato do payload (idTransaction, status)

### 4. Logs do servidor

Ao receber um webhook, o backend loga:
- `Webhook PIX: idTransaction não fornecido` → payload sem identificador da transação
- `Webhook PIX: Transação não encontrada` → idTransaction não bate com nenhuma transação no banco
- `Webhook PIX: status/type não reconhecido` → formato de status diferente do esperado
- `Webhook PIX: Transação X atualizada para paid` → sucesso

## Problemas Comuns

### Saldo não creditou

| Causa | Solução |
|-------|---------|
| URL do webhook errada | Corrigir em Admin → Gateway ou `WEBHOOK_BASE_URL` |
| Backend em localhost | Usar ngrok ou deploy em servidor público |
| idTransaction não encontrado | Gateway pode usar outro nome de campo; o código já suporta `id`, `tx_id`, `transaction_id`, `idTransaction` |
| Status não reconhecido | O código aceita: PAID, SUCCESS, CONFIRMED, APPROVED, etc. |

### Como debugar

1. Acesse **Admin → Rastreamento → Webhooks**
2. Verifique se há registros após o pagamento
3. Se houver: veja o `bodySummary` para checar o formato enviado pelo gateway
4. Se não houver: a URL está incorreta ou o gateway não está enviando

### Teste manual (desenvolvimento)

```bash
# Simular webhook de depósito pago (substitua ID_TRANSACAO pelo idTransaction real)
curl -X POST http://localhost:5000/api/webhooks/pix \
  -H "Content-Type: application/json" \
  -d '{"idTransaction":"ID_TRANSACAO","status":"PAID"}'
```

## Correções Aplicadas (última atualização)

1. **URL do webhook**: O backend agora usa a URL configurada no Admin (Gateway) em vez de apenas a variável de ambiente
2. **Parsing do payload**: Suporte a mais formatos de `idTransaction` (`id`, `tx_id`, dentro de `data`)
3. **Status de pagamento**: Aceita PAID, SUCCESS, CONFIRMED, APPROVED, COMPLETED, etc.
