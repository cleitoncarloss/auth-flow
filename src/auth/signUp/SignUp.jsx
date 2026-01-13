import { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/layout/Container';
import { signUp } from './signUp.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  function validateName(value) {
    if (!value.trim()) {
      return 'Informe seu nome';
    }
    return '';
  }

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

  function handleNameChange(event) {
    const value = event.target.value;
    setName(value);
    setFieldErrors((prev) => ({ ...prev, name: '' }));
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

  const passwordRequirements = [
    { label: 'At least 8 characters', isValid: password.length >= 8 },
    { label: 'One lowercase letter', isValid: /[a-z]/.test(password) },
    { label: 'One uppercase letter', isValid: /[A-Z]/.test(password) },
    { label: 'One special character', isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.isValid);
  const passwordsMatch =
    password === confirmPassword && confirmPassword.length > 0;

  async function handleSubmit(event) {
    event.preventDefault();

    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (nameError || emailError || passwordError) {
      setFieldErrors({ name: nameError, email: emailError, password: passwordError });
      return;
    }

    if (!allRequirementsMet || !passwordsMatch) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signUp({
        email,
        password,
        fullName: name,
      });

      console.log('Account created successfully');
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

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Criar conta</h1>
        <p className="text-gray-500 mb-8">
          Start your journey with us today.
        </p>

        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nome
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Digite seu nome..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-violet-500 focus:border-transparent'
                }`}
              />
              {fieldErrors.name && (
                <p className="mt-1.5 text-sm text-red-500">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Digite sua senha..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-violet-500 focus:border-transparent'
                }`}
              />
              {fieldErrors.password && (
                <p className="mt-1.5 text-sm text-red-500">{fieldErrors.password}</p>
              )}

              <ul className="mt-2 space-y-1">
                {passwordRequirements.map(req => (
                  <li
                    key={req.label}
                    className={`flex items-center gap-2 text-sm ${
                      req.isValid ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {req.isValid ? (
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
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Confirmar senha 
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirmar senha..."
                disabled={!allRequirementsMet}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all ${
                  !allRequirementsMet
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    : confirmPassword.length > 0
                      ? passwordsMatch
                        ? 'border-green-500'
                        : 'border-red-500'
                      : 'border-gray-200'
                }`}
              />

              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="mt-1.5 text-sm text-red-500">
                  Passwords do not match
                </p>
              )}

              {passwordsMatch && (
                <p className="mt-1.5 text-sm text-green-600">
                  Passwords match
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
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
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p className="mt-8 text-gray-600">
          Already have an account?{' '}
          <Link
            to="/auth/sign-in"
            className="font-medium text-violet-600 hover:text-violet-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </Container>
  );
}

export default SignUp;
