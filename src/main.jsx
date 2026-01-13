import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import SignIn from './auth/signIn/SignIn.jsx';
import SignUp from './auth/signUp/SignUp.jsx';
import ForgotPassword from './auth/forgotPassword/ForgotPassword.jsx';
import VerifyCode from './auth/verifyCode/VerifyCode.jsx';
import ResetPassword from './auth/resetPassword/ResetPassword.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/sign-up" element={<SignUp />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/verify-code" element={<VerifyCode />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
    </Routes>
  </BrowserRouter>
);
