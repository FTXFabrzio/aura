# 📡 Protocolo de Conexión Aura (Para APP Operate)

Este documento detalla cómo la aplicación **Operate** debe comunicarse con el panel de control **Aura** para obtener dinámicamente sus credenciales de base de datos.

## 🔑 1. Variables de Entorno Requeridas

En el archivo `.env` de la aplicación **Operate**, necesitas configurar lo siguiente:

```env
# URL de tu despliegue de Aura en Vercel
AURA_DISCOVERY_URL=https://fortex-aura-panel.vercel.app/api/v1/resolve

# Secreto del Producto (Obtenido en el panel Aura > Productos SaaS)
# Este secreto identifica que esta petición viene de la APP "Operate"
X_AURA_SECRET=sk_operate_prod_secret_123
```

---

## 🔄 2. Flujo de Identificación y Conexión

Cuando un usuario intenta iniciar sesión (ej: `hdiaz@ht-elevadores.com`):

### Paso A: Extraer el Identificador (@domain)
La APP Operate debe extraer la parte del dominio del correo.
- Input: `hdiaz@ht-elevadores.com`
- Identificador: `ht-elevadores.com`

### Paso B: Llamada de "Discovery" a Aura
La APP hace una petición HTTP GET a Aura enviando su identificador y su secreto de producto.

**Request:**
```http
GET https://fortex-aura-panel.vercel.app/api/v1/resolve/ht-elevadores.com
X-AURA-SECRET: sk_operate_prod_secret_123
```

### Paso C: Respuesta de Aura
Si el usuario existe, tiene suscripción activa y tiene infraestructura configurada, Aura responderá:

**Response (JSON):**
```json
{
  "tenantId": 1,
  "productId": 1,
  "dbUrl": "libsql://fortex-operate-xyz.turso.io",
  "dbToken": "eyJhbG..." // Token descifrado y listo para usar
}
```

---

## 🏗️ 3. Implementación Sugerida (Node.js)

```typescript
import { createClient } from "@libsql/client";

async function connectToTenant(email: string) {
  // 1. Obtener identificador
  const domain = email.split('@')[1];

  // 2. Consultar a Aura
  const response = await fetch(`${process.env.AURA_DISCOVERY_URL}/${domain}`, {
    headers: {
      'X-AURA-SECRET': process.env.X_AURA_SECRET
    }
  });

  if (!response.ok) {
    throw new Error("No se pudo resolver la conexión para este cliente.");
  }

  const { dbUrl, dbToken } = await response.json();

  // 3. Crear cliente de Turso dinámico
  const client = createClient({
    url: dbUrl,
    authToken: dbToken
  });

  return client;
}
```

---

## 🚀 4. Despliegue en Vercel (Panel Aura)

Para subir el panel actual a Vercel, sigue estos pasos:

### Variables de Entorno en Vercel:
Configura estas variables en el Dashboard de Vercel para el proyecto `backend`:

- `DATABASE_URL`: Tu URL de Turso (Donde vive Aura).
- `DATABASE_AUTH_TOKEN`: Tu Token de Turso.
- `AURA_MASTER_KEY`: Tu llave de cifrado (32 bytes hex).
- `AURA_INTERNAL_API_KEY`: Tu llave interna para el panel.

### Estructura de Proyecto:
Vercel detectará el `package.json` en la raíz. Asegúrate de que el script de build construya tanto el frontend como el backend.

¿Quieres que te prepare el archivo `vercel.json` para el despliegue automático?
