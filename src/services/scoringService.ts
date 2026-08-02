import { DiagnosisFormData } from '../types/diagnosis';
import { LeadGrade } from '../types/lead';
import { SCORING_RULES } from '../config/scoringConfig';

export interface ScoreCalculationResult {
  customerDiagnosisScore: number;
  leadScore: number;
  leadGrade: LeadGrade;
  analysisSummary: string;
}

// 1. Customer Diagnosis Score (고객용 준비도 점수 - 100점 만점)
export function calculateCustomerDiagnosisScore(formData: DiagnosisFormData): number {
  let score = 50; // 기본 준비 점수

  // 예산 명확성 (+12)
  if (formData.budget && formData.budget !== '아직 정하지 않았어요') {
    score += 12;
  }

  // 희망지역 명확성 (+12)
  if (formData.region_province && formData.region_province !== '전체') {
    score += 6;
    if (formData.region_city) score += 6;
  }

  // 창업시기 (+14)
  if (formData.startup_period && formData.startup_period !== '아직 미정') {
    if (formData.startup_period === '1개월 이내' || formData.startup_period === '3개월 이내') {
      score += 14;
    } else {
      score += 8;
    }
  }

  // 운영방식 (+12)
  if (formData.operation_type && formData.operation_type !== '아직 모르겠어요') {
    score += 12;
  }

  return Math.min(Math.max(score, 45), 96); // 45점~96점 범위 내 산출
}

// 2. Internal Lead Score (영업자용 CRM 점수 및 A/B/C Grade)
export function calculateInternalLeadScore(
  formData: DiagnosisFormData,
  preferredTimeSlot?: string
): { leadScore: number; leadGrade: LeadGrade } {
  let score = 0;

  // 창업 시기
  const periodScore = SCORING_RULES.startupPeriod[formData.startup_period as keyof typeof SCORING_RULES.startupPeriod] || 0;
  score += periodScore;

  // 예산
  const budgetScore = SCORING_RULES.budget[formData.budget as keyof typeof SCORING_RULES.budget] || 0;
  score += budgetScore;

  // 희망지역
  if (formData.region_city && formData.region_city !== '전체') {
    score += SCORING_RULES.region.specific;
  } else if (formData.region_province) {
    score += SCORING_RULES.region.provinceOnly;
  }

  // 운영방식
  if (formData.operation_type && formData.operation_type !== '아직 모르겠어요') {
    score += SCORING_RULES.operationType.specific;
  }

  // 관심 유형
  if (formData.interest_types && formData.interest_types.length > 0 && !formData.interest_types.includes('업종을 아직 정하지 않았어요')) {
    score += SCORING_RULES.interestType.specific;
  }

  // 상담 예약 완료 가중치 (+20)
  score += SCORING_RULES.consultationCompleted;

  // 상담 희망 시간대 가중치 (+5)
  if (preferredTimeSlot && preferredTimeSlot !== '기타') {
    score += SCORING_RULES.timeSlotSelected;
  }

  // Grade 분류
  let leadGrade: LeadGrade = 'C';
  if (score >= SCORING_RULES.gradeThresholds.A) {
    leadGrade = 'A';
  } else if (score >= SCORING_RULES.gradeThresholds.B) {
    leadGrade = 'B';
  }

  return { leadScore: score, leadGrade };
}

// 3. 진단 결과 분석 문장 자동 생성 (객관적/참고용 문구만 생성, 확정/보장 문구 배제)
export function generateAnalysisSummary(formData: DiagnosisFormData): string {
  const budget = formData.budget;
  const period = formData.startup_period;
  const opType = formData.operation_type;
  const region = `${formData.region_province || ''} ${formData.region_city || ''}`.trim() || '희망 지역';

  let summary = `현재 [${region}] 지역을 중심으로 `;

  if (period === '1개월 이내' || period === '3개월 이내') {
    summary += `빠른 창업 실행을 구상하고 계시며, `;
  } else {
    summary += `안정적인 여유를 갖고 창업을 준비 중이시며, `;
  }

  if (budget === '2,000만원 이하' || budget === '2,000~3,000만원') {
    summary += `초기 자본 부담을 줄인 소자본·소형 매장이나 1인/무인 운영 모델을 최우선으로 검토해보는 것을 추천해 드립니다.`;
  } else if (budget === '1억원 이상' || budget === '7,000만원~1억원' || budget === '5,000~7,000만원') {
    summary += `선택 가능한 프랜차이즈 폭이 넓으므로 상권 입지와 예상 임대 조건, 운영 방식(${opType || '맞춤'})을 비교 분석하여 최적의 상권을 선점하는 전략이 유효합니다.`;
  } else {
    summary += `희망하시는 운영방식(${opType || '맞춤'})과 투자 예산의 균형을 다각도로 검토하는 단계입니다.`;
  }

  return summary;
}
