import React, { useEffect } from 'react'
import './Notification.css'

function Notification({ message, type = 'success', isOpen, onClose, duration = 3000 }) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  if (!isOpen) return null

  return (
    <div className={`notification notification-${type} ${isOpen ? 'notification-show' : ''}`}>
      <div className="notification-content">
        <i className={`fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info'}`}></i>
        <span>{message}</span>
      </div>
    </div>
  )
}

export default Notification
