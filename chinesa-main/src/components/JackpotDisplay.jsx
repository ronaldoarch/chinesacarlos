import React, { useEffect, useState } from 'react'
import api from '../services/api'
import './JackpotDisplay.css'

function JackpotDisplay() {
  const [value, setValue] = useState(null)
  const [error, setError] = useState(false)

  const fetchJackpot = () => {
    api.getJackpot()
      .then((res) => {
        if (res.success && res.data != null) {
          setValue(res.data.value)
          setError(false)
        }
      })
      .catch(() => setError(true))
  }

  useEffect(() => {
    fetchJackpot()
    const interval = setInterval(fetchJackpot, 60000)
    return () => clearInterval(interval)
  }, [])

  const formatted = value != null
    ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value)
    : (error ? '—' : '...')

  return (
    <div className="jackpot-display">
      <div className="jackpot-image-wrapper">
        <img src="/jackpot-imagem.webp" alt="Jackpot" className="jackpot-img-full" loading="lazy" />
        <div className="jackpot-value-absolute">{formatted}</div>
      </div>
    </div>
  )
}

export default JackpotDisplay

