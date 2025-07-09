// routes
import { PATH_AUTH } from '../routes/paths';
// ----------------------------------------------------------------------

function jwtDecode(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();
  let timeLeft = exp * 1000 - currentTime;
  const updateTitleWithTimeLeft = (timeLeftInMillis) => {
    const timeLeftInMinutes = Math.max(Math.floor(timeLeftInMillis / 1000 / 60), 0);
    const timeLeftInSeconds = Math.max(Math.floor((timeLeftInMillis / 1000) % 60), 0);

    if (timeLeftInMinutes < 60) {
      document.title = `Token will expires in ${timeLeftInSeconds}s`;
    }
  };

  clearTimeout(expiredTimer);

  expiredTimer = setInterval(() => {
    if (timeLeft > 0) {
      updateTitleWithTimeLeft(timeLeft);
      timeLeft -= 30000;
    }
  }, 30000);
  setTimeout(() => {
    alert('Token expired');

    localStorage.removeItem('accessToken');

    window.location.href = PATH_AUTH.root;
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    const { exp } = jwtDecode(accessToken);
    tokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');
  }
};
