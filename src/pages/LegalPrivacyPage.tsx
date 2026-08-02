import React from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

export const LegalPrivacyPage: React.FC = () => {
  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="card" style={{ padding: '2.5rem 2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
            개인정보 처리방침
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '2rem' }}>
            시행일자: {SITE_CONFIG.policyVersions.privacyVersion}
          </p>

          <div style={{ fontSize: '0.95rem', color: 'var(--slate-700)', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
            {SITE_CONFIG.privacyPolicyContent}
            {'\n\n'}
            {SITE_CONFIG.marketingPolicyContent}
          </div>
        </div>
      </div>
    </div>
  );
};
