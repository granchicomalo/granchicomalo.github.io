import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLeads } from '../../services/dbService';
import { LeadDocument } from '../../types/lead';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { BarChart3, Filter, ArrowDown } from 'lucide-react';

export const AdminFunnelPage: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<LeadDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionStorage.getItem('fc_admin_session')) {
      navigate('/admin/login');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      const data = await fetchLeads();
      setLeads(data);
      setLoading(false);
    };
    loadData();
  }, [navigate]);

  if (loading) {
    return (
      <div>
        <AdminNavbar />
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p>데이터 분석 중...</p>
        </div>
      </div>
    );
  }

  // 1. 마케팅 유입 채널별 DB 집계 (utm_source / first_utm_source)
  const channelCounts: Record<string, number> = {};
  leads.forEach(l => {
    const channel = l.first_utm_source || l.utm_source || '직접/기타';
    channelCounts[channel] = (channelCounts[channel] || 0) + 1;
  });

  // 2. 퍼널 전환율 단계 모델 (샘플 방문 추정치 + 실 데이터 결합)
  const completedConsultations = leads.length;
  const visitedConsultationPage = Math.round(completedConsultations * 2.1);
  const completedDiagnosis = Math.round(visitedConsultationPage * 1.6);
  const startedDiagnosis = Math.round(completedDiagnosis * 1.4);
  const totalVisitors = Math.round(startedDiagnosis * 2.2);

  const funnelSteps = [
    { step: '1. 전체 방문자', count: totalVisitors, rate: '100%' },
    { step: '2. 진단 시작', count: startedDiagnosis, rate: `${Math.round((startedDiagnosis / totalVisitors) * 100)}%` },
    { step: '3. 진단 완료', count: completedDiagnosis, rate: `${Math.round((completedDiagnosis / startedDiagnosis) * 100)}%` },
    { step: '4. 상담예약 폼 방문', count: visitedConsultationPage, rate: `${Math.round((visitedConsultationPage / completedDiagnosis) * 100)}%` },
    { step: '5. 상담예약 완료 (DB 생성)', count: completedConsultations, rate: `${Math.round((completedConsultations / visitedConsultationPage) * 100)}%` },
  ];

  return (
    <div style={{ backgroundColor: 'var(--slate-50)', minHeight: '100vh', paddingBottom: '4rem' }}>
      <AdminNavbar />

      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            마케팅 채널 & 퍼널 전환 분석
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            어떤 마케팅 채널에서 창업 상담 DB가 가장 많이 발생하는지 분석합니다.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* 퍼널 전환 단계 */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BarChart3 size={18} style={{ color: 'var(--primary-600)' }} />
              <span>웹서비스 리드 퍼널 전환율</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {funnelSteps.map((s, idx) => (
                <React.Fragment key={idx}>
                  <div style={{
                    backgroundColor: 'var(--slate-100)',
                    padding: '0.9rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderLeft: idx === 4 ? '4px solid var(--accent-emerald)' : '4px solid var(--primary-600)'
                  }}>
                    <span style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--slate-800)' }}>{s.step}</span>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--slate-900)' }}>{s.count.toLocaleString()} 명</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 600, display: 'block' }}>
                        전환율 {s.rate}
                      </span>
                    </div>
                  </div>
                  {idx < funnelSteps.length - 1 && (
                    <div style={{ textAlign: 'center', color: 'var(--slate-400)', margin: '-0.35rem 0' }}>
                      <ArrowDown size={16} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 유입 채널별 DB 분포 */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
              마케팅 유입 채널별 DB 발생 현황
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {Object.entries(channelCounts).map(([ch, cnt]) => {
                const percent = leads.length ? Math.round((cnt / leads.length) * 100) : 0;
                return (
                  <div key={ch} style={{ border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--slate-900)' }}>{ch}</strong>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                        {cnt}건 ({percent}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--slate-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', backgroundColor: 'var(--primary-600)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
