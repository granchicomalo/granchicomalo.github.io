import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SITE_CONFIG } from '../../config/siteConfig';
import { ClipboardCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <ClipboardCheck className="w-6 h-6 text-blue-600" style={{ color: '#2563eb' }} />
          <span>{SITE_CONFIG.brand.name}</span>
          <span className="logo-badge">공식센터</span>
        </Link>

        {/* 상단 버튼 영역 (1588-0000 제거 후 3분 창업진단 + 상담 바로 예약하기 나란히 배치) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={() => navigate('/diagnosis')}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem', minHeight: '40px', fontSize: '0.875rem' }}
          >
            {SITE_CONFIG.hero.mainCta}
          </button>

          <button
            onClick={() => navigate('/consultation')}
            className="btn btn-secondary"
            style={{
              padding: '0.5rem 1rem',
              minHeight: '40px',
              fontSize: '0.875rem',
              backgroundColor: 'var(--slate-800)',
              color: '#ffffff',
              borderColor: 'var(--slate-800)'
            }}
          >
            {SITE_CONFIG.hero.secondaryCta}
          </button>
        </div>
      </div>
    </header>
  );
};
