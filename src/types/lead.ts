// 영업 관리를 위한 고객 DB 핵심 타입 정의
export type LeadStatus =
  | '신규'
  | '연락시도'
  | '연락완료'
  | '상담예정'
  | '상담완료'
  | '재상담필요'
  | '가망고객'
  | '계약진행'
  | '계약완료'
  | '보류'
  | '이탈';

export type LeadGrade = 'A' | 'B' | 'C';

export interface LeadDocument {
  id?: string;
  created_at: string; // ISO String (e.g. 2026-08-02T11:56:00.000Z)

  // 1. 기본 정보
  name: string;
  phone: string;

  // 2. 창업 진단 정보 (Diagnosis)
  startup_purpose: string; // STEP 1
  budget: string; // STEP 2
  region_province: string; // STEP 3 (시/도)
  region_city: string; // STEP 3 (시/군/구)
  region_detail: string; // STEP 3 (상세)
  startup_period: string; // STEP 4
  operation_type: string; // STEP 5
  interest_types: string[]; // STEP 6 (복수)
  customer_diagnosis_score: number; // 고객에게 보여주는 준비도 점수 (0~100)

  // 3. 상담 예약 정보 (Consultation)
  preferred_consultation_date: string; // YYYY-MM-DD
  preferred_consultation_time_slot: string; // 오전, 오후, 저녁, 기타
  preferred_consultation_note?: string; // 추가 문의사항

  // 4. 개인정보 및 마케팅 동의 (Consent)
  privacy_consent: boolean; // 필수 동의 여부 (true)
  privacy_consent_at: string; // 동의 시각 ISO
  privacy_policy_version: string; // 예: "v1.0"
  marketing_consent: boolean; // 선택 동의 여부
  marketing_consent_at?: string; // 동의 시각 ISO
  marketing_policy_version?: string; // 예: "v1.0"

  // 5. 영업 및 CRM 관리 (Sales Management)
  lead_score: number; // Internal Lead Score (영업용 점수)
  lead_grade: LeadGrade; // Hot(A), Warm(B), Cold(C)
  status: LeadStatus;
  assigned_to?: string; // 담당 영업자 ID 또는 이름
  assigned_at?: string; // 담당자 지정 시각
  memo?: string; // 대표 메모
  last_contacted_at?: string; // 최근 연락 시각
  next_followup_at?: string; // 다음 연락 예정일 (YYYY-MM-DD)

  // 6. 마케팅 유입 추적 (Marketing Tracking)
  // 최근 유입 (Current Session UTM)
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  landing_page: string;
  referrer: string;

  // 최초 유입 (First Session Tracking)
  first_utm_source?: string;
  first_utm_medium?: string;
  first_utm_campaign?: string;
  first_landing_page: string;
  first_referrer: string;
}

export interface ConsultationHistoryItem {
  id: string;
  lead_id: string;
  created_at: string;
  author: string; // 상담 기록자 (영업자)
  content: string; // 상담 기록 내용
  status_change_to?: LeadStatus; // 변경된 상태
  next_followup_at?: string; // 설정된 다음 연락 예정일
}
