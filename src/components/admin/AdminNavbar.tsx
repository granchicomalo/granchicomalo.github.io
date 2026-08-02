import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, LogOut, ShieldCheck } from 'lucide-react';

export const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = sessionStorage.getItem('fc_admin_user') || '관리자';

  const handleLogout = () => {
    sessionStorage.removeItem('fc_admin_session');
    sessionStorage.removeItem('fc_admin_user');
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={{ backgroundColor: 'var(--slate-900)', color: '#ffffff', borderBottom: '1px solid var(--slate-800)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem' }}>
            <ShieldCheck style={{ color: 'var(--primary-500)' }} />
            <span>영업자 CRM</span>
          </Link>

          <nav style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              to="/admin/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                fontWeight: 600,
                backgroundColor: isActive('/admin/dashboard') ? 'var(--slate-800)' : 'transparent',
                color: isActive('/admin/dashboard') ? '#ffffff' : 'var(--slate-400)'
              }}
            >
              <LayoutDashboard size={16} />
              <span>대시보드</span>
            </Link>

            <Link
              to="/admin/leads"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                fontWeight: 600,
                backgroundColor: isActive('/admin/leads') || location.pathname.startsWith('/admin/leads/') ? 'var(--slate-800)' : 'transparent',
                color: isActive('/admin/leads') || location.pathname.startsWith('/admin/leads/') ? '#ffffff' : 'var(--slate-400)'
              }}
            >
              <Users size={16} />
              <span>고객 DB 관리</span>
            </Link>

            <Link
              to="/admin/funnel"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                fontWeight: 600,
                backgroundColor: isActive('/admin/funnel') ? 'var(--slate-800)' : 'transparent',
                color: isActive('/admin/funnel') ? '#ffffff' : 'var(--slate-400)'
              }}
            >
              <BarChart3 size={16} />
              <span>유입 & 퍼널 분석</span>
            </Link>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-400)' }}>
            <strong style={{ color: '#ffffff' }}>{currentUser}</strong> 님
          </span>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.85rem',
              color: 'var(--slate-400)',
              backgroundColor: 'var(--slate-800)',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <LogOut size={14} />
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </div>
  );
};
