import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import './AdminAffiliates.css'

function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState([])
  const [selectedAffiliate, setSelectedAffiliate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [configSaving, setConfigSaving] = useState(false)
  const [configError, setConfigError] = useState(null)
  const [configSuccess, setConfigSuccess] = useState(null)
  const [affiliateConfig, setAffiliateConfig] = useState({
    affiliateCpa: 0,
    affiliateRevShare: 0,
    affiliateSkipDeposits: 0,
    affiliateTotalDepositsCycle: 0
  })

  useEffect(() => {
    loadAffiliates()
  }, [page, search])

  const loadAffiliates = async () => {
    try {
      setLoading(true)
      const response = await api.getAffiliatesAdmin(search, page)
      if (response.success) {
        setAffiliates(response.data.affiliates || [])
        setTotalPages(response.data.pagination?.pages || 1)
      }
    } catch (error) {
      console.error('Error loading affiliates:', error)
      alert('Erro ao carregar afiliados')
    } finally {
      setLoading(false)
    }
  }

  const loadAffiliateDetails = async (userId) => {
    try {
      const response = await api.getAffiliateDetailsAdmin(userId)
      if (response.success) {
        setSelectedAffiliate(response.data)
        setAffiliateConfig({
          affiliateCpa: response.data.user?.affiliateCpa || 0,
          affiliateRevShare: response.data.user?.affiliateRevShare || 0,
          affiliateSkipDeposits: response.data.user?.affiliateSkipDeposits || 0,
          affiliateTotalDepositsCycle: response.data.user?.affiliateTotalDepositsCycle || 0
        })
        setConfigError(null)
        setConfigSuccess(null)
      }
    } catch (error) {
      console.error('Error loading affiliate details:', error)
      alert('Erro ao carregar detalhes do afiliado')
    }
  }

  const handleSaveConfig = async () => {
    if (!selectedAffiliate?.user?.id) return
    
    try {
      setConfigSaving(true)
      setConfigError(null)
      setConfigSuccess(null)
      
      const response = await api.updateAffiliateConfig(selectedAffiliate.user.id, affiliateConfig)
      if (response.success) {
        setConfigSuccess('Configuração salva com sucesso!')
        setTimeout(() => setConfigSuccess(null), 3000)
        // Reload affiliate details to get updated data
        await loadAffiliateDetails(selectedAffiliate.user.id)
      } else {
        setConfigError(response.message || 'Erro ao salvar configuração')
      }
    } catch (error) {
      console.error('Error saving affiliate config:', error)
      setConfigError(error.message || 'Erro ao salvar configuração')
    } finally {
      setConfigSaving(false)
    }
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value || 0)

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Gerenciamento de Afiliados</h1>
      </div>

      <div className="admin-affiliates-content">
        <div className="affiliates-filters">
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Buscar por username ou código de referência..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Carregando afiliados...</span>
          </div>
        ) : (
          <>
            <div className="affiliates-table-wrapper">
              <table className="affiliates-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Código</th>
                    <th>Saldo Afiliado</th>
                    <th>Total Referidos</th>
                    <th>Qualificados</th>
                    <th>Total Depósitos</th>
                    <th>Total Apostas</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliates.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="empty-state">
                        Nenhum afiliado encontrado
                      </td>
                    </tr>
                  ) : (
                    affiliates.map((affiliate) => (
                      <tr key={affiliate.id}>
                        <td>{affiliate.username}</td>
                        <td>
                          <code className="referral-code">{affiliate.referralCode}</code>
                        </td>
                        <td className="amount-cell">{formatCurrency(affiliate.affiliateBalance)}</td>
                        <td>{affiliate.totalReferrals}</td>
                        <td>{affiliate.qualifiedReferrals}</td>
                        <td className="amount-cell">{formatCurrency(affiliate.totalDeposits)}</td>
                        <td className="amount-cell">{formatCurrency(affiliate.totalBets)}</td>
                        <td>
                          <button
                            className="btn-view-details"
                            onClick={() => loadAffiliateDetails(affiliate.id)}
                          >
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </button>
                <span>
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}

        {selectedAffiliate && (
          <div className="affiliate-details-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Detalhes do Afiliado</h2>
                <button onClick={() => setSelectedAffiliate(null)}>
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="details-section">
                  <h3>Informações do Afiliado</h3>
                  <div className="info-grid">
                    <div>
                      <label>Username:</label>
                      <span>{selectedAffiliate.user?.username}</span>
                    </div>
                    <div>
                      <label>Código de Referência:</label>
                      <code>{selectedAffiliate.user?.referralCode}</code>
                    </div>
                    <div>
                      <label>Saldo Afiliado:</label>
                      <span className="amount">{formatCurrency(selectedAffiliate.user?.affiliateBalance)}</span>
                    </div>
                    <div>
                      <label>Total de Referidos:</label>
                      <span>{selectedAffiliate.stats?.totalReferrals}</span>
                    </div>
                    <div>
                      <label>Qualificados:</label>
                      <span>{selectedAffiliate.stats?.qualifiedReferrals}</span>
                    </div>
                    <div>
                      <label>Total Depósitos:</label>
                      <span className="amount">{formatCurrency(selectedAffiliate.stats?.totalDeposits)}</span>
                    </div>
                    <div>
                      <label>Total Apostas:</label>
                      <span className="amount">{formatCurrency(selectedAffiliate.stats?.totalBets)}</span>
                    </div>
                    <div>
                      <label>Total Recompensas:</label>
                      <span className="amount">{formatCurrency(selectedAffiliate.stats?.totalRewards)}</span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Configuração de Comissões</h3>
                  {configError && (
                    <div className="config-error">
                      <i className="fa-solid fa-circle-exclamation"></i>
                      <span>{configError}</span>
                    </div>
                  )}
                  {configSuccess && (
                    <div className="config-success">
                      <i className="fa-solid fa-circle-check"></i>
                      <span>{configSuccess}</span>
                    </div>
                  )}
                  <div className="config-form">
                    <div className="config-form-group">
                      <label>CPA (R$)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={affiliateConfig.affiliateCpa}
                        onChange={(e) => setAffiliateConfig({ ...affiliateConfig, affiliateCpa: parseFloat(e.target.value) || 0 })}
                        placeholder="0.00"
                      />
                      <small>Valor pago apenas no primeiro depósito do indicado</small>
                    </div>
                    <div className="config-form-group">
                      <label>RevShare (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={affiliateConfig.affiliateRevShare}
                        onChange={(e) => setAffiliateConfig({ ...affiliateConfig, affiliateRevShare: parseFloat(e.target.value) || 0 })}
                        placeholder="0.00"
                      />
                      <small>Percentual sobre o ganho da plataforma do indicado</small>
                    </div>
                    <div className="config-form-group">
                      <label>Pular Depósitos</label>
                      <input
                        type="number"
                        min="0"
                        value={affiliateConfig.affiliateSkipDeposits}
                        onChange={(e) => setAffiliateConfig({ ...affiliateConfig, affiliateSkipDeposits: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                      <small>Quantos depósitos pular no ciclo (ex: 1)</small>
                    </div>
                    <div className="config-form-group">
                      <label>Total de Depósitos no Ciclo</label>
                      <input
                        type="number"
                        min="0"
                        value={affiliateConfig.affiliateTotalDepositsCycle}
                        onChange={(e) => setAffiliateConfig({ ...affiliateConfig, affiliateTotalDepositsCycle: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                      <small>Total de depósitos no ciclo (ex: 2 para pular 1 a cada 2, ou 10 para pular 5 a cada 10)</small>
                    </div>
                    {affiliateConfig.affiliateTotalDepositsCycle > 0 && (
                      <div className="config-info">
                        <i className="fa-solid fa-info-circle"></i>
                        <span>
                          Configuração: Pular {affiliateConfig.affiliateSkipDeposits} depósito(s) a cada {affiliateConfig.affiliateTotalDepositsCycle} depósito(s).
                          O afiliado ganhará RevShare em {affiliateConfig.affiliateTotalDepositsCycle - affiliateConfig.affiliateSkipDeposits} depósito(s) e não ganhará em {affiliateConfig.affiliateSkipDeposits} depósito(s).
                        </span>
                      </div>
                    )}
                    <div className="config-form-actions">
                      <button
                        type="button"
                        className="config-save-btn"
                        onClick={handleSaveConfig}
                        disabled={configSaving}
                      >
                        {configSaving ? (
                          <><i className="fa-solid fa-spinner fa-spin"></i> Salvando...</>
                        ) : (
                          <><i className="fa-solid fa-save"></i> Salvar Configuração</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Referidos ({selectedAffiliate.referrals?.length || 0})</h3>
                  <div className="referrals-table-wrapper">
                    <table className="referrals-table">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Status</th>
                          <th>Depósitos</th>
                          <th>Apostas</th>
                          <th>Recompensa</th>
                          <th>Qualificado em</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAffiliate.referrals && selectedAffiliate.referrals.length > 0 ? (
                          selectedAffiliate.referrals.map((ref) => (
                            <tr key={ref.id}>
                              <td>{ref.referred?.username || 'N/A'}</td>
                              <td>
                                <span className={`status-badge ${ref.status}`}>
                                  {ref.status === 'qualified' ? 'Qualificado' : 
                                   ref.status === 'rewarded' ? 'Recompensado' : 'Pendente'}
                                </span>
                              </td>
                              <td className="amount-cell">{formatCurrency(ref.totalDeposits)}</td>
                              <td className="amount-cell">{formatCurrency(ref.totalBets)}</td>
                              <td className="amount-cell">{formatCurrency(ref.rewardAmount)}</td>
                              <td>
                                {ref.qualifiedAt
                                  ? new Date(ref.qualifiedAt).toLocaleDateString('pt-BR')
                                  : '-'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="empty-state">
                              Nenhum referido encontrado
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminAffiliates
