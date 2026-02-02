import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import './AdminDepositLimits.css'

function AdminDepositLimits() {
  const { isAdmin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [minDeposit, setMinDeposit] = useState(10)
  const [maxDeposit, setMaxDeposit] = useState(10000)
  const [minWithdraw, setMinWithdraw] = useState(20)
  const [maxWithdraw, setMaxWithdraw] = useState(5000)

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false)
      return
    }
    loadConfig()
  }, [isAdmin])

  const loadConfig = async () => {
    try {
      setLoading(true)
      const response = await api.getBonusConfigAdmin()
      if (response.success && response.data) {
        const c = response.data
        setMinDeposit(c.minDeposit ?? 10)
        setMaxDeposit(c.maxDeposit ?? 10000)
        setMinWithdraw(c.minWithdraw ?? 20)
        setMaxWithdraw(c.maxWithdraw ?? 5000)
      }
    } catch (err) {
      setError(err.message || 'Erro ao carregar configuração')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    const minDep = Number(minDeposit)
    const maxDep = Number(maxDeposit)
    const minWit = Number(minWithdraw)
    const maxWit = Number(maxWithdraw)
    
    if (Number.isNaN(minDep) || minDep < 1) {
      setError('Valor mínimo de depósito deve ser pelo menos R$ 1,00')
      return
    }
    if (Number.isNaN(maxDep) || maxDep < 1) {
      setError('Valor máximo de depósito deve ser pelo menos R$ 1,00')
      return
    }
    if (minDep > maxDep) {
      setError('Valor mínimo de depósito não pode ser maior que o valor máximo')
      return
    }
    if (Number.isNaN(minWit) || minWit < 1) {
      setError('Valor mínimo de saque deve ser pelo menos R$ 1,00')
      return
    }
    if (Number.isNaN(maxWit) || maxWit < 1) {
      setError('Valor máximo de saque deve ser pelo menos R$ 1,00')
      return
    }
    if (minWit > maxWit) {
      setError('Valor mínimo de saque não pode ser maior que o valor máximo')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      const response = await api.updateBonusConfig({ 
        minDeposit: minDep, 
        maxDeposit: maxDep,
        minWithdraw: minWit,
        maxWithdraw: maxWit
      })
      if (response.success) {
        setSuccess('Limites de depósito e saque salvos com sucesso!')
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(response.message || 'Erro ao salvar')
      }
    } catch (err) {
      setError(err.message || 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const formatBr = (v) => {
    const n = Number(v)
    if (Number.isNaN(n)) return ''
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(n)
  }

  if (!isAdmin) {
    return (
      <div className="admin-container">
        <div className="admin-error">
          <i className="fa-solid fa-lock"></i>
          <h2>Acesso Negado</h2>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          <i className="fa-solid fa-spinner fa-spin"></i>
          <p>Carregando limites de depósito e saque...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container admin-deposit-limits">
      <div className="admin-header">
        <h1>
          <i className="fa-solid fa-wallet"></i>
          Limites de Depósito e Saque
        </h1>
        <p className="section-description">
          Configure os valores mínimos e máximos permitidos para depósitos e saques PIX. Os usuários só poderão realizar transações dentro destas faixas.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <i className="fa-solid fa-circle-exclamation"></i>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          <i className="fa-solid fa-circle-check"></i>
          <span>{success}</span>
        </div>
      )}

      <div className="config-section">
        <h2><i className="fa-solid fa-arrow-down"></i> Limites de Depósito</h2>
        <div className="limits-grid">
          <div className="form-group">
            <label>Valor mínimo (R$)</label>
            <input
              type="number"
              min="1"
              max="100000"
              step="1"
              value={minDeposit}
              onChange={(e) => setMinDeposit(e.target.value)}
              placeholder="10"
            />
            <small>Ex: 10</small>
          </div>
          <div className="form-group">
            <label>Valor máximo (R$)</label>
            <input
              type="number"
              min="1"
              max="1000000"
              step="1"
              value={maxDeposit}
              onChange={(e) => setMaxDeposit(e.target.value)}
              placeholder="10000"
            />
            <small>Ex: 10000</small>
          </div>
        </div>
        <div className="limits-preview">
          <i className="fa-solid fa-info-circle"></i>
          <span>Depósitos: Min: {formatBr(minDeposit)} - Max: {formatBr(maxDeposit)}</span>
        </div>
      </div>

      <div className="config-section">
        <h2><i className="fa-solid fa-arrow-up"></i> Limites de Saque</h2>
        <div className="limits-grid">
          <div className="form-group">
            <label>Valor mínimo (R$)</label>
            <input
              type="number"
              min="1"
              max="100000"
              step="1"
              value={minWithdraw}
              onChange={(e) => setMinWithdraw(e.target.value)}
              placeholder="20"
            />
            <small>Ex: 20</small>
          </div>
          <div className="form-group">
            <label>Valor máximo (R$)</label>
            <input
              type="number"
              min="1"
              max="1000000"
              step="1"
              value={maxWithdraw}
              onChange={(e) => setMaxWithdraw(e.target.value)}
              placeholder="5000"
            />
            <small>Ex: 5000</small>
          </div>
        </div>
        <div className="limits-preview">
          <i className="fa-solid fa-info-circle"></i>
          <span>Saques: Min: {formatBr(minWithdraw)} - Max: {formatBr(maxWithdraw)}</span>
        </div>
      </div>

      <div className="config-actions">
        <button
          type="button"
          className="save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <><i className="fa-solid fa-spinner fa-spin"></i> Salvando...</>
          ) : (
            <><i className="fa-solid fa-save"></i> Salvar limites de depósito e saque</>
          )}
        </button>
      </div>
    </div>
  )
}

export default AdminDepositLimits
