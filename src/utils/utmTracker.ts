// UTM 파라미터 및 유입 경로 추적 모듈 (최초 유입 & 최근 유입 동시 보존)

export interface UtmData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  landing_page: string;
  referrer: string;

  first_utm_source?: string;
  first_utm_medium?: string;
  first_utm_campaign?: string;
  first_landing_page: string;
  first_referrer: string;
}

const FIRST_UTM_KEY = 'fc_first_utm_data';

export function initializeUtmTracking(): UtmData {
  const urlParams = new URLSearchParams(window.location.search);
  const currentLanding = window.location.pathname + window.location.search;
  const currentReferrer = document.referrer || '직접 방문';

  const currentUtmSource = urlParams.get('utm_source') || undefined;
  const currentUtmMedium = urlParams.get('utm_medium') || undefined;
  const currentUtmCampaign = urlParams.get('utm_campaign') || undefined;
  const currentUtmContent = urlParams.get('utm_content') || undefined;

  // 1. 최초 유입 정보 세정 및 로컬 스토리지 보존
  let firstUtm: Partial<UtmData> = {};
  try {
    const savedFirst = sessionStorage.getItem(FIRST_UTM_KEY);
    if (savedFirst) {
      firstUtm = JSON.parse(savedFirst);
    } else {
      firstUtm = {
        first_utm_source: currentUtmSource || inferSourceFromReferrer(currentReferrer),
        first_utm_medium: currentUtmMedium,
        first_utm_campaign: currentUtmCampaign,
        first_landing_page: currentLanding,
        first_referrer: currentReferrer,
      };
      sessionStorage.setItem(FIRST_UTM_KEY, JSON.stringify(firstUtm));
    }
  } catch (e) {
    console.error('SessionStorage UTM error:', e);
  }

  // 2. 통합 UTM 데이터 구성
  return {
    utm_source: currentUtmSource || inferSourceFromReferrer(currentReferrer),
    utm_medium: currentUtmMedium,
    utm_campaign: currentUtmCampaign,
    utm_content: currentUtmContent,
    landing_page: currentLanding,
    referrer: currentReferrer,

    first_utm_source: firstUtm.first_utm_source || inferSourceFromReferrer(currentReferrer),
    first_utm_medium: firstUtm.first_utm_medium,
    first_utm_campaign: firstUtm.first_utm_campaign,
    first_landing_page: firstUtm.first_landing_page || currentLanding,
    first_referrer: firstUtm.first_referrer || currentReferrer,
  };
}

function inferSourceFromReferrer(ref: string): string {
  if (!ref || ref === '직접 방문') return '직접 방문';
  if (ref.includes('naver.com')) return '네이버';
  if (ref.includes('google.com') || ref.includes('google.co.kr')) return '구글 검색';
  if (ref.includes('instagram.com')) return '인스타그램';
  if (ref.includes('facebook.com')) return '페이스북';
  if (ref.includes('youtube.com')) return '유튜브';
  if (ref.includes('daum.net') || ref.includes('kakao.com')) return '카카오/다음';
  return '기타 웹사이트';
}
