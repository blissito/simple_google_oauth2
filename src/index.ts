/**
 * simple-google-oauth2
 * Una biblioteca isomorfa para autenticación con Google OAuth2 sin dependencias
 */

// Tipos exportados
export type {
  GoogleAuthConfig,
  TokenResponse,
  UserInfo,
  AuthError,
  AuthEvent,
  AuthEventListener,
} from './common/types';

// Cliente (navegador)
export { useGoogleLogin, type GoogleLoginHook } from './client/useGoogleLogin';

// Servidor
export { 
  handleGoogleLogin, 
  refreshAccessToken, 
  revokeToken 
} from './server/handleGoogleLogin';

// Utilidades del servidor
export { 
  exchangeCodeForToken, 
  getUserInfo, 
  verifyIdToken 
} from './server/utils';
