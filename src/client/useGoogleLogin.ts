import { GoogleAuthConfig, AuthEvent, AuthEventListener } from '../common/types';

/**
 * Hook de React para autenticación con Google OAuth2
 */
export function useGoogleLogin(config: GoogleAuthConfig) {
  const listeners = new Set<AuthEventListener>();
  
  // Iniciar el flujo de autenticación
  const login = (options: Partial<GoogleAuthConfig> = {}) => {
    const {
      clientId,
      redirectUri,
      scope = 'profile email',
      responseType = 'code',
      accessType = 'offline',
      prompt = 'consent',
      state = generateRandomString(),
      includeGrantedScopes = true,
      loginHint,
      nonce,
      hd
    } = { ...config, ...options };

    // Validar configuración
    if (!clientId) {
      throw new Error('Google OAuth2 client ID is required');
    }

    if (!redirectUri) {
      throw new Error('Redirect URI is required');
    }

    // Construir URL de autorización
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    const params = new URLSearchParams();
    
    params.append('client_id', clientId);
    params.append('redirect_uri', redirectUri);
    params.append('response_type', responseType);
    params.append('scope', Array.isArray(scope) ? scope.join(' ') : scope);
    params.append('access_type', accessType);
    params.append('include_granted_scopes', includeGrantedScopes.toString());
    params.append('state', state);
    
    if (prompt) params.append('prompt', prompt);
    if (loginHint) params.append('login_hint', loginHint);
    if (nonce) params.append('nonce', nonce);
    if (hd) params.append('hd', hd);

    // Almacenar state en sessionStorage para validación posterior
    sessionStorage.setItem('google_oauth2_state', state);
    
    // Redirigir a Google para autenticación
    window.location.href = `${authUrl}?${params.toString()}`;
  };

  // Manejar la respuesta de autenticación
  const handleCallback = async (): Promise<{ code: string; state: string } | null> => {
    if (typeof window === 'undefined') return null;
    
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    
    // Limpiar la URL después de procesar
    window.history.replaceState({}, document.title, window.location.pathname);

    if (error) {
      notifyListeners('error', { 
        error,
        error_description: url.searchParams.get('error_description') || 'Authentication error'
      });
      return null;
    }

    if (!code || !state) {
      return null;
    }

    // Validar state
    const storedState = sessionStorage.getItem('google_oauth2_state');
    sessionStorage.removeItem('google_oauth2_state');

    if (state !== storedState) {
      notifyListeners('error', { 
        error: 'state_mismatch',
        error_description: 'State parameter does not match'
      });
      return null;
    }

    return { code, state };
  };

  // Utilidades
  const generateRandomString = (length = 32): string => {
    const array = new Uint8Array(length / 2);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback para entornos sin crypto
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const notifyListeners = (type: AuthEvent, data?: any) => {
    listeners.forEach(listener => listener({ type, data }));
  };

  // Suscribirse a eventos de autenticación
  const subscribe = (listener: AuthEventListener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return {
    login,
    handleCallback,
    subscribe
  };
}

// Tipos de retorno del hook
export type GoogleLoginHook = ReturnType<typeof useGoogleLogin>;
