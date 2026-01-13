import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../../components/layout/Container';
import { sendResetCode } from './forgotPassword.js';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendResetCode({ email });
      navigate('/auth/verify-code', { state: { email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-6 shadow-lg" />

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Esqueceu a senha?
        </h1>
        <p className="text-gray-500 mb-8 text-center">
          Não se preocupe, enviaremos as instruções de recuperação.
        </p>

        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-medium rounded-lg transition-colors ${
                loading
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-violet-600 text-white hover:bg-violet-700'
              }`}
            >
              {loading ? 'Enviando...' : 'Enviar código'}
            </button>
          </form>
        </div>

        <Link
          to="/auth/sign-in"
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
          Voltar para o login
        </Link>
      </div>
    </Container>
  );
}

export default ForgotPassword;
