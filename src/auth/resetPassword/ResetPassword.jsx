import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../../components/layout/Container';
import { updatePassword } from './resetPassword.js';

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const passwordRequirements = [
    { label: 'Pelo menos 8 caracteres', isValid: password.length >= 8 },
    { label: 'Uma letra minúscula', isValid: /[a-z]/.test(password) },
    { label: 'Uma letra maiúscula', isValid: /[A-Z]/.test(password) },
    { label: 'Um caractere especial', isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.isValid);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!allRequirementsMet || !passwordsMatch) return;

    setLoading(true);
    setError(null);

    try {
      await updatePassword({ password });
      navigate('/auth/sign-in');
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
          Definir nova senha
        </h1>
        <p className="text-gray-500 mb-8 text-center">
          Sua nova senha deve ser diferente das senhas anteriores.
        </p>

        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nova Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a nova senha..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
              <ul className="mt-2 space-y-1">
                {passwordRequirements.map((requirement) => (
                  <li
                    key={requirement.label}
                    className={`flex items-center gap-2 text-sm ${
                      requirement.isValid ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {requirement.isValid ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="3" />
                      </svg>
                    )}
                    {requirement.label}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all ${
                  confirmPassword.length > 0
                    ? passwordsMatch
                      ? 'border-green-500'
                      : 'border-red-500'
                    : 'border-gray-200'
                }`}
                required
              />
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="mt-1.5 text-sm text-red-500">As senhas não coincidem</p>
              )}
              {passwordsMatch && (
                <p className="mt-1.5 text-sm text-green-600">As senhas coincidem</p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={!allRequirementsMet || !passwordsMatch || loading}
              className={`w-full py-3 font-medium rounded-lg transition-colors ${
                allRequirementsMet && passwordsMatch && !loading
                  ? 'bg-violet-600 text-white hover:bg-violet-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? 'Salvando...' : 'Redefinir senha'}
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

export default ResetPassword;
