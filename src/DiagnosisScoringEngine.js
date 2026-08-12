// DiagnosisScoringEngine.js
// UI와 분리된 순수 함수 기반 scoring engine.
// 모든 점수는 0~100으로 clamp하며, 항목별 배점을 합산해 최종 100점으로 환산합니다.

const clamp = (n, min=0, max=100) => Math.max(min, Math.min(max, n));
const won = n => Number(n || 0);

function scoreCapital(budget, profile) {
  const b = won(budget);
  const min = won(profile.capital_min_krw);
  const rec = won(profile.capital_recommended_krw);
  if (!min || !rec) return 12.5;
  if (b < min) return clamp(25 * (b / min) * 0.65);
  if (b >= rec) return 25;
  return clamp(16.25 + 8.75 * ((b - min) / Math.max(1, rec - min)));
}

function scoreRegion(regionType, profile) {
  const rec = new Set(profile.recommended_region_types || []);
  const avoid = new Set(profile.avoid_region_types || []);
  if (avoid.has(regionType)) return 6;
  if (rec.has(regionType)) return 18;
  return 12;
}

function scoreIndustry(profile, desiredAreaPyeong) {
  let score = 12;
  const area = won(desiredAreaPyeong);
  if (profile.land_required) score -= 2;
  if (profile.facility_investment_level >= 80) score -= 1;
  if (area > 0 && profile.area_min_pyeong && area >= profile.area_min_pyeong) score += 5;
  if (area > 0 && profile.area_max_pyeong && area <= profile.area_max_pyeong) score += 3;
  if (profile.franchise_fit >= 80) score += 2;
  return clamp(score, 0, 20);
}

function scoreTiming(monthsAvailable, profile) {
  const m = won(monthsAvailable);
  const need = won(profile.preparation_months);
  if (!need || !m) return 5;
  if (m >= need) return 10;
  return clamp(10 * (m / need) * 0.7);
}

function scoreOperator({experienceLevel="first", operationMode="direct"}, profile) {
  let score = 5;
  const difficulty = won(profile.operation_difficulty);
  const labor = won(profile.labor_intensity);

  if (experienceLevel === "same_industry") score += 3;
  else if (experienceLevel === "experienced") score += 2;

  if (operationMode === "unmanned") {
    score += profile.unmanned_fit >= 70 ? 2 : -2;
  }
  if (operationMode === "side_business") {
    score += (labor <= 2 && profile.unmanned_fit >= 50) ? 2 : -2;
  }
  if (difficulty >= 5 && experienceLevel === "first") score -= 2;
  return clamp(score, 0, 10);
}

function scoreMarket(profile, regionType) {
  let score = 5;
  if (profile.commercial_dependency >= 80 && ["residential","station","mixed_commercial"].includes(regionType)) score += 3;
  if (profile.commercial_dependency <= 40 && ["suburban","rural"].includes(regionType)) score += 2;
  score += profile.growth_screening >= 65 ? 1 : 0;
  return clamp(score, 0, 10);
}

function scoreRisk(profile) {
  // 위험도가 높을수록 감점되는 구조가 아니라, 5점 만점의 "위험관리 적합도"로 표현.
  let score = 5;
  if (profile.operation_difficulty >= 5) score -= 2;
  if (profile.license_permit_level >= 5) score -= 1;
  if (profile.land_required) score -= 1;
  if (profile.preparation_months >= 9) score -= 1;
  return clamp(score, 0, 5);
}

function gradeFor(total) {
  if (total >= 90) return { grade:"S", label:"매우 적합" };
  if (total >= 80) return { grade:"A", label:"창업 적합" };
  if (total >= 70) return { grade:"B", label:"조건부 적합" };
  if (total >= 60) return { grade:"C", label:"보완 필요" };
  if (total >= 50) return { grade:"D", label:"신중 검토" };
  return { grade:"E", label:"현재 조건 부적합" };
}

function diagnose(input, profile) {
  const capital = scoreCapital(input.budget, profile);
  const region = scoreRegion(input.regionType, profile);
  const industry = scoreIndustry(profile, input.areaPyeong);
  const timing = scoreTiming(input.monthsAvailable, profile);
  const operator = scoreOperator(input, profile);
  const market = scoreMarket(profile, input.regionType);
  const risk = scoreRisk(profile);
  const total = Math.round(capital + region + industry + timing + operator + market + risk);

  const deductions = [
    {key:"capital", label:"운용자금", lost:25-capital, text: capital < 15 ? "선택한 업종의 최소·권장 투자금 대비 현재 운용자금이 부족합니다." : "운용자금은 업종의 초기 투자 요구 수준을 대체로 충족합니다."},
    {key:"region", label:"지역·상권", lost:20-region, text: region < 10 ? "선택한 상권 유형과 업종의 적합도가 낮습니다." : "선택한 상권 유형과 업종의 기본 적합도가 양호합니다."},
    {key:"industry", label:"업종·규모", lost:20-industry, text: industry < 12 ? "업종 특성상 시설·면적·운영 조건을 추가 검토해야 합니다." : "선택 업종의 규모 조건과 기본 창업 특성이 비교적 적합합니다."},
    {key:"timing", label:"창업 시기", lost:10-timing, text: timing < 6 ? "현재 계획한 기간보다 준비기간이 부족할 가능성이 있습니다." : "계획한 창업 시기는 기본 준비기간과 대체로 부합합니다."},
    {key:"operator", label:"운영자 적합도", lost:10-operator, text: operator < 6 ? "운영 방식과 업종의 인력·난이도 조건이 맞지 않을 수 있습니다." : "운영 방식과 업종의 기본 특성이 비교적 잘 맞습니다."},
    {key:"market", label:"시장성", lost:10-market, text:"업종 특성과 선택 상권을 기반으로 한 내부 스크리닝 평가입니다."},
    {key:"risk", label:"위험관리", lost:5-risk, text:"시설·인허가·준비기간 등 구조적 위험요인을 반영한 내부 평가입니다."}
  ].sort((a,b)=>b.lost-a.lost);

  const grade = gradeFor(total);
  return {
    total,
    ...grade,
    scores:{capital,region,industry,timing,operator,market,risk},
    topDeductions: deductions.slice(0,3),
    disclaimer:"본 결과는 업종 프로필 기반의 1차 창업 적합도 스크리닝이며 실제 매출·임대료·경쟁점포·상권 유동인구·인허가 등 현장 데이터에 따른 최종 사업성 판단을 대체하지 않습니다."
  };
}

function rankIndustries(input, profiles, limit=3) {
  return profiles
    .map(profile => ({ profile, result: diagnose(input, profile) }))
    .sort((a,b)=>b.result.total-a.result.total)
    .slice(0,limit);
}


window.DiagnosisScoringEngine = { scoreCapital, scoreRegion, scoreIndustry, scoreTiming, scoreOperator, scoreMarket, scoreRisk, gradeFor, diagnose, rankIndustries };
