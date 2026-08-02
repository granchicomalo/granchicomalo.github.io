// 영업자용 Internal Lead Score 가중치 및 등급 산정 설정
export const SCORING_RULES = {
  startupPeriod: {
    "1개월 이내": 30,
    "3개월 이내": 20,
    "6개월 이내": 10,
    "1년 이내": 5,
    "아직 미정": 0
  },
  budget: {
    "1억원 이상": 20,
    "7,000만원~1억원": 20,
    "5,000~7,000만원": 20,
    "3,000~5,000만원": 15,
    "2,000~3,000만원": 10,
    "2,000만원 이하": 10,
    "아직 정하지 않았어요": 0
  },
  region: {
    specific: 10, // 시/군/구 등 구체적 입력
    provinceOnly: 5, // 시/도만 선택
    undefined: 0
  },
  operationType: {
    specific: 10, // 직접, 1인, 무인, 직원 등
    undefined: 0 // 아직 모르겠어요
  },
  interestType: {
    specific: 10, // 소자본, 무인 등
    undefined: 0 // 업종을 아직 정하지 않았어요
  },
  consultationCompleted: 20, // 상담 예약 폼 제출 완료
  timeSlotSelected: 5, // 구체적 시간대(오전/오후/저녁) 선택

  gradeThresholds: {
    A: 70, // 70점 이상 A (Hot Lead)
    B: 40  // 40~69점 B (Warm Lead), 40점 미만 C (Cold Lead)
  }
};
