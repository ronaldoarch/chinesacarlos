import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import './AdminJackpot.css'

function AdminJackpot() {
  const { isAdmin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false)
      return
    }
    loadJackpot()
  }, [isAdmin])

  const loadJackpot = async () => {
    try {
      setLoading(true)
      const response = await api.getJackpot()
      if (response.success && response.data != null) {
        setValue(String(response.data.value ?? ''))
      }
    } catch (err) {
      setError(err.message || 'Erro ao carregar jackpot')
    } finally {
      setLoading(false)
    }
  }

  const normalizeNumber = (str) => {
    const s = String(str).trim().replace(/\s/g, '')
    if (s.includes(',')) {
      return s.replace(/\./g, '').replace(',', '.')
    }
    return s
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const num = parseFloat(normalizeNumber(value))
    if (Number.isNaN(num) || num < 0) {
      setError('Informe um valor válido')
      return
    }
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      const response = await api.updateJackpot(num)
      if (response.success) {
        setValue(String(response.data.value))
        setSuccess('Jackpot atualizado! O valor na home será atualizado em até 1 minuto.')
        setTimeout(() => setSuccess(null), 4000)
      } else {
        setError(response.message || 'Erro ao salvar')
      }
    } catch (err) {
      setError(err.message || 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const formatPreview = () => {
    const num = parseFloat(normalizeNumber(value))
    if (Number.isNaN(num)) return '—'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
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
          <p>Carregando jackpot...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container admin-jackpot">
      <div className="admin-header">
        <h1>
          <i className="fa-solid fa-coins"></i>
          Jackpot
        </h1>
        <p className="section-description">
          Valor exibido no banner de jackpot na home. Atualize aqui para o número “aumentar” na página.
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
        <h2>Valor atual (R$)</h2>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Valor do jackpot</label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="15681020.40"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <small className="form-hint">Preview: {formatPreview()}</small>
          </div>
          <div className="config-actions">
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? <><i className="fa-solid fa-spinner fa-spin"></i> Salvando...</> : <><i className="fa-solid fa-save"></i> Atualizar jackpot</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminJackpot
