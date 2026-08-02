import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DiagnosisFormData } from '../types/diagnosis';
import { calculateCustomerDiagnosisScore, generateAnalysisSummary } from '../services/scoringService';
import { SITE_CONFIG } from '../config/siteConfig';
import { Award, CheckCircle2, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

export const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // state로 넘어온 formData 없으면 샘플 기본값 사용
  const formData: DiagnosisFormData = location.state?.formData || {
    startup_purpose: '본업을 유지하면서 부업을 하고 싶어요',
    budget: '5,000~7,000만원',
    region_province: '서울',
    region_city: '은평구',
    region_detail: '응암동',
    startup_period: '1개월 이내',
    operation_type: '무인 운영',
    interest_types: ['소자본창업', '무인창업']
  };

  const customerDiagnosisScore = calculateCustomerDiagnosisScore(formData);
  const analysisSummary = generateAnalysisSummary(formData);

  const regionStr = `${formData.region_province || ''} ${formData.region_city || ''} ${formData.region_detail || ''}`.trim() || '미정';

  return (
    <div style={{ padding: '2.5rem 0 5rem', minHeight: 'calc(100vh - 180px)' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        {/* Readiness Score Card */}
        <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--primary-700)',
            backgroundColor: 'var(--primary-50)',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.875rem',
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            <Award size={18} />
            <span>창업 준비도 체크 결과</span>
          </div>

          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.5rem' }}>
            당신의 창업 준비도 점수
          </h1>

          {/* Big Score Gauge */}
          <div style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'conic-gradient(var(--primary-600) 0% 78%, var(--slate-200) 78% 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            position: 'relative',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{
              width: '116px',
              height: '116px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary-600)', lineHeight: '1' }}>
                {customerDiagnosisScore}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>점 / 100점</span>
            </div>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'var(--grade-a-bg)',
            color: 'var(--grade-a-text)',
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.95rem'
          }}>
            <CheckCircle2 size={18} />
            <span>현재 조건에서 창업 검토를 시작하기 좋은 단계입니다.</span>
          </div>
        </div>

        {/* Condition Visual Summary Badges */}
        <div className="card animate-fade-in" style={{ padding: '1.75rem 1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
            진단 조건 시각적 요약
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
            <div style={{ backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'block', marginBottom: '0.25rem' }}>투자 가능 수준</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--slate-900)' }}>{formData.budget}</strong>
            </div>

            <div style={{ backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'block', marginBottom: '0.25rem' }}>창업 예정 시기</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--slate-900)' }}>{formData.startup_period}</strong>
            </div>

            <div style={{ backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'block', marginBottom: '0.25rem' }}>희망 운영 방식</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--slate-900)' }}>{formData.operation_type}</strong>
            </div>

            <div style={{ backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'block', marginBottom: '0.25rem' }}>희망 지역</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--slate-900)' }}>{regionStr}</strong>
            </div>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--slate-200)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', display: 'block', marginBottom: '0.4rem' }}>관심 창업 유형</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {formData.interest_types.map((type, idx) => (
                <span key={idx} className="badge badge-b">{type}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Analysis Summary Sentence Card */}
        <div className="card animate-fade-in" style={{ padding: '1.75rem 1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--primary-600)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
            맞춤형 분석 요약
          </h3>
          <p style={{ fontSize: '0.975rem', color: 'var(--slate-700)', lineHeight: '1.7', wordBreak: 'keep-all' }}>
            {analysisSummary}
          </p>
        </div>

        {/* Objectivity Disclaimer */}
        <div style={{
          backgroundColor: 'var(--slate-100)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}>
          <AlertCircle size={20} style={{ color: 'var(--slate-500)', flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.6', wordBreak: 'keep-all' }}>
            {SITE_CONFIG.messages.disclaimer}
          </p>
        </div>

        {/* Consultation Transition Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/consultation', { state: { formData, customerDiagnosisScore } })}
            className="btn btn-primary btn-full"
            style={{ padding: '1.1rem', fontSize: '1.05rem' }}
          >
            <span>내 조건에 맞는 창업 1:1 무료 상담받기</span>
            <ArrowRight size={20} />
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => navigate('/diagnosis')}
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '0.9rem' }}
            >
              <RefreshCw size={16} />
              <span>진단 다시 하기</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '0.9rem' }}
            >
              <span>홈으로 돌아가기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
