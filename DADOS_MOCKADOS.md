# Dados mockados e integrações

Este documento indica onde existiam dados mockados (hardcoded) e o que foi integrado à API ou ao admin.

## Corrigido / integrado

### Depósito (faixas de bônus)
- **Antes:** `DepositModal.jsx` usava lista fixa de valores (R$ 10–100) e percentuais de bônus (+0%, +2%, +5%, +10%).
- **Agora:** As faixas vêm da API `GET /api/bonus/config` (configurável no admin em **Bônus**). Fallback para a lista padrão se a API falhar.

### Baús (recompensas por indicados)
- **Antes:** `backend/routes/chest.routes.js` tinha a tabela de níveis (indicados → recompensa) fixa no código.
- **Agora:** Os níveis vêm de `BonusConfig.chestTiers`, configurável no admin em **Bônus** (recompensas dos baús). Fallback para tabela padrão se não houver config.

### Popups de promoção
- **Antes:** Não existia gestão de popup na entrada do site.
- **Agora:** Admin **Popups** (CRUD). Popup ativo é exibido na entrada do site (uma vez por sessão, se configurado). API: `GET /api/popups/active`, CRUD em `/api/popups` (admin).

### Configuração de bônus (admin)
- Nova página **Bônus** no admin:
  - Bônus 1º depósito (%)
  - Faixas de depósito (valor R$ + % bônus) – usadas no modal de depósito
  - Bônus afiliados (%)
  - Recompensas dos baús (indicados qualificados → valor R$) – usadas na rota de chests

---

## Ainda com dados fixos (frontend ou backend)

### VIP (níveis e bônus)
- **Backend:** `backend/routes/vip.routes.js` define níveis VIP (depósitos/apostas necessárias e bônus em R$) em array fixo.
- **Frontend:** `VipModal.jsx` tem array de níveis com imagens (`/level/level1.png`, etc.) e valores; o status real vem da API `/api/vip/status`.
- **Sugestão:** Se quiser configurar níveis VIP pelo admin, criar modelo `VipLevelConfig` e página no admin, e fazer `vip.routes.js` e `VipModal` consumirem essa config.

### Promoções (modal de promoções)
- **Frontend:** `PromotionsModal.jsx` usa lista fixa de 5 imagens (`/bannerPromo/bp1.jpg` … `bp5.jpg`).
- **Sugestão:** Passar a usar a API de banners (`GET /api/banners`) filtrando por tipo “promo”, ou criar endpoint/listagem específica para “promoções” e exibir no modal.

### ProfileModal (progresso VIP)
- **Antes:** Progresso VIP mockado (vipProgress1/2 = 0, vipTarget1/2 fixos).
- **Agora:** Ao abrir o perfil, o modal chama `GET /api/vip/status` e exibe totalDeposits/totalBets e metas do próximo nível (depositsRequired, betsRequired) nas barras de progresso.

### Navegação (ícones e labels)
- **Frontend:** `NavigationIcons.jsx` e `BottomNavigation` usam listas fixas de ícones/labels (Promoção, Bônus, etc.). Normal para UI; só alterar se quiser labels dinâmicos.

### Jackpot (valor na home)
- **Antes:** Valor fixo "R$ 15.681.020,40" em `JackpotDisplay.jsx`.
- **Agora:** Valor vem de `GET /api/jackpot`. Admin **Jackpot** permite atualizar; a home atualiza a cada 1 minuto (refetch). Backend: `JackpotConfig` + rotas GET (público) e PUT (admin).

---

## Resumo

| Onde              | Antes              | Agora                                      |
|-------------------|--------------------|--------------------------------------------|
| Depósito (valores/bônus) | Lista fixa no modal | API `/api/bonus/config` + admin Bônus      |
| Baús (recompensas)      | Array fixo no backend | `BonusConfig.chestTiers` + admin Bônus     |
| Popup entrada           | Não existia        | Admin Popups + `GET /api/popups/active`    |
| Jackpot (home)          | Valor fixo         | API `/api/jackpot` + admin Jackpot        |
| Perfil (progresso VIP) | Progresso mockado  | API `/api/vip/status`                     |
| VIP níveis              | Fixo no backend e no VipModal | Ainda fixo; possível migrar para config   |
| Modal Promoções         | 5 imagens fixas    | Ainda fixo; possível usar API de banners  |
