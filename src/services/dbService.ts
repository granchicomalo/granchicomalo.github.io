import { db, isFirebaseConfigured } from './firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy, getDoc } from 'firebase/firestore';
import { LeadDocument, ConsultationHistoryItem, LeadStatus } from '../types/lead';

const LOCAL_STORAGE_LEADS_KEY = 'fc_leads_db_mock';
const LOCAL_STORAGE_HISTORY_KEY = 'fc_history_db_mock';

// 샘플 Mock 데이터 초기화 (개발/데모 테스트용)
function initializeMockLeadsIfNeeded(): LeadDocument[] {
  try {
    const existing = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    if (existing) {
      return JSON.parse(existing);
    }

    const defaultMocks: LeadDocument[] = [
      {
        id: 'mock-lead-1',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        name: '김철수',
        phone: '010-1234-5678',
        startup_purpose: '본업을 유지하면서 부업을 하고 싶어요',
        budget: '5,000~7,000만원',
        region_province: '서울',
        region_city: '은평구',
        region_detail: '응암동 인근',
        startup_period: '1개월 이내',
        operation_type: '무인 운영',
        interest_types: ['소자본창업', '무인창업'],
        customer_diagnosis_score: 82,
        preferred_consultation_date: '2026-08-05',
        preferred_consultation_time_slot: '오후 (14:00~17:00)',
        preferred_consultation_note: '무인 매장 초기 세팅 비용 및 수수료 문의드립니다.',
        privacy_consent: true,
        privacy_consent_at: new Date().toISOString(),
        privacy_policy_version: 'v1.0',
        marketing_consent: true,
        marketing_consent_at: new Date().toISOString(),
        marketing_policy_version: 'v1.0',
        lead_score: 85,
        lead_grade: 'A',
        status: '신규',
        assigned_to: '이영업 대리',
        assigned_at: new Date().toISOString(),
        landing_page: '/diagnosis',
        referrer: 'https://search.naver.com',
        utm_source: 'naver',
        utm_medium: 'cpc',
        utm_campaign: 'brand_search',
        first_landing_page: '/',
        first_referrer: 'https://search.naver.com',
        first_utm_source: 'naver',
        first_utm_medium: 'cpc'
      },
      {
        id: 'mock-lead-2',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        name: '이영희',
        phone: '010-9876-5432',
        startup_purpose: '은퇴 후 창업을 준비하고 있어요',
        budget: '3,000~5,000만원',
        region_province: '경기',
        region_city: '고양시',
        region_detail: '일산동구',
        startup_period: '3개월 이내',
        operation_type: '직접 운영',
        interest_types: ['프랜차이즈'],
        customer_diagnosis_score: 75,
        preferred_consultation_date: '2026-08-04',
        preferred_consultation_time_slot: '오전 (10:00~12:00)',
        privacy_consent: true,
        privacy_consent_at: new Date().toISOString(),
        privacy_policy_version: 'v1.0',
        marketing_consent: false,
        lead_score: 55,
        lead_grade: 'B',
        status: '연락완료',
        assigned_to: '김상담 팀장',
        landing_page: '/diagnosis',
        referrer: 'https://www.google.com',
        utm_source: 'google',
        first_landing_page: '/',
        first_referrer: 'https://www.google.com',
        first_utm_source: 'google'
      }
    ];

    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(defaultMocks));
    return defaultMocks;
  } catch (e) {
    return [];
  }
}

// 1. 신규 리드 (고객 상담 DB) 저장
export async function saveLead(leadData: Omit<LeadDocument, 'id'>): Promise<{ success: boolean; id: string; isFallback?: boolean }> {
  // 실제 Firebase가 연동되어 있는 경우 Firestore 저장
  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'leads'), leadData);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Firestore save failed:', error);
      // 운영 환경(Production)인 경우 절대 성공 처리하지 않음!
      if (import.meta.env.PROD) {
        throw new Error('데이터베이스 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  }

  // 데모/개발 환경 전용 LocalStorage Fallback
  if (import.meta.env.DEV || !isFirebaseConfigured) {
    console.warn('Using LocalStorage Fallback Provider (Development / Demo mode only)');
    const leads = initializeMockLeadsIfNeeded();
    const newId = 'lead_' + Date.now();
    const newLead: LeadDocument = { ...leadData, id: newId };
    leads.unshift(newLead);
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(leads));
    return { success: true, id: newId, isFallback: true };
  }

  throw new Error('데이터베이스가 연결되지 않았습니다.');
}

// 2. 전체 리드 목록 조회 (CRM 전용)
export async function fetchLeads(): Promise<LeadDocument[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'leads'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const leads: LeadDocument[] = [];
      querySnapshot.forEach((doc) => {
        leads.push({ id: doc.id, ...doc.data() } as LeadDocument);
      });
      return leads;
    } catch (e) {
      console.error('Failed to fetch leads from Firestore:', e);
    }
  }

  // Fallback / Mock
  return initializeMockLeadsIfNeeded();
}

// 3. 리드 상태 및 메모 업데이트
export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
  memo?: string,
  nextFollowupAt?: string
): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    try {
      const leadRef = doc(db, 'leads', leadId);
      const updateData: any = { status };
      if (memo !== undefined) updateData.memo = memo;
      if (nextFollowupAt !== undefined) updateData.next_followup_at = nextFollowupAt;
      updateData.last_contacted_at = new Date().toISOString();

      await updateDoc(leadRef, updateData);
      return true;
    } catch (e) {
      console.error('Failed to update lead status in Firestore:', e);
    }
  }

  // Mock / LocalStorage
  const leads = initializeMockLeadsIfNeeded();
  const idx = leads.findIndex(l => l.id === leadId);
  if (idx !== -1) {
    leads[idx].status = status;
    if (memo !== undefined) leads[idx].memo = memo;
    if (nextFollowupAt !== undefined) leads[idx].next_followup_at = nextFollowupAt;
    leads[idx].last_contacted_at = new Date().toISOString();
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(leads));
    return true;
  }
  return false;
}

// 4. 담당 영업자 지정
export async function assignConsultant(leadId: string, consultantName: string): Promise<boolean> {
  const now = new Date().toISOString();
  if (isFirebaseConfigured && db) {
    try {
      const leadRef = doc(db, 'leads', leadId);
      await updateDoc(leadRef, {
        assigned_to: consultantName,
        assigned_at: now
      });
      return true;
    } catch (e) {
      console.error('Failed to assign consultant in Firestore:', e);
    }
  }

  const leads = initializeMockLeadsIfNeeded();
  const idx = leads.findIndex(l => l.id === leadId);
  if (idx !== -1) {
    leads[idx].assigned_to = consultantName;
    leads[idx].assigned_at = now;
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(leads));
    return true;
  }
  return false;
}

// 5. 상담 이력 타임라인 조회 및 작성
export async function fetchConsultationHistory(leadId: string): Promise<ConsultationHistoryItem[]> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    const history: ConsultationHistoryItem[] = raw ? JSON.parse(raw) : [];
    return history.filter(item => item.lead_id === leadId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (e) {
    return [];
  }
}

export async function addConsultationHistory(item: Omit<ConsultationHistoryItem, 'id' | 'created_at'>): Promise<ConsultationHistoryItem> {
  const newItem: ConsultationHistoryItem = {
    ...item,
    id: 'history_' + Date.now(),
    created_at: new Date().toISOString()
  };

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    const history: ConsultationHistoryItem[] = raw ? JSON.parse(raw) : [];
    history.push(newItem);
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Error adding history:', e);
  }

  return newItem;
}
