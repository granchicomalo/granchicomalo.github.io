import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { DiagnosisPage } from './pages/DiagnosisPage';
import { ResultPage } from './pages/ResultPage';
import { ConsultationPage } from './pages/ConsultationPage';
import { LegalPrivacyPage } from './pages/LegalPrivacyPage';
import { LegalTermsPage } from './pages/LegalTermsPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage';
import { AdminLeadDetailPage } from './pages/admin/AdminLeadDetailPage';
import { AdminFunnelPage } from './pages/admin/AdminFunnelPage';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdmin && <Header />}
      <main style={{ flex: 1 }}>{children}</main>
      {!isAdmin && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          {/* 퍼블릭 창업 진단 & 리드 생성 퍼널 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/diagnosis" element={<DiagnosisPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/consultation" element={<ConsultationPage />} />

          {/* Legal Pages */}
          <Route path="/privacy" element={<LegalPrivacyPage />} />
          <Route path="/terms" element={<LegalTermsPage />} />

          {/* 영업자 전용 CRM 관리자 */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/leads" element={<AdminLeadsPage />} />
          <Route path="/admin/leads/:id" element={<AdminLeadDetailPage />} />
          <Route path="/admin/funnel" element={<AdminFunnelPage />} />

          {/* Fallback Route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
};

export default App;
