import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsers from '../pages/admin/AdminUsers'
import AdminTransactions from '../pages/admin/AdminTransactions'
import './AdminLayout.css'

function AdminLayout() {
  const { user, isAdmin, isAuthenticated, loading, logout } = useAuth()
  const [activePage, setActivePage] = useState('dashboard')

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          <i className="fa-solid fa-spinner fa-spin"></i>
          <p>Verificando permissões...</p>
        </div>
      </div>
    )
  }

  // Show message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <div className="admin-error">
          <i className="fa-solid fa-lock"></i>
          <h2>Acesso Negado</h2>
          <p>Você precisa fazer login para acessar o painel administrativo.</p>
          <button
            type="button"
            onClick={() => {
              // Redirect to main app login
              window.location.href = '/'
            }}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Ir para Login
          </button>
        </div>
      </div>
    )
  }

  // Show message if not admin
  if (!isAdmin) {
    return (
      <div className="admin-container">
        <div className="admin-error">
          <i className="fa-solid fa-lock"></i>
          <h2>Acesso Negado</h2>
          <p>Você não tem permissão para acessar o painel administrativo.</p>
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'left' }}>
            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
              <strong>Usuário logado:</strong> {user?.username || 'N/A'}
            </p>
            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
              <strong>Role atual:</strong> <span style={{ color: user?.role === 'admin' || user?.role === 'superadmin' ? '#10b981' : '#ef4444' }}>{user?.role || 'user'}</span>
            </p>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>
              <strong>Role necessário:</strong> admin ou superadmin
            </p>
          </div>
          <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.8 }}>
            Para tornar este usuário admin, execute no terminal do Colify:
          </p>
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px' }}>
            npm run create-admin {user?.username || 'username'} admin
          </div>
          <p style={{ marginTop: '15px', fontSize: '12px', opacity: 0.7 }}>
            Depois, faça logout e login novamente para atualizar o token.
          </p>
          <button
            type="button"
            onClick={() => {
              window.location.href = '/'
            }}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Voltar para o Site
          </button>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <AdminDashboard />
      case 'users':
        return <AdminUsers />
      case 'transactions':
        return <AdminTransactions />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <div className="sidebar-header">
          <h2>
            <i className="fa-solid fa-shield-halved"></i>
            Admin Panel
          </h2>
        </div>
        <ul className="sidebar-menu">
          <li>
            <button
              className={activePage === 'dashboard' ? 'active' : ''}
              onClick={() => setActivePage('dashboard')}
            >
              <i className="fa-solid fa-chart-line"></i>
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              className={activePage === 'users' ? 'active' : ''}
              onClick={() => setActivePage('users')}
            >
              <i className="fa-solid fa-users"></i>
              <span>Usuários</span>
            </button>
          </li>
          <li>
            <button
              className={activePage === 'transactions' ? 'active' : ''}
              onClick={() => setActivePage('transactions')}
            >
              <i className="fa-solid fa-exchange-alt"></i>
              <span>Transações</span>
            </button>
          </li>
        </ul>
        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">
            <i className="fa-solid fa-sign-out-alt"></i>
            <span>Sair</span>
          </button>
        </div>
      </nav>
      <main className="admin-main">
        {renderPage()}
      </main>
    </div>
  )
}

export default AdminLayout
