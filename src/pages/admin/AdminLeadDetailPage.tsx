import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLeads, updateLeadStatus, assignConsultant, fetchConsultationHistory, addConsultationHistory } from '../../services/dbService';
import { LeadDocument, ConsultationHistoryItem, LeadStatus } from '../../types/lead';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { Phone, MessageSquare, ArrowLeft, UserCheck, Calendar, Clock, MapPin, Tag, Plus, Send } from 'lucide-react';

export const AdminLeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lead, setLead] = useState<LeadDocument | null>(null);
  const [history, setHistory] = useState<ConsultationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [currentStatus, setCurrentStatus] = useState<LeadStatus>('신규');
  const [currentAssignee, setCurrentAssignee] = useState('');
  const [newMemo, setNewMemo] = useState('');
  const [nextFollowup, setNextFollowup] = useState('');
  const [historyContent, setHistoryContent] = useState('');

  useEffect(() => {
    if (!sessionStorage.getItem('fc_admin_session')) {
      navigate('/admin/login');
      return;
    }

    const loadLeadData = async () => {
      setLoading(true);
      const allLeads = await fetchLeads();
      const target = allLeads.find(l => l.id === id);
      if (target) {
        setLead(target);
        setCurrentStatus(target.status);
        setCurrentAssignee(target.assigned_to || '');
        setNextFollowup(target.next_followup_at || '');

        const hList = await fetchConsultationHistory(target.id!);
        setHistory(hList);
      }
      setLoading(false);
    };

    loadLeadData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div>
        <AdminNavbar />
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div>
        <AdminNavbar />
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <h2>존재하지 않는 고객 데이터입니다.</h2>
          <button onClick={() => navigate('/admin/leads')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (newSt: LeadStatus) => {
    setCurrentStatus(newSt);
    await updateLeadStatus(lead.id!, newSt, newMemo || lead.memo, nextFollowup);
  };

  const handleAssigneeChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAssignee.trim()) {
      await assignConsultant(lead.id!, currentAssignee.trim());
      alert(`담당 영업자가 '${currentAssignee}' (으)로 변경되었습니다.`);
    }
  };

  const handleAddHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!historyContent.trim()) return;

    const currentAdminUser = sessionStorage.getItem('fc_admin_user') || '영업 담당자';
    const newItem = await addConsultationHistory({
      lead_id: lead.id!,
      author: currentAdminUser,
      content: historyContent.trim(),
      status_change_to: currentStatus,
      next_followup_at: nextFollowup || undefined
    });

    setHistory(prev => [newItem, ...prev]);
    setHistoryContent('');

    // 상태도 함께 업데이트
    await updateLeadStatus(lead.id!, currentStatus, historyContent.trim(), nextFollowup);
  };

  const cleanPhone = lead.phone.replace(/-/g, '');

  return (
    <div style={{ backgroundColor: 'var(--slate-50)', minHeight: '100vh', paddingBottom: '4rem' }}>
      <AdminNavbar />

      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate('/admin/leads')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--slate-600)', fontWeight: 600, fontSize: '0.9rem' }}
          >
            <ArrowLeft size={18} />
            <span>고객 목록으로 돌아가기</span>
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Quick Mobile Action Buttons */}
            <a
              href={`tel:${cleanPhone}`}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', minHeight: '40px' }}
            >
              <Phone size={16} />
              <span>전화 걸기</span>
            </a>

            <a
              href={`sms:${cleanPhone}`}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', minHeight: '40px' }}
            >
              <MessageSquare size={16} />
              <span>문자 보내기</span>
            </a>
          </div>
        </div>

        {/* Lead Header Summary */}
        <div className="card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>{lead.name}</h1>
                <span className={`badge badge-${lead.lead_grade.toLowerCase()}`} style={{ fontSize: '0.85rem' }}>
                  영업 {lead.lead_grade}급 ({lead.lead_score}점)
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary-700)', backgroundColor: 'var(--primary-50)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                  준비도 점수: {lead.customer_diagnosis_score}점
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--slate-600)', fontSize: '0.925rem', flexWrap: 'wrap' }}>
                <span><strong>연락처:</strong> {lead.phone}</span>
                <span><strong>지역:</strong> {lead.region_province} {lead.region_city} {lead.region_detail}</span>
                <span><strong>접수일:</strong> {lead.created_at.slice(0, 10)}</span>
              </div>
            </div>

            {/* Quick Status Control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)' }}>상태:</label>
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--primary-600)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--primary-700)',
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="신규">신규</option>
                <option value="연락시도">연락시도</option>
                <option value="연락완료">연락완료</option>
                <option value="상담예정">상담예정</option>
                <option value="상담완료">상담완료</option>
                <option value="재상담필요">재상담필요</option>
                <option value="가망고객">가망고객</option>
                <option value="계약진행">계약진행</option>
                <option value="계약완료">계약완료</option>
                <option value="보류">보류</option>
                <option value="이탈">이탈</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2 Grid Columns: Left (Details & UTM), Right (Consultation Timeline) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 1. 창업 진단 입력 내용 */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Tag size={18} style={{ color: 'var(--primary-600)' }} />
                <span>창업 진단 설문 답변</span>
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--slate-500)', display: 'block' }}>창업 목적</span>
                  <strong>{lead.startup_purpose}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--slate-500)', display: 'block' }}>예상 투자금</span>
                  <strong>{lead.budget}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--slate-500)', display: 'block' }}>창업 예정 시기</span>
                  <strong>{lead.startup_period}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--slate-500)', display: 'block' }}>희망 운영 방식</span>
                  <strong>{lead.operation_type}</strong>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: 'var(--slate-500)', display: 'block', marginBottom: '0.25rem' }}>관심 창업 유형</span>
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                    {lead.interest_types?.map((t, idx) => (
                      <span key={idx} className="badge badge-b">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 희망 상담 정보 */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={18} style={{ color: 'var(--primary-600)' }} />
                <span>상담 예약 및 배정 담당자</span>
              </h2>

              <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <span style={{ color: 'var(--slate-500)', display: 'block' }}>희망 상담일 / 시간대</span>
                  <strong style={{ fontSize: '1rem', color: 'var(--primary-700)' }}>
                    {lead.preferred_consultation_date} {lead.preferred_consultation_time_slot}
                  </strong>
                </div>

                {lead.preferred_consultation_note && (
                  <div>
                    <span style={{ color: 'var(--slate-500)', display: 'block' }}>추가 문의사항</span>
                    <p style={{ backgroundColor: 'var(--slate-100)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', marginTop: '0.25rem' }}>
                      {lead.preferred_consultation_note}
                    </p>
                  </div>
                )}

                {/* 담당 영업자 지정 */}
                <form onSubmit={handleAssigneeChange} style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--slate-200)' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.3rem' }}>
                    담당 영업자 지정
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="영업자 이름 입력 (예: 김철수 팀장)"
                      value={currentAssignee}
                      onChange={(e) => setCurrentAssignee(e.target.value)}
                      style={{ flex: 1, padding: '0.55rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
                    />
                    <button type="submit" className="btn btn-secondary" style={{ minHeight: '36px', padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                      배정 저장
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* 3. 유입 경로 & UTM 마케팅 데이터 */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1rem' }}>
                마케팅 유입 분석 (UTM)
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--slate-500)', display: 'block' }}>최근 유입 출처 (UTM Source)</span>
                  <strong>{lead.utm_source || '직접/기타'}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--slate-500)', display: 'block' }}>유입 매체 (UTM Medium)</span>
                  <strong>{lead.utm_medium || '-'}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--slate-500)', display: 'block' }}>캠페인 (UTM Campaign)</span>
                  <strong>{lead.utm_campaign || '-'}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--slate-500)', display: 'block' }}>최초 유입 출처 (First Source)</span>
                  <strong style={{ color: 'var(--primary-700)' }}>{lead.first_utm_source || '직접 방문'}</strong>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: 'var(--slate-500)', display: 'block' }}>리퍼러 (Referrer)</span>
                  <span style={{ wordBreak: 'break-all', fontSize: '0.8rem', color: 'var(--slate-600)' }}>{lead.referrer || '직접'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Consultation History Timeline & Scheduler */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={18} style={{ color: 'var(--primary-600)' }} />
                <span>상담 이력 기록 & 타임라인</span>
              </h2>

              {/* 상담 기록 작성 폼 */}
              <form onSubmit={handleAddHistory} style={{ marginBottom: '1.5rem', backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.3rem' }}>
                    신규 상담 내용 작성
                  </label>
                  <textarea
                    rows={3}
                    placeholder="예: 1차 전화 완료. 희망지역 은평구 상권 관심도 높음. 다음 2차 미팅 예정."
                    value={historyContent}
                    onChange={(e) => setHistoryContent(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block' }}>다음 연락 예정일:</label>
                    <input
                      type="date"
                      value={nextFollowup}
                      onChange={(e) => setNextFollowup(e.target.value)}
                      style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-300)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', minHeight: '38px' }}>
                    <Plus size={16} />
                    <span>상담 이력 저장</span>
                  </button>
                </div>
              </form>

              {/* History Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {history.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--slate-400)', padding: '2rem 0', fontSize: '0.9rem' }}>
                    아직 저장된 상담 이력이 없습니다. 위에서 첫 상담 내용을 기록해보세요.
                  </p>
                ) : (
                  history.map((item) => (
                    <div key={item.id} style={{ borderLeft: '3px solid var(--primary-600)', paddingLeft: '1rem', paddingBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--slate-900)' }}>{item.author}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>{item.created_at.slice(0, 16).replace('T', ' ')}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: '1.5' }}>
                        {item.content}
                      </p>
                      {item.next_followup_at && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 600, display: 'inline-block', marginTop: '0.25rem' }}>
                          📅 다음 연락 예정: {item.next_followup_at}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
