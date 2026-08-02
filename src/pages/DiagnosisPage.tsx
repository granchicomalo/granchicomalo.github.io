import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DIAGNOSIS_STEPS, KOREA_REGIONS, DiagnosisFormData } from '../types/diagnosis';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export const DiagnosisPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [formData, setFormData] = useState<DiagnosisFormData>({
    startup_purpose: '',
    budget: '',
    region_province: '서울',
    region_city: '은평구',
    region_detail: '',
    startup_period: '',
    operation_type: '',
    interest_types: []
  });

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // 완료 시 결과 페이지로 데이터 전송
      navigate('/result', { state: { formData } });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleSingleSelect = (field: keyof DiagnosisFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectToggle = (value: string) => {
    setFormData(prev => {
      const current = prev.interest_types;
      if (value === '업종을 아직 정하지 않았어요') {
        return { ...prev, interest_types: [value] };
      }

      const filtered = current.filter(v => v !== '업종을 아직 정하지 않았어요');
      if (filtered.includes(value)) {
        return { ...prev, interest_types: filtered.filter(v => v !== value) };
      } else {
        return { ...prev, interest_types: [...filtered, value] };
      }
    });
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !formData.startup_purpose;
    if (currentStep === 2) return !formData.budget;
    if (currentStep === 3) return !formData.region_province;
    if (currentStep === 4) return !formData.startup_period;
    if (currentStep === 5) return !formData.operation_type;
    if (currentStep === 6) return formData.interest_types.length === 0;
    return false;
  };

  const progressPercent = Math.round((currentStep / 6) * 100);

  return (
    <div style={{ padding: '2rem 0 4rem', minHeight: 'calc(100vh - 180px)' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        {/* Progress Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <button
              onClick={handlePrev}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.9rem',
                color: 'var(--slate-600)',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={18} />
              <span>{currentStep === 1 ? '홈으로' : '이전'}</span>
            </button>

            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-600)' }}>
              STEP {currentStep} / 6
            </span>
          </div>

          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--slate-200)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: 'var(--primary-600)',
              transition: 'width 0.3s ease-in-out'
            }} />
          </div>
        </div>

        {/* Step Contents */}
        <div className="card animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--slate-900)' }}>
                {DIAGNOSIS_STEPS.step1.title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {DIAGNOSIS_STEPS.step1.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSingleSelect('startup_purpose', opt)}
                    style={{
                      padding: '1.1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: formData.startup_purpose === opt ? '2px solid var(--primary-600)' : '1px solid var(--slate-200)',
                      backgroundColor: formData.startup_purpose === opt ? 'var(--primary-50)' : '#ffffff',
                      color: formData.startup_purpose === opt ? 'var(--primary-700)' : 'var(--slate-800)',
                      fontWeight: formData.startup_purpose === opt ? 700 : 500,
                      textAlign: 'left',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span>{opt}</span>
                    {formData.startup_purpose === opt && <Check size={20} style={{ color: 'var(--primary-600)' }} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--slate-900)' }}>
                {DIAGNOSIS_STEPS.step2.title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {DIAGNOSIS_STEPS.step2.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSingleSelect('budget', opt)}
                    style={{
                      padding: '1.1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: formData.budget === opt ? '2px solid var(--primary-600)' : '1px solid var(--slate-200)',
                      backgroundColor: formData.budget === opt ? 'var(--primary-50)' : '#ffffff',
                      color: formData.budget === opt ? 'var(--primary-700)' : 'var(--slate-800)',
                      fontWeight: formData.budget === opt ? 700 : 500,
                      textAlign: 'left',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{opt}</span>
                    {formData.budget === opt && <Check size={20} style={{ color: 'var(--primary-600)' }} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--slate-900)' }}>
                {DIAGNOSIS_STEPS.step3.title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.5rem' }}>
                    시 / 도 선택
                  </label>
                  <select
                    value={formData.region_province}
                    onChange={(e) => {
                      const province = e.target.value;
                      const firstCity = KOREA_REGIONS[province]?.[0] || '';
                      setFormData(prev => ({ ...prev, region_province: province, region_city: firstCity }));
                    }}
                    style={{
                      width: '100%',
                      padding: '0.9rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--slate-300)',
                      backgroundColor: '#ffffff',
                      fontSize: '1rem'
                    }}
                  >
                    {Object.keys(KOREA_REGIONS).map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.5rem' }}>
                    시 / 군 / 구 선택
                  </label>
                  <select
                    value={formData.region_city}
                    onChange={(e) => setFormData(prev => ({ ...prev, region_city: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.9rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--slate-300)',
                      backgroundColor: '#ffffff',
                      fontSize: '1rem'
                    }}
                  >
                    {(KOREA_REGIONS[formData.region_province] || []).map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.5rem' }}>
                    상세 희망 동/상권 (선택 입력)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 응암동 역세권 주변"
                    value={formData.region_detail}
                    onChange={(e) => setFormData(prev => ({ ...prev, region_detail: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.9rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--slate-300)',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--slate-900)' }}>
                {DIAGNOSIS_STEPS.step4.title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {DIAGNOSIS_STEPS.step4.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSingleSelect('startup_period', opt)}
                    style={{
                      padding: '1.1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: formData.startup_period === opt ? '2px solid var(--primary-600)' : '1px solid var(--slate-200)',
                      backgroundColor: formData.startup_period === opt ? 'var(--primary-50)' : '#ffffff',
                      color: formData.startup_period === opt ? 'var(--primary-700)' : 'var(--slate-800)',
                      fontWeight: formData.startup_period === opt ? 700 : 500,
                      textAlign: 'left',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{opt}</span>
                    {formData.startup_period === opt && <Check size={20} style={{ color: 'var(--primary-600)' }} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {currentStep === 5 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--slate-900)' }}>
                {DIAGNOSIS_STEPS.step5.title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {DIAGNOSIS_STEPS.step5.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSingleSelect('operation_type', opt)}
                    style={{
                      padding: '1.1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: formData.operation_type === opt ? '2px solid var(--primary-600)' : '1px solid var(--slate-200)',
                      backgroundColor: formData.operation_type === opt ? 'var(--primary-50)' : '#ffffff',
                      color: formData.operation_type === opt ? 'var(--primary-700)' : 'var(--slate-800)',
                      fontWeight: formData.operation_type === opt ? 700 : 500,
                      textAlign: 'left',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{opt}</span>
                    {formData.operation_type === opt && <Check size={20} style={{ color: 'var(--primary-600)' }} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6 */}
          {currentStep === 6 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--slate-900)' }}>
                {DIAGNOSIS_STEPS.step6.title}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '1.5rem' }}>
                {DIAGNOSIS_STEPS.step6.subtitle}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {DIAGNOSIS_STEPS.step6.options.map((opt, i) => {
                  const isChecked = formData.interest_types.includes(opt);
                  return (
                    <button
                      key={i}
                      onClick={() => handleMultiSelectToggle(opt)}
                      style={{
                        padding: '1.1rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: isChecked ? '2px solid var(--primary-600)' : '1px solid var(--slate-200)',
                        backgroundColor: isChecked ? 'var(--primary-50)' : '#ffffff',
                        color: isChecked ? 'var(--primary-700)' : 'var(--slate-800)',
                        fontWeight: isChecked ? 700 : 500,
                        textAlign: 'left',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{opt}</span>
                      {isChecked && <Check size={20} style={{ color: 'var(--primary-600)' }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Action Button */}
          <div style={{ marginTop: '2rem' }}>
            <button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="btn btn-primary btn-full"
              style={{
                opacity: isNextDisabled() ? 0.5 : 1,
                cursor: isNextDisabled() ? 'not-allowed' : 'pointer'
              }}
            >
              <span>{currentStep === 6 ? '진단 결과 확인하기' : '다음'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
