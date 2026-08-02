import React from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

export const LegalTermsPage: React.FC = () => {
  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="card" style={{ padding: '2.5rem 2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
            서비스 이용약관
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '2rem' }}>
            시행일자: {SITE_CONFIG.policyVersions.termsVersion}
          </p>

          <div style={{ fontSize: '0.95rem', color: 'var(--slate-700)', lineHeight: '1.8' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.5rem' }}>제1조 (목적)</h2>
            <p>본 약관은 {SITE_CONFIG.brand.companyName}(이하 "회사")이 제공하는 {SITE_CONFIG.brand.name} 서비스의 이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>

            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.5rem' }}>제2조 (서비스의 내용)</h2>
            <p>회사는 잠재 창업 이용자에게 맞춤형 창업 조건 진단 서비스 및 1:1 창업 상담 연결 서비스를 무료로 제공합니다. 본 서비스는 수익이나 성공을 확정 보장하지 않으며 진단 결과는 참고용 정보입니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
