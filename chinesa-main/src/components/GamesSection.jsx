import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './GamesSection.css'

function GamesSection({ onViewAll }) {
  const { isAuthenticated } = useAuth()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSelectedGames()
  }, [])

  const loadSelectedGames = async () => {
    try {
      const response = await api.getSelectedGames()
      if (response.success && response.data.games) {
        // Limit to 6 games for display
        setGames(response.data.games.slice(0, 6).map((game, index) => ({
          id: index + 1,
          title: game.gameName,
          gameCode: game.gameCode,
          providerCode: game.providerCode,
          banner: game.banner,
          playing: Math.floor(Math.random() * 2000) + 1000 // Random for now
        })))
      } else {
        // Fallback to default games if no config
        setGames([
          { id: 1, title: 'Dragon Hatch', emoji: '🐉', playing: 1538 },
          { id: 2, title: 'Gem Saviour', emoji: '⚔️', playing: 2172 },
          { id: 3, title: 'Mahjong Ways', emoji: '🀄', playing: 2046 },
          { id: 4, title: 'Leprechaun', emoji: '🍀', playing: 1333 },
          { id: 5, title: 'Dragon Tiger', emoji: '🐲', playing: 2087 },
          { id: 6, title: 'Bounty', emoji: '🏴‍☠️', playing: 2418 }
        ])
      }
    } catch (error) {
      console.error('Error loading games:', error)
      // Fallback to default games
      setGames([
        { id: 1, title: 'Dragon Hatch', emoji: '🐉', playing: 1538 },
        { id: 2, title: 'Gem Saviour', emoji: '⚔️', playing: 2172 },
        { id: 3, title: 'Mahjong Ways', emoji: '🀄', playing: 2046 },
        { id: 4, title: 'Leprechaun', emoji: '🍀', playing: 1333 },
        { id: 5, title: 'Dragon Tiger', emoji: '🐲', playing: 2087 },
        { id: 6, title: 'Bounty', emoji: '🏴‍☠️', playing: 2418 }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleGameClick = async (game) => {
    if (!isAuthenticated) {
      // Show login modal or redirect
      return
    }

    if (game.providerCode && game.gameCode) {
      try {
        const response = await api.launchGame(game.providerCode, game.gameCode, 'pt')
        if (response.success && response.data.launchUrl) {
          window.open(response.data.launchUrl, '_blank')
        }
      } catch (error) {
        console.error('Error launching game:', error)
        alert('Erro ao iniciar jogo. Tente novamente.')
      }
    }
  }

  if (loading) {
    return (
      <div className="games-section">
        <div className="loading-games">
          <i className="fa-solid fa-spinner fa-spin"></i>
          Carregando jogos...
        </div>
      </div>
    )
  }

  return (
    <div className="games-section">
      <div className="provider-banner">
        <div className="provider-left">
          <span className="title-gradient">PG SOFT</span>
        </div>
        <div className="provider-right">
          <div
            className="swiper-nav-prev pgsoft-prev me-2"
            tabIndex="0"
            role="button"
            aria-label="Previous slide"
            aria-controls="swiper-wrapper-pgsoft"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </div>
          <button className="provider-view-all" type="button" onClick={onViewAll}>
            Ver todos
          </button>
          <div
            className="swiper-nav-next pgsoft-next ms-2"
            tabIndex="0"
            role="button"
            aria-label="Next slide"
            aria-controls="swiper-wrapper-pgsoft"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </div>
        </div>
      </div>

      <div className="games-swiper">
        <div className="games-grid">
          {games.map((game) => (
            <div key={game.id} className="game-card" onClick={() => handleGameClick(game)}>
              <div className="game-link" style={{ cursor: 'pointer' }}>
                {game.banner ? (
                  <img src={game.banner} alt={game.title} className="game-thumbnail-image" />
                ) : (
                  <div className="game-thumbnail">{game.emoji || '🎮'}</div>
                )}
              </div>
              <div className="online-indicator">
                <span className="pulse" />
                <span className="online-text">
                  <strong>{game.playing}</strong> Jogando
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GamesSection

