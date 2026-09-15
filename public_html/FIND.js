const SESSION_KEY = "admadia_session_v1";
const SESSION_KEY = "admadia_session_v1";

/* ---------- Friendly error mapping ---------- */
function friendlyAuthError(err) {
  const code = (err && err.code) ? err.code : '';
  const map = {
    'auth/user-not-found':            'No account found with that email.',
    'auth/wrong-password':            'Incorrect password. Please try again.',
    'auth/invalid-credential':        'Invalid email or password.',
    'auth/invalid-login-credentials': 'Invalid email or password.',
    'auth/invalid-email':             'Please enter a valid email address.',
    'auth/email-already-in-use':      'This email is already registered.',
    'auth/weak-password':             'Password must be at least 6 characters.',
    'auth/too-many-requests':         'Too many attempts. Try again in a moment.',
    'auth/network-request-failed':    'Network error. Please check your connection.',
    'auth/user-disabled':             'This account has been disabled.',
    'auth/operation-not-allowed':     'This sign-in method is not enabled.',
    'auth/missing-email':             'Please enter your email address.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

function attachAutoClear(inputId, errorId) {
  const inp = document.getElementById(inputId);
  const el  = document.getElementById(errorId);
  if (!inp || !el) return;
  const clear = () => { if (el.innerText) el.innerText = ''; };
  inp.addEventListener('input', clear);
  inp.addEventListener('focus', clear);
}
