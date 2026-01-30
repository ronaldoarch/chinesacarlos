# Dados reais nas páginas de perfil do usuário

## ✅ Usando dados reais

| Página / Modal | Dados | Fonte |
|----------------|--------|--------|
| **ProfileModal** (Perfil) | Nome, ID, nível VIP, barras de progresso VIP | `useAuth().user` (username, _id, vipLevel) + `api.getVipStatus()` (totalDeposits, totalBets, nextLevel) |
| **DepositHistoryModal** (Histórico de depósitos) | Lista de depósitos | `api.getTransactions({ type: 'deposit' })` |
| **WithdrawModal** (Saque) | Saldo disponível | `user.balance` (AuthContext) |

## ❌ Ainda com dados mockados ou não integrados

| Página / Modal | Problema |
|----------------|----------|
| **EditProfileModal** (Editar Dados) | Campos vazios; não carrega username/telefone do usuário e não envia salvamento para a API (não existe PUT /auth/profile no backend). |
| **WithdrawModal** (Saque) | No resumo “Conta para recebimento” aparecem nome e chave PIX fixos (“diago xavier”, “segurobackup@gmail.com”). Deveria usar a conta PIX selecionada ou avisar para cadastrar. |
| **WithdrawModal** (Contas PIX) | Lista de contas hoje vem de estado local vazio; quando houver API de contas PIX, será preciso buscar e preencher. |
| **BetsHistoryModal** (Histórico de apostas) | Não há rota de apostas no backend; o modal chama `api.getTransactions({ type: 'deposit' })` como placeholder e força lista vazia, então nunca mostra apostas reais. |
| **WithdrawModal** (Histórico de saques) | Mensagem fixa “Você ainda não possui saques registrados”; não há chamada à API para listar saques. |

## Resumo

- **Perfil principal e VIP:** dados reais (user + VIP status).
- **Histórico de depósitos:** dados reais (transações).
- **Saldo no saque:** real.
- **Editar dados, conta PIX no saque, histórico de apostas/saques:** ainda mockados ou sem integração com API.
