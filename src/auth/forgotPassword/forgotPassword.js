import { supabase } from '../../supabase/supabase.js';

export async function sendResetCode({ email }) {
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
