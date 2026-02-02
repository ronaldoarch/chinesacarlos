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
      }
    } catch (err) {
      setError(err.message || 'Erro ao carregar configuração')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    const min = Number(minDeposit)
    const max = Number(maxDeposit)
    if (Number.isNaN(min) || min < 1) {
      setError('Valor mínimo deve ser pelo menos R$ 1,00')
      return
    }
    if (Number.isNaN(max) || max < 1) {
      setError('Valor máximo deve ser pelo menos R$ 1,00')
      return
    }
    if (min > max) {
      setError('Valor mínimo não pode ser maior que o valor máximo')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      const response = await api.updateBonusConfig({ minDeposit: min, maxDeposit: max })
      if (response.success) {
        setSuccess('Limites de depósito salvos com sucesso!')
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
          <p>Carregando limites de depósito...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container admin-deposit-limits">
      <div className="admin-header">
        <h1>
          <i className="fa-solid fa-wallet"></i>
          Limites de Depósito
        </h1>
        <p className="section-description">
          Configure o valor mínimo e máximo permitido para depósitos PIX. Os usuários só poderão depositar valores dentro desta faixa.
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
        <h2><i className="fa-solid fa-coins"></i> Valores permitidos</h2>
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
          <span>Os usuários verão: Min: {formatBr(minDeposit)} - Max: {formatBr(maxDeposit)}</span>
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
            <><i className="fa-solid fa-save"></i> Salvar limites</>
          )}
        </button>
      </div>
    </div>
  )
}

export default AdminDepositLimits
