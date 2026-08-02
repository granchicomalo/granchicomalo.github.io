import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '../../config/siteConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="footer" style={{ padding: '2rem 0', marginTop: '3rem' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>
              {SITE_CONFIG.brand.name}
            </span>
            <Link to="/privacy" style={{ color: '#93c5fd', textDecoration: 'underline' }}>개인정보 처리방침</Link>
            <Link to="/terms" style={{ color: 'var(--slate-400)' }}>이용약관</Link>
          </div>

          <div>
            <Link to="/admin/login" style={{ color: 'var(--slate-400)', fontSize: '0.8rem' }}>
              영업자 CRM 로그인 (관리자 전용)
            </Link>
          </div>
        </div>

        <div className="footer-bottom" style={{ marginTop: '1.25rem', paddingTop: '1rem' }}>
          <p>© {new Date().getFullYear()} {SITE_CONFIG.brand.name}. All rights reserved.</p>
          <p style={{ fontSize: '0.775rem', color: 'var(--slate-500)' }}>
            본 사이트의 진단 서비스는 과장 광고 및 확정 수익 보장 표현을 일체 사용하지 않습니다.
          </p>
        </div>
      </div>
    </footer>
  );
};
