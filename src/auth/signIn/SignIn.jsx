import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../../components/layout/Container';
import { signIn } from './signIn.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

  function validateEmail(value) {
    if (!value.trim()) {
      return 'Informe seu email';
    }
    if (!EMAIL_REGEX.test(value)) {
      return 'Formato de email inválido';
    }
    return '';
  }

  function validatePassword(value) {
    if (!value) {
      return 'Informe sua senha';
    }
    return '';
  }

  function handleEmailChange(event) {
    const value = event.target.value;
    setEmail(value);

    if (!value.trim()) {
      setFieldErrors((prev) => ({ ...prev, email: '' }));
      return;
    }

    const isValidFormat = EMAIL_REGEX.test(value);
    const errorMessage = isValidFormat ? '' : 'Formato de email inválido';
    setFieldErrors((prev) => ({ ...prev, email: errorMessage }));
  }

  function handlePasswordChange(event) {
    const value = event.target.value;
    setPassword(value);
    setFieldErrors((prev) => ({ ...prev, password: '' }));
  }

  function handleEmailBlur() {
    if (!email.trim()) {
      return;
    }
    const emailError = validateEmail(email);
    setFieldErrors((prev) => ({ ...prev, email: emailError }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setFieldErrors({ email: emailError, password: passwordError });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signIn({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <section className="flex flex-col items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-6 shadow-lg" />
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Faça login na sua conta</h1>
        <p className="text-gray-500 mb-8">
          Bem vindo de volta! Por favor, insira suas credenciais.
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
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="Digite seu e-mail..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-violet-500 focus:border-transparent'
                }`}
              />
              {fieldErrors.email && (
                <p className="mt-1.5 text-sm text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-violet-500 focus:border-transparent'
                }`}
              />
              {fieldErrors.password && (
                <p className="mt-1.5 text-sm text-red-500">{fieldErrors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/auth/forgot-password"
                className="text-sm font-medium text-violet-600 hover:text-violet-700"
              >
                Esqueceu a senha?
              </Link>
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
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="mt-8 text-gray-600">
          Não tem uma conta?{' '}
          <Link to="/auth/sign-up" className="font-medium text-violet-600 hover:text-violet-700">
            Cadastre-se
          </Link>
        </p>
      </section>
    </Container>
  );
}

export default SignIn;
