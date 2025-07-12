/**
 * Tipos compartidos para la biblioteca de autenticación con Google OAuth2
 */

export interface GoogleAuthConfig {
  clientId: string;
  redirectUri: string;
  scope?: string | string[];
  responseType?: 'code' | 'token' | 'id_token' | 'code token' | 'code id_token' | 'token id_token' | 'code token id_token' | 'none';
  accessType?: 'online' | 'offline';
  prompt?: 'none' | 'consent' | 'select_account';
  state?: string;
  includeGrantedScopes?: boolean;
  loginHint?: string;
  nonce?: string;
  hd?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  id_token?: string;
}

export interface UserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
  hd?: string;
}

export interface AuthError {
  error: string;
  error_description?: string;
  error_uri?: string;
}

// Tipos para el manejador de eventos
export type AuthEvent = 'signed_in' | 'signed_out' | 'token_refreshed' | 'error';
export type AuthEventListener = (event: { type: AuthEvent; data?: any }) => void;
