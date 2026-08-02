import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLeads } from '../../services/dbService';
import { LeadDocument } from '../../types/lead';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { Users, PhoneCall, Award, TrendingUp, Calendar, ChevronRight } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<LeadDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 세션 체크
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
          <p>데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  // 날짜 계산 함수
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const todayCount = leads.filter(l => l.created_at.startsWith(todayStr)).length;
  const todayConsultations = leads.filter(l => l.preferred_consultation_date === todayStr).length;

  const countA = leads.filter(l => l.lead_grade === 'A').length;
  const countB = leads.filter(l => l.lead_grade === 'B').length;
  const countC = leads.filter(l => l.lead_grade === 'C').length;

  // 상태 분포
  const statusCounts = {
    '신규': leads.filter(l => l.status === '신규').length,
    '연락완료': leads.filter(l => l.status === '연락완료').length,
    '상담예정': leads.filter(l => l.status === '상담예정').length,
    '상담완료': leads.filter(l => l.status === '상담완료').length,
    '가망고객': leads.filter(l => l.status === '가망고객').length,
    '계약완료': leads.filter(l => l.status === '계약완료').length,
  };

  return (
    <div style={{ backgroundColor: 'var(--slate-50)', minHeight: '100vh', paddingBottom: '4rem' }}>
      <AdminNavbar />

      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              영업 현황 종합 대시보드
            </h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
              오늘의 신규 잠재 고객 DB 및 상담 예약 진행 상황
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/leads')}
            className="btn btn-primary"
            style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem', minHeight: '40px' }}
          >
            전체 고객 DB 관리
          </button>
        </div>

        {/* Major Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {/* Card 1 */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-500)' }}>오늘의 상담 예약</span>
              <div style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                <Calendar size={20} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--slate-900)' }}>
              {todayConsultations} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--slate-500)' }}>건</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-500)' }}>오늘 신규 DB</span>
              <div style={{ backgroundColor: '#ecfdf5', color: '#10b981', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                <Users size={20} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--slate-900)' }}>
              {todayCount} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--slate-500)' }}>건</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-500)' }}>총 축적 DB</span>
              <div style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                <TrendingUp size={20} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--slate-900)' }}>
              {leads.length} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--slate-500)' }}>명</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-500)' }}>A급 Hot Lead 비율</span>
              <div style={{ backgroundColor: 'var(--grade-a-bg)', color: 'var(--grade-a-text)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                <Award size={20} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--slate-900)' }}>
              {countA} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--slate-500)' }}>명 ({leads.length ? Math.round((countA / leads.length) * 100) : 0}%)</span>
            </div>
          </div>
        </div>

        {/* Second Row: Grade Breakdown & Status Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Lead Grade Distribution */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--slate-900)' }}>
              리드 등급 분포 (Internal Score)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'var(--grade-a-bg)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontWeight: 700, color: 'var(--grade-a-text)' }}>A급 (Hot Lead ≥70점)</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--grade-a-text)' }}>{countA} 명</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'var(--grade-b-bg)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontWeight: 700, color: 'var(--grade-b-text)' }}>B급 (Warm Lead 40~69점)</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--grade-b-text)' }}>{countB} 명</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'var(--grade-c-bg)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontWeight: 700, color: 'var(--grade-c-text)' }}>C급 (Cold Lead &lt;40점)</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--grade-c-text)' }}>{countC} 명</strong>
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--slate-900)' }}>
              상담 진행 단계 현황
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
              {Object.entries(statusCounts).map(([st, cnt]) => (
                <div key={st} style={{ border: '1px solid var(--slate-200)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', display: 'block', marginBottom: '0.25rem' }}>{st}</span>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--slate-900)' }}>{cnt}건</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Lead List Summary Table */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              최근 신규 접수 리드 목록
            </h2>
            <button
              onClick={() => navigate('/admin/leads')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600 }}
            >
              <span>전체보기</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--slate-200)', color: 'var(--slate-500)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>이름</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>지역</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>창업시기</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>예산</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>등급</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>상태</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>담당자</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>접수일시</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 5).map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => navigate(`/admin/leads/${l.id}`)}
                    style={{ borderBottom: '1px solid var(--slate-100)', cursor: 'pointer' }}
                    className="card-hover"
                  >
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700 }}>{l.name}</td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>{l.region_province} {l.region_city}</td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>{l.startup_period}</td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>{l.budget}</td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span className={`badge badge-${l.lead_grade.toLowerCase()}`}>{l.lead_grade}급 ({l.lead_score}점)</span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        backgroundColor: l.status === '신규' ? '#dbeafe' : 'var(--slate-100)',
                        color: l.status === '신규' ? 'var(--primary-700)' : 'var(--slate-700)'
                      }}>
                        {l.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>{l.assigned_to || '미배정'}</td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'var(--slate-500)', fontSize: '0.825rem' }}>
                      {l.created_at.slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
