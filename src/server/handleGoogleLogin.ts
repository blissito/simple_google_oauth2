import { GoogleAuthConfig, UserInfo, TokenResponse, AuthError } from '../common/types';
import { exchangeCodeForToken, getUserInfo, verifyIdToken } from './utils';

/**
 * Maneja el callback de autenticación de Google OAuth2 en el servidor
 */
export async function handleGoogleLogin(
  code: string,
  config: GoogleAuthConfig & { clientSecret: string }
): Promise<{
  tokens: TokenResponse;
  user: UserInfo;
}> {
  const { clientId, clientSecret, redirectUri } = config;

  if (!code) {
    throw new Error('Authorization code is required');
  }

  if (!clientId || !clientSecret) {
    throw new Error('Client ID and Client Secret are required');
  }

  try {
    // 1. Intercambiar código por tokens
    const tokens = await exchangeCodeForToken(
      code,
      clientId,
      clientSecret,
      redirectUri
    );

    // 2. Validar token de ID (si está presente)
    if (tokens.id_token) {
      const isTokenValid = verifyIdToken(tokens.id_token, clientId);
      if (!isTokenValid) {
        throw new Error('Invalid ID token');
      }
    }

    // 3. Obtener información del usuario
    const userInfo = await getUserInfo(tokens.access_token);

    return {
      tokens,
      user: userInfo,
    };
  } catch (error) {
    console.error('Error in handleGoogleLogin:', error);
    throw error;
  }
}

/**
 * Refresca un token de acceso usando el refresh token
 */
export async function refreshAccessToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<TokenResponse> {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  
  const params = new URLSearchParams();
  params.append('refresh_token', refreshToken);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'refresh_token';

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData: AuthError = await response.json();
      throw new Error(errorData.error_description || 'Error refreshing token');
    }

    return response.json();
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

/**
 * Revoca un token de acceso o refresh token
 */
export async function revokeToken(
  token: string,
  tokenTypeHint: 'access_token' | 'refresh_token' = 'access_token'
): Promise<boolean> {
  const revokeUrl = 'https://oauth2.googleapis.com/revoke';
  
  const params = new URLSearchParams();
  params.append('token', token);
  if (tokenTypeHint) {
    params.append('token_type_hint', tokenTypeHint);
  }

  try {
    const response = await fetch(revokeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    return response.ok;
  } catch (error) {
    console.error('Error revoking token:', error);
    return false;
  }
}
