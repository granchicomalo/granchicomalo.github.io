import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SITE_CONFIG } from '../config/siteConfig';
import { ShieldCheck, Target, Award, Clock, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '4.5rem 0 5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '840px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.875rem',
            color: '#93c5fd',
            marginBottom: '1.5rem',
            backdropFilter: 'blur(4px)'
          }}>
            <ShieldCheck size={18} />
            <span>객관적 분석 데이터 기반 맞춤 컨설팅</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
            fontWeight: 800,
            lineHeight: '1.3',
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
            wordBreak: 'keep-all'
          }}>
            {SITE_CONFIG.hero.mainTitle}
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--slate-300)',
            marginBottom: '2.5rem',
            lineHeight: '1.6',
            wordBreak: 'keep-all'
          }}>
            {SITE_CONFIG.hero.subTitle}
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate('/diagnosis')}
              className="btn btn-primary"
              style={{
                fontSize: '1.1rem',
                padding: '1.1rem 2.25rem',
                minHeight: '56px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <span>{SITE_CONFIG.hero.mainCta}</span>
              <ArrowRight size={20} />
            </button>

            <button
              onClick={() => navigate('/consultation')}
              className="btn btn-secondary"
              style={{
                fontSize: '1rem',
                padding: '1.1rem 1.75rem',
                minHeight: '56px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.2)'
              }}
            >
              {SITE_CONFIG.hero.secondaryCta}
            </button>
          </div>
        </div>
      </section>

      {/* Core Message & Philosophy Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{
            backgroundColor: 'var(--primary-50)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem 2rem',
            border: '1px solid var(--primary-100)',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'var(--slate-900)',
              marginBottom: '1rem',
              wordBreak: 'keep-all'
            }}>
              "{SITE_CONFIG.messages.truthPromise}"
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'var(--slate-600)',
              lineHeight: '1.7',
              wordBreak: 'keep-all'
            }}>
              {SITE_CONFIG.messages.truthSub}
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              창업 진단 진행 프로세스
            </h2>
            <p style={{ color: 'var(--slate-500)' }}>복잡한 설명 없이 3분 만에 나에게 맞는 조건 점검 가능</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="card card-hover" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-600)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Target size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>STEP 1. 조건 입력</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem' }}>
                예산, 희망지역, 창업시기, 운영방식 등 6가지 필수 질문에 답변
              </p>
            </div>

            <div className="card card-hover" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-600)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>STEP 2. 맞춤 분석</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem' }}>
                입력한 조건 기준 창업 준비도 점수 및 맞춤형 분석 보고서 즉시 출력
              </p>
            </div>

            <div className="card card-hover" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-600)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Clock size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>STEP 3. 1:1 맞춤 상담</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem' }}>
                원하는 상담 날짜와 시간에 맞춰 전문 컨설턴트의 1:1 상담 예약
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button
              onClick={() => navigate('/diagnosis')}
              className="btn btn-primary"
              style={{ padding: '1rem 2.5rem', fontSize: '1.05rem' }}
            >
              지금 3분 창업 진단 시작하기
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              자주 묻는 질문 (FAQ)
            </h2>
            <p style={{ color: 'var(--slate-500)' }}>궁금하신 점을 빠르게 확인해보세요</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {SITE_CONFIG.faqs.map((faq, idx) => (
              <div key={idx} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <HelpCircle size={20} style={{ color: 'var(--primary-600)', flexShrink: 0, marginTop: '2px' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>{faq.q}</h3>
                </div>
                <p style={{ color: 'var(--slate-600)', paddingLeft: '2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
