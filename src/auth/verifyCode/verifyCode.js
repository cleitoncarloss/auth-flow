import { supabase } from '../../supabase/supabase.js';

export async function verifyOtpCode({ email, token }) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function resendCode({ email }) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
