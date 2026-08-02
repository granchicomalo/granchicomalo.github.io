import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, isFirebaseConfigured } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { SITE_CONFIG } from '../../config/siteConfig';
import { ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); // 자동 입력 제거 (빈 문자열)
  const [password, setPassword] = useState(''); // 자동 입력 제거 (빈 문자열)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      if (isFirebaseConfigured && auth) {
        // Firebase Authentication 실시간 로그인 검증
        await signInWithEmailAndPassword(auth, email, password);
        sessionStorage.setItem('fc_admin_session', 'true');
        sessionStorage.setItem('fc_admin_user', email);
        navigate('/admin/dashboard');
      } else {
        // Firebase 미설정 시 개발 테스트 로그인
        sessionStorage.setItem('fc_admin_session', 'true');
        sessionStorage.setItem('fc_admin_user', email);
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      console.error('Firebase Auth Login Error:', err);
      setError('로그인 실패: 이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '4rem 0 6rem',
      minHeight: 'calc(100vh - 180px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div className="card animate-fade-in" style={{ padding: '2.5rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <ShieldCheck size={32} />
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              영업자 CRM 관리자 로그인
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
              {SITE_CONFIG.brand.name} 전용
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fff1f2',
              color: '#e11d48',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                관리자 계정 이메일
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="admin@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem 0.85rem 2.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.95rem'
                  }}
                />
                <Mail size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                비밀번호
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem 0.85rem 2.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.95rem'
                  }}
                />
                <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-full"
              style={{ padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              {loading ? '인증 처리 중...' : 'CRM 접속하기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
