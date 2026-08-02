import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLeads } from '../../services/dbService';
import { LeadDocument, LeadGrade, LeadStatus } from '../../types/lead';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export const AdminLeadsPage: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<LeadDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // 검색/필터/정렬 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'score' | 'consultation'>('latest');

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

  // 검색 및 필터링 적용
  const filteredLeads = leads.filter(lead => {
    // 1. 검색어 (이름, 전화번호, 지역)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = lead.name.toLowerCase().includes(q);
      const matchPhone = lead.phone.includes(q);
      const matchRegion = `${lead.region_province} ${lead.region_city} ${lead.region_detail}`.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchRegion) return false;
    }

    // 2. 리드 등급 필터
    if (selectedGrade !== 'all' && lead.lead_grade !== selectedGrade) {
      return false;
    }

    // 3. 상태 필터
    if (selectedStatus !== 'all' && lead.status !== selectedStatus) {
      return false;
    }

    // 4. 창업시기 필터
    if (selectedPeriod !== 'all' && lead.startup_period !== selectedPeriod) {
      return false;
    }

    return true;
  });

  // 정렬 적용
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === 'score') {
      return b.lead_score - a.lead_score;
    }
    if (sortBy === 'consultation') {
      return (a.preferred_consultation_date || '').localeCompare(b.preferred_consultation_date || '');
    }
    // 기본: 최신등록순
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div style={{ backgroundColor: 'var(--slate-50)', minHeight: '100vh', paddingBottom: '4rem' }}>
      <AdminNavbar />

      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            고객 DB 통합 관리
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            수집된 잠재 창업 리드의 상태 및 담당자 지정 관리
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
            {/* 검색어 */}
            <div style={{ position: 'relative', gridColumn: 'span 2' }}>
              <input
                type="text"
                placeholder="이름, 전화번호, 지역 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--slate-300)',
                  fontSize: '0.9rem'
                }}
              />
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            </div>

            {/* 리드 등급 필터 */}
            <div>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
              >
                <option value="all">리드 등급 (전체)</option>
                <option value="A">A급 (Hot Lead)</option>
                <option value="B">B급 (Warm Lead)</option>
                <option value="C">C급 (Cold Lead)</option>
              </select>
            </div>

            {/* 상태 필터 */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
              >
                <option value="all">상담 상태 (전체)</option>
                <option value="신규">신규</option>
                <option value="연락시도">연락시도</option>
                <option value="연락완료">연락완료</option>
                <option value="상담예정">상담예정</option>
                <option value="상담완료">상담완료</option>
                <option value="가망고객">가망고객</option>
                <option value="계약진행">계약진행</option>
                <option value="계약완료">계약완료</option>
              </select>
            </div>

            {/* 정렬 */}
            <div>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
              >
                <option value="latest">최신 등록순</option>
                <option value="score">리드 점수 높은순</option>
                <option value="consultation">상담 희망일 순</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lead Table */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--slate-600)', fontWeight: 600 }}>
              총 <strong style={{ color: 'var(--primary-600)' }}>{sortedLeads.length}</strong> 건 검색됨
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--slate-100)', color: 'var(--slate-600)', borderBottom: '1px solid var(--slate-200)' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>이름</th>
                  <th style={{ padding: '0.85rem 1rem' }}>지역</th>
                  <th style={{ padding: '0.85rem 1rem' }}>관심 업종</th>
                  <th style={{ padding: '0.85rem 1rem' }}>예산</th>
                  <th style={{ padding: '0.85rem 1rem' }}>창업 시기</th>
                  <th style={{ padding: '0.85rem 1rem' }}>리드 등급</th>
                  <th style={{ padding: '0.85rem 1rem' }}>상태</th>
                  <th style={{ padding: '0.85rem 1rem' }}>담당자</th>
                  <th style={{ padding: '0.85rem 1rem' }}>등록일</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>로딩 중...</td>
                  </tr>
                ) : sortedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>조건에 일치하는 고객 DB가 없습니다.</td>
                  </tr>
                ) : (
                  sortedLeads.map((l) => (
                    <tr
                      key={l.id}
                      onClick={() => navigate(`/admin/leads/${l.id}`)}
                      style={{ borderBottom: '1px solid var(--slate-100)', cursor: 'pointer' }}
                      className="card-hover"
                    >
                      <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--slate-900)' }}>{l.name}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>{l.region_province} {l.region_city}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        {l.interest_types?.slice(0, 2).join(', ')}
                      </td>
                      <td style={{ padding: '0.9rem 1rem' }}>{l.budget}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>{l.startup_period}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span className={`badge badge-${l.lead_grade.toLowerCase()}`}>
                          {l.lead_grade}급 ({l.lead_score}점)
                        </span>
                      </td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          backgroundColor: l.status === '신규' ? '#dbeafe' : 'var(--slate-100)',
                          color: l.status === '신규' ? 'var(--primary-700)' : 'var(--slate-700)'
                        }}>
                          {l.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.9rem 1rem', color: 'var(--slate-700)', fontWeight: l.assigned_to ? 600 : 400 }}>
                        {l.assigned_to || '미배정'}
                      </td>
                      <td style={{ padding: '0.9rem 1rem', color: 'var(--slate-500)', fontSize: '0.85rem' }}>
                        {l.created_at.slice(0, 10)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
