import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import './VipModal.css'

const vipLevels = [
  { level: 1, bets: 50, deposits: 10, bonus: 0, image: '/level/level1.png' },
  { level: 2, bets: 150, deposits: 30, bonus: 3, image: '/level/level2.png' },
  { level: 3, bets: 250, deposits: 50, bonus: 5, image: '/level/level3.png' },
  { level: 4, bets: 500, deposits: 100, bonus: 10, image: '/level/level4.png' },
  { level: 5, bets: 800, deposits: 200, bonus: 20, image: '/level/level5.png' },
  { level: 6, bets: 2500, deposits: 500, bonus: 50, image: '/level/level6.png' },
  { level: 7, bets: 7500, deposits: 1500, bonus: 100, image: '/level/level7.png' }
]

function VipModal({ isOpen, onClose, onBack }) {
  const { user, updateUser } = useAuth()
  const [isClosing, setIsClosing] = useState(false)
  const [vipStatus, setVipStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [claiming, setClaiming] = useState(null)
  
  useEffect(() => {
    if (isOpen) {
      loadVipStatus()
    }
  }, [isOpen])

  const loadVipStatus = async () => {
    try {
      setLoading(true)
      const response = await api.getVipStatus()
      if (response.success) {
        setVipStatus(response.data)
      }
    } catch (error) {
      console.error('Error loading VIP status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClaimBonus = async (level) => {
    try {
      setClaiming(level)
      const response = await api.claimVipBonus(level)
      if (response.success) {
        await loadVipStatus()
        const userResponse = await api.getCurrentUser()
        if (userResponse.success) {
          updateUser(userResponse.data.user)
        }
        alert(response.message)
      } else {
        alert(response.message || 'Erro ao resgatar bônus')
      }
    } catch (error) {
      alert('Erro ao resgatar bônus. Tente novamente.')
    } finally {
      setClaiming(null)
    }
  }

  const handleClaimAll = async () => {
    try {
      setClaiming('all')
      const response = await api.claimAllVipBonuses()
      if (response.success) {
        await loadVipStatus()
        const userResponse = await api.getCurrentUser()
        if (userResponse.success) {
          updateUser(userResponse.data.user)
        }
        alert(response.message)
      } else {
        alert(response.message || 'Erro ao resgatar bônus')
      }
    } catch (error) {
      alert('Erro ao resgatar bônus. Tente novamente.')
    } finally {
      setClaiming(null)
    }
  }
  
  const vipLevel = vipStatus?.currentLevel || user?.vipLevel || 0
  const vipProgress1 = vipStatus?.totalDeposits || 0
  const vipTarget1 = vipStatus?.nextLevel?.depositsRequired || 10
  const vipProgress2 = vipStatus?.totalBets || 0
  const vipTarget2 = vipStatus?.nextLevel?.betsRequired || 50
  
  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value || 0)
  
  const calculateVipProgress = (current, target) => {
    if (!target || target === 0) return 0
    return Math.min((current / target) * 100, 100)
  }
  
  const vipProgress1Percent = calculateVipProgress(vipProgress1, vipTarget1)
  const vipProgress2Percent = calculateVipProgress(vipProgress2, vipTarget2)

  useEffect(() => {
    if (isOpen) setIsClosing(false)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      if (onClose) onClose()
    }, 600)
  }

  const handleBack = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      if (onBack) onBack()
    }, 600)
  }

  if (!isOpen && !isClosing) return null

  return (
    <div className={`vip-modal ${isClosing ? 'is-closing' : ''}`}>
      <div className="vip-modal-header">
        <button className="vip-modal-back" type="button" onClick={handleBack} aria-label="Voltar">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <span className="vip-modal-title">VIP</span>
      </div>

      <div className="vip-content">
        <div className="vip-summary">
          <div className="vip-summary-icon">
            <img src="/bottom/icon_vip.png" alt="VIP" />
          </div>
          <div className="vip-summary-info">
            <div className="vip-summary-item">
              <span>Depósitos para promoção</span>
              <div className="vip-progress">
                <span className="vip-progress-fill" style={{ width: `${vipProgress1Percent}%` }}></span>
                <span className="vip-progress-text" style={{ fontSize: '11px' }}>
                  {formatCurrency(vipProgress1)}/{formatCurrency(vipTarget1)}
                </span>
              </div>
            </div>
            <div className="vip-summary-item">
              <span>Apostas para promoção</span>
              <div className="vip-progress">
                <span className="vip-progress-fill" style={{ width: `${vipProgress2Percent}%` }}></span>
                <span className="vip-progress-text" style={{ fontSize: '11px' }}>
                  {formatCurrency(vipProgress2)}/{formatCurrency(vipTarget2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button 
          className="vip-redeem" 
          type="button"
          onClick={handleClaimAll}
          disabled={loading || claiming === 'all' || !vipStatus || vipStatus.levels.filter(l => l.unlocked && !l.claimed).length === 0}
        >
          {claiming === 'all' ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>Resgatando...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-gift"></i>
              <span>Resgatar tudo</span>
            </>
          )}
        </button>

        {loading ? (
          <div className="vip-loading">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Carregando níveis VIP...</span>
          </div>
        ) : (
          <div className="vip-levels">
            {vipLevels.map((level) => {
              const levelData = vipStatus?.levels?.find(l => l.level === level.level) || {
                unlocked: false,
                claimed: false
              }
              const isUnlocked = levelData.unlocked
              const isClaimed = levelData.claimed
              const isCurrentLevel = level.level === vipLevel
              
              return (
                <div key={level.level} className={`vip-level-card ${isCurrentLevel ? 'current' : ''} ${isUnlocked ? 'unlocked' : 'locked'}`}>
                  <div className="vip-level-row">
                    <div className="vip-level-label">Nível</div>
                    <div className="vip-level-cell">
                      <div className="vip-level-cell-content">
                        <img src={level.image} alt={`Nível ${level.level}`} />
                        <span>Nível {level.level}</span>
                      </div>
                    </div>
                  </div>
                  <div className="vip-level-row">
                    <div className="vip-level-label">Apostas</div>
                    <div className="vip-bets-cell">{formatCurrency(level.bets)}</div>
                  </div>
                  <div className="vip-level-row">
                    <div className="vip-level-label">Depósitos</div>
                    <div className="vip-deposits-cell">{formatCurrency(level.deposits)}</div>
                  </div>
                  <div className="vip-level-row">
                    <div className="vip-level-label">Bônus</div>
                    <div className="vip-reward-cell">{formatCurrency(level.bonus)}</div>
                  </div>
                  <div className="vip-level-row">
                    <div className="vip-level-label">Ação</div>
                    <div className="vip-action-cell">
                      {isClaimed ? (
                        <span className="vip-action-status claimed">
                          <i className="fa-solid fa-check-circle"></i>
                          Resgatado
                        </span>
                      ) : isUnlocked ? (
                        <button
                          className="vip-action-btn"
                          onClick={() => handleClaimBonus(level.level)}
                          disabled={claiming === level.level}
                        >
                          {claiming === level.level ? (
                            <>
                              <i className="fa-solid fa-spinner fa-spin"></i>
                              Resgatando...
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-gift"></i>
                              Resgatar
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="vip-action-status locked">
                          <i className="fa-solid fa-lock"></i>
                          Bloqueado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default VipModal
