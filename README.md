# Simple Google OAuth2
### by @blissito & @fixtergeek

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Una biblioteca isomórfica y sin dependencias para autenticación con Google OAuth2. Funciona tanto en navegadores como en Node.js.

## Características

- 🚀 **Sin dependencias**: Usa solo APIs nativas
- 🌐 **Isomórfica**: Funciona en navegador y Node.js
- 🔒 **Segura**: Validación de tokens y manejo seguro de sesiones
- ⚡ **Ligera**: Solo el código necesario para autenticación con Google
- 📦 **Tipada**: TypeScript listo para usar

## Instalación

```bash
npm install simple-google-oauth2
# o
yarn add simple-google-oauth2
```

## Uso en el Navegador (React)

```tsx
import { useGoogleLogin } from 'simple-google-oauth2';

function LoginButton() {
  const { login, handleCallback } = useGoogleLogin({
    clientId: 'TU_CLIENT_ID',
    redirectUri: 'http://localhost:3000/auth/callback',
    scope: 'profile email',
  });

  // Manejar el callback de autenticación
  React.useEffect(() => {
    handleCallback().then(({ code, state }) => {
      if (code) {
        // Enviar código al servidor para intercambiarlo por tokens
        fetch('/api/auth/google', {
          method: 'POST',
          body: JSON.stringify({ code, state }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    });
  }, [handleCallback]);

  return (
    <button onClick={login}>
      Iniciar sesión con Google
    </button>
  );
}
```

## Uso en el Servidor (Node.js/Remix)

```typescript
import { handleGoogleLogin } from 'simple-google-oauth2';

// En tu manejador de ruta (ejemplo con Express)
app.post('/api/auth/google', async (req, res) => {
  try {
    const { code } = req.body;
    
    const { tokens, user } = await handleGoogleLogin({
      code,
      clientId: 'TU_CLIENT_ID',
      clientSecret: 'TU_CLIENT_SECRET',
      redirectUri: 'http://localhost:3000/auth/callback',
    });

    // Guardar tokens en la sesión o base de datos
    req.session.user = user;
    req.session.tokens = tokens;
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(400).json({ error: 'Error en autenticación' });
  }
});
```

## Configuración de Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a "APIs y Servicios" > "Pantalla de consentimiento"
4. Configura la pantalla de consentimiento
5. Ve a "Credenciales" y crea un nuevo ID de cliente OAuth
6. Agrega los URIs de redirección autorizados:
   - `http://localhost:3000/auth/callback` (desarrollo)
   - `https://tudominio.com/auth/callback` (producción)

## API

### Hook `useGoogleLogin` (Cliente)

```typescript
const { login, handleCallback, subscribe } = useGoogleLogin({
  clientId: string;
  redirectUri: string;
  scope?: string | string[];
  responseType?: string;
  accessType?: 'online' | 'offline';
  prompt?: 'none' | 'consent' | 'select_account';
  state?: string;
  includeGrantedScopes?: boolean;
  loginHint?: string;
  nonce?: string;
  hd?: string;
});
```

### Función `handleGoogleLogin` (Servidor)

```typescript
const { tokens, user } = await handleGoogleLogin({
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
});
```

## Contribuir

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/awesome-feature`)
3. Haz commit de tus cambios (`git commit -am 'Add some awesome feature'`)
4. Haz push a la rama (`git push origin feature/awesome-feature`)
5. Abre un Pull Request

## Licencia

MIT © @blissito & @fixtergeek
