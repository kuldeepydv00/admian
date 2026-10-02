import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Attach the admin login token to every API call, and send the admin back to the
// login screen if the server says the token is missing or expired.
const installAdminAuthFetch = () => {
  const originalFetch = window.fetch.bind(window);
  const isApiUrl = (url: string) => {
    try {
      const u = new URL(url, window.location.href);
      return u.pathname.startsWith('/api/');
    } catch {
      return false;
    }
  };
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : (input instanceof URL ? input.href : input.url);
    const token = localStorage.getItem('admin_token');
    if (token && isApiUrl(url)) {
      const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
      if (!headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
      init = { ...(init || {}), headers };
    }
    const res = await originalFetch(input, init);
    if (res.status === 401 && token && isApiUrl(url)) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_authenticated');
      window.dispatchEvent(new Event('admin-auth-expired'));
    }
    return res;
  };
};
installAdminAuthFetch();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
