import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { DiagnosisFormData } from '../types/diagnosis';
import { calculateCustomerDiagnosisScore, calculateInternalLeadScore } from '../services/scoringService';
import { initializeUtmTracking } from '../utils/utmTracker';
import { saveLead } from '../services/dbService';
import { SITE_CONFIG } from '../config/siteConfig';
import { ShieldCheck, Calendar, Clock, User, Phone, MapPin, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export const ConsultationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 이전 진단 데이터 받기
  const formData: DiagnosisFormData = location.state?.formData || {
    startup_purpose: '신규 사업 시작',
    budget: '5,000~7,000만원',
    region_province: '서울',
    region_city: '은평구',
    region_detail: '',
    startup_period: '1개월 이내',
    operation_type: '1인 운영',
    interest_types: ['소자본창업']
  };

  const customerScore = location.state?.customerDiagnosisScore || calculateCustomerDiagnosisScore(formData);

  // 폼 입력 상태
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('오후 (14:00~17:00)');
  const [note, setNote] = useState('');

  // 동의 상태 (필수 & 선택 분리)
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  // UI 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 전화번호 하이픈 자동 포맷터
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    let formatted = raw;
    if (raw.length > 3 && raw.length <= 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else if (raw.length > 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    }
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage('이름을 입력해주세요.');
      return;
    }

    const cleanPhone = phone.replace(/-/g, '');
    if (cleanPhone.length < 10 || !cleanPhone.startsWith('010')) {
      setErrorMessage('올바른 휴대폰 번호(010-XXXX-XXXX)를 입력해주세요.');
      return;
    }

    if (!privacyConsent) {
      setErrorMessage('개인정보 수집 및 이용 동의(필수)에 체크해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 1. UTM 및 유입 정보 추적
      const utmData = initializeUtmTracking();

      // 2. 영업용 Internal Lead Score & A/B/C Grade 계산
      const { leadScore, leadGrade } = calculateInternalLeadScore(formData, preferredTimeSlot);

      // 3. Lead Document 구성
      const nowIso = new Date().toISOString();
      const newLead = {
        created_at: nowIso,
        name: name.trim(),
        phone: phone.trim(),

        startup_purpose: formData.startup_purpose,
        budget: formData.budget,
        region_province: formData.region_province,
        region_city: formData.region_city,
        region_detail: formData.region_detail,
        startup_period: formData.startup_period,
        operation_type: formData.operation_type,
        interest_types: formData.interest_types,
        customer_diagnosis_score: customerScore,

        preferred_consultation_date: preferredDate,
        preferred_consultation_time_slot: preferredTimeSlot,
        preferred_consultation_note: note.trim() || undefined,

        privacy_consent: true,
        privacy_consent_at: nowIso,
        privacy_policy_version: SITE_CONFIG.policyVersions.privacyVersion,

        marketing_consent: marketingConsent,
        marketing_consent_at: marketingConsent ? nowIso : undefined,
        marketing_policy_version: marketingConsent ? SITE_CONFIG.policyVersions.marketingVersion : undefined,

        lead_score: leadScore,
        lead_grade: leadGrade,
        status: '신규' as const,

        ...utmData
      };

      // 4. DB 저장 실행
      const result = await saveLead(newLead);
      if (result.success) {
        setIsSuccess(true);
      }
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrorMessage(err.message || '상담 예약 제출 중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div style={{ padding: '4rem 0 6rem', minHeight: 'calc(100vh - 180px)' }}>
        <div className="container" style={{ maxWidth: '580px', textAlign: 'center' }}>
          <div className="card animate-fade-in" style={{ padding: '3rem 2rem' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--grade-a-bg)',
              color: 'var(--grade-a-text)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <CheckCircle size={40} />
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
              상담 예약이 성공적으로 접수되었습니다!
            </h1>

            <p style={{ color: 'var(--slate-600)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem', wordBreak: 'keep-all' }}>
              입력하신 <strong>{name}</strong>님({phone})의 진단 조건에 맞추어 전문 영업 컨설턴트가 지정하신 희망시간(<strong>{preferredDate} {preferredTimeSlot}</strong>)에 맞춰 연락을 드리겠습니다.
            </p>

            <button
              onClick={() => navigate('/')}
              className="btn btn-primary btn-full"
            >
              메인 화면으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', minHeight: 'calc(100vh - 180px)' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--slate-600)', fontWeight: 600, fontSize: '0.9rem' }}
          >
            <ArrowLeft size={18} />
            <span>이전 페이지</span>
          </button>
        </div>

        <div className="card animate-fade-in" style={{ padding: '2.25rem 1.75rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--primary-600)',
              backgroundColor: 'var(--primary-50)',
              padding: '0.3rem 0.8rem',
              borderRadius: 'var(--radius-full)'
            }}>
              1:1 맞춤 컨설팅 신청
            </span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.5rem' }}>
              무료 창업 상담 예약하기
            </h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.925rem', marginTop: '0.25rem' }}>
              희망하시는 시간에 맞춰 전문 영업 담당자가 1:1 안내를 제공합니다.
            </p>
          </div>

          {errorMessage && (
            <div style={{
              backgroundColor: '#fff1f2',
              color: '#e11d48',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* 1. 성함 */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.4rem' }}>
                성함 <span style={{ color: 'red' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 2.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '1rem'
                  }}
                />
                <User size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              </div>
            </div>

            {/* 2. 휴대폰 번호 */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.4rem' }}>
                휴대폰 번호 <span style={{ color: 'red' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  maxLength={13}
                  value={phone}
                  onChange={handlePhoneChange}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 2.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '1rem'
                  }}
                />
                <Phone size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              </div>
            </div>

            {/* 3. 희망지역 */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.4rem' }}>
                희망 창업지역
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  readOnly
                  value={`${formData.region_province} ${formData.region_city} ${formData.region_detail}`.trim()}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 2.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-200)',
                    backgroundColor: 'var(--slate-100)',
                    color: 'var(--slate-700)',
                    fontSize: '0.95rem'
                  }}
                />
                <MapPin size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              </div>
            </div>

            {/* 4. 상담 희망일 & 시간대 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.4rem' }}>
                  상담 희망일
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.4rem' }}>
                  상담 희망시간대
                </label>
                <select
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-300)',
                    backgroundColor: '#ffffff',
                    fontSize: '0.95rem'
                  }}
                >
                  <option value="오전 (10:00~12:00)">오전 (10:00~12:00)</option>
                  <option value="오후 (14:00~17:00)">오후 (14:00~17:00)</option>
                  <option value="저녁 (17:00~19:00)">저녁 (17:00~19:00)</option>
                  <option value="기타/상시">기타 (상시 가능)</option>
                </select>
              </div>
            </div>

            {/* 5. 추가 문의사항 */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.4rem' }}>
                추가 문의사항 (선택)
              </label>
              <textarea
                placeholder="궁금한 사항이나 특이조건이 있다면 적어주세요."
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--slate-300)',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* 6. 개인정보 동의 섹션 (필수 & 선택 분리) */}
            <div style={{
              backgroundColor: 'var(--slate-50)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              border: '1px solid var(--slate-200)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.875rem'
            }}>
              {/* 필수 동의 */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  style={{ width: '18px', height: '18px', marginTop: '2px' }}
                />
                <span style={{ fontSize: '0.875rem', color: 'var(--slate-800)', lineHeight: '1.5' }}>
                  <strong>[필수]</strong> 개인정보 수집 및 이용 동의 ({SITE_CONFIG.policyVersions.privacyVersion}){' '}
                  <Link to="/privacy" target="_blank" style={{ color: 'var(--primary-600)', textDecoration: 'underline' }}>[약관 보기]</Link>
                </span>
              </label>

              {/* 선택 동의 */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  style={{ width: '18px', height: '18px', marginTop: '2px' }}
                />
                <span style={{ fontSize: '0.875rem', color: 'var(--slate-700)', lineHeight: '1.5' }}>
                  <strong>[선택]</strong> 마케팅 활용 및 이벤트 안내 수신 동의 ({SITE_CONFIG.policyVersions.marketingVersion})
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-full"
              style={{ padding: '1.1rem', fontSize: '1.05rem', marginTop: '0.5rem' }}
            >
              {isSubmitting ? '예약 제출 중...' : '상담 예약 제출하기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
