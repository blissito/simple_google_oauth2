/**
 * Utilidades para el manejo de autenticación en el servidor
 */

import { TokenResponse, AuthError } from '../common/types';

/**
 * Intercambia un código de autorización por tokens de acceso
 */
export async function exchangeCodeForToken(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<TokenResponse> {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  
  const params = new URLSearchParams();
  params.append('code', code);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUri);
  params.append('grant_type', 'authorization_code');

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
      throw new Error(errorData.error_description || 'Error exchanging code for token');
    }

    return response.json();
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
}

/**
 * Obtiene la información del usuario desde Google
 */
export async function getUserInfo(accessToken: string): Promise<any> {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
}

/**
 * Verifica si un token de ID es válido
 */
export function verifyIdToken(idToken: string, clientId: string): boolean {
  // En una implementación real, deberías verificar la firma JWT
  // Esta es una implementación simplificada
  try {
    // Decodificar el token sin verificar la firma (solo para desarrollo)
    const payload = JSON.parse(
      Buffer.from(idToken.split('.')[1], 'base64').toString('utf-8')
    );

    // Verificar audiencia (client_id)
    if (payload.aud !== clientId) {
      return false;
    }

    // Verificar expiración
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return false;
  }
}
