import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Container from '../../components/layout/Container';
import { verifyOtpCode, resendCode } from './verifyCode.js';

function VerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate('/auth/forgot-password');
    }
  }, [email, navigate]);

  function handleChange(index, value) {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, event) {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(event) {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text').slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newCode[index] = char;
    });
    setCode(newCode);

    const nextEmptyIndex = newCode.findIndex((c) => !c);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const token = code.join('');

    if (token.length !== 6) {
      setError('Por favor, digite o código completo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await verifyOtpCode({ email, token });
      navigate('/auth/reset-password');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError(null);
    setSuccess(null);

    try {
      await resendCode({ email });
      setSuccess('Código reenviado com sucesso!');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  }

  return (
    <Container>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-6 shadow-lg" />

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Verifique seu e-mail
        </h1>
        <p className="text-gray-500 mb-2 text-center">
          Enviamos um código de verificação para
        </p>
        <p className="text-gray-900 font-medium mb-8">{email}</p>

        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Digite o código de verificação
              </label>
              <div className="flex gap-3 justify-center">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-xl font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {success && (
              <p className="text-sm text-green-600 text-center">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading || code.join('').length !== 6}
              className={`w-full py-3 font-medium rounded-lg transition-colors ${
                loading || code.join('').length !== 6
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-violet-600 text-white hover:bg-violet-700'
              }`}
            >
              {loading ? 'Verificando...' : 'Verificar código'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Não recebeu o código?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="font-medium text-violet-600 hover:text-violet-700 disabled:text-gray-400"
              >
                {resending ? 'Reenviando...' : 'Reenviar'}
              </button>
            </p>
          </form>
        </div>

        <Link
          to="/auth/forgot-password"
          className="mt-8 text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Voltar
        </Link>
      </div>
    </Container>
  );
}

export default VerifyCode;
