# 🚀 GUÍA COMPLETA DE DEPLOYMENT - SOSPECHA

## 📋 TABLA DE CONTENIDOS

1. [Prerequisitos](#prerequisitos)
2. [Configuración Inicial](#configuración-inicial)
3. [Build para iOS](#build-para-ios)
4. [Build para Android](#build-para-android)
5. [Publicar en App Store](#publicar-en-app-store)
6. [Publicar en Google Play](#publicar-en-google-play)
7. [Troubleshooting](#troubleshooting)

---

## 🛠️ PREREQUISITOS

### Cuentas Necesarias:

✅ **Apple Developer Account** ($99/año)
- Registro: https://developer.apple.com
- Tiempo de aprobación: 24-48 horas

✅ **Google Play Console** ($25 único)
- Registro: https://play.google.com/console
- Aprobación inmediata

✅ **Cuenta de Expo**
- Registro: https://expo.dev
- Gratuito

### Software Necesario:

```bash
# Verificar Node.js
node --version  # Necesitas v18+

# Verificar Yarn
yarn --version

# Instalar EAS CLI
npm install -g eas-cli

# Verificar instalación
eas --version
```

---

## ⚙️ CONFIGURACIÓN INICIAL

### Paso 1: Exportar el Proyecto desde Emergent

1. En Emergent, click en **"Save to GitHub"**
2. Clona el repositorio en tu máquina local:

```bash
git clone <tu-repositorio-url>
cd sospecha-app
cd frontend
```

### Paso 2: Instalar Dependencias

```bash
yarn install
```

### Paso 3: Login en Expo

```bash
eas login
```

Ingresa tu email y contraseña de Expo.

### Paso 4: Configurar el Proyecto

```bash
eas build:configure
```

Esto creará el archivo `eas.json` (ya está creado, pero este comando lo verifica).

### Paso 5: Verificar app.json

Asegúrate de que tu `app.json` tenga:

```json
{
  "expo": {
    "name": "Sospecha",
    "slug": "sospecha",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.sospecha.app",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.sospecha.app",
      "versionCode": 1
    }
  }
}
```

---

## 🍎 BUILD PARA iOS

### Paso 1: Preparar Credenciales de Apple

**Opción A: Dejar que EAS lo maneje (Recomendado)**

```bash
eas build --platform ios
```

EAS te pedirá:
- Apple ID
- Contraseña de aplicación específica (no tu contraseña normal)
- Team ID (si tienes varios)

EAS creará automáticamente:
- Certificado de distribución
- Perfil de aprovisionamiento
- Push notification keys

**Opción B: Credenciales Manuales**

Si prefieres control total:

1. Ve a https://developer.apple.com/account
2. Crea certificados manualmente
3. Configura en `credentials.json`

### Paso 2: Iniciar Build de iOS

```bash
# Build de producción para App Store
eas build --platform ios --profile production
```

**Opciones durante el build:**
- Build type: `app-store` (para publicación)
- Automatic credentials: `Yes` (primera vez)

**Tiempo estimado:** 15-30 minutos

### Paso 3: Monitorear el Build

Visita el link que EAS te proporciona:
```
https://expo.dev/accounts/[tu-cuenta]/projects/sospecha/builds/[build-id]
```

Ahí verás:
- Estado del build
- Logs en tiempo real
- Errores (si los hay)

### Paso 4: Descargar el IPA

Cuando el build termine:

```bash
# Descargar automáticamente
eas build:download --platform ios --latest

# O descarga desde el dashboard de Expo
```

Obtendrás un archivo `.ipa`

### Paso 5: (Opcional) Probar con TestFlight

Antes de publicar, prueba con TestFlight:

```bash
eas submit --platform ios --latest
```

Esto subirá a TestFlight automáticamente.

---

## 🤖 BUILD PARA ANDROID

### Paso 1: Configurar Keystorenuevo

**Opción A: Dejar que EAS lo maneje (Recomendado)**

```bash
eas build --platform android
```

EAS creará y manejará automáticamente:
- Keystore
- Claves de firma
- Todo almacenado seguramente

**Opción B: Keystore Manual**

Si ya tienes un keystore:

```bash
eas credentials
```

Y sigue las instrucciones para subir tu keystore.

### Paso 2: Iniciar Build de Android

```bash
# Build de producción (AAB recomendado)
eas build --platform android --profile production
```

**Opciones:**
- Build type: `app-bundle` (AAB - recomendado para Play Store)
- O `apk` (para distribución directa)

**Tiempo estimado:** 10-20 minutos

### Paso 3: Monitorear el Build

Similar a iOS, visita:
```
https://expo.dev/accounts/[tu-cuenta]/projects/sospecha/builds/[build-id]
```

### Paso 4: Descargar el AAB/APK

```bash
# Descargar AAB
eas build:download --platform android --latest

# Específico para APK
eas build --platform android --profile preview
```

Obtendrás:
- `.aab` para Google Play Store
- `.apk` para instalación directa

---

## 🍏 PUBLICAR EN APP STORE

### Paso 1: Crear la App en App Store Connect

1. Ve a https://appstoreconnect.apple.com
2. Click en **"My Apps"** → **"+"** → **"New App"**
3. Completa:
   - **Platform:** iOS
   - **Name:** Sospecha
   - **Primary Language:** Spanish
   - **Bundle ID:** com.sospecha.app
   - **SKU:** sospecha-ios-app
   - **User Access:** Full Access

### Paso 2: Subir el Build

**Opción A: Usar EAS Submit (Recomendado)**

```bash
eas submit --platform ios --latest
```

EAS subirá automáticamente a App Store Connect.

**Opción B: Usar Transporter (macOS)**

1. Descarga Transporter desde Mac App Store
2. Arrastra el archivo `.ipa`
3. Click en **"Deliver"**

**Opción C: Usar Xcode**

1. Abre Xcode
2. Window → Organizer
3. Arrastra el `.ipa`
4. Click **"Distribute App"**

### Paso 3: Completar Información de la App

En App Store Connect:

#### App Information:
- **Name:** Sospecha
- **Subtitle:** Confía o desconfía
- **Category:** Games / Board
- **Secondary Category:** Games / Strategy

#### Pricing and Availability:
- **Price:** Free
- **Availability:** All countries

#### App Privacy:
- Click **"Get Started"**
- Responde el cuestionario sobre datos recopilados
- Para SOSPECHA:
  - ✅ User ID (para cuentas)
  - ✅ Game Data (estadísticas)
  - ❌ Location, Contacts, etc.

#### Screenshots:
Sube capturas para:
- iPhone 6.7" (1290x2796): 3-10 imágenes
- iPhone 6.5" (1242x2688): 3-10 imágenes
- iPad Pro 12.9" (2048x2732): 3-10 imágenes

#### App Description:
Copia el texto de `STORE_LISTING_TEXTS.md`

#### Keywords:
```
juego social,deducción,multijugador,impostor,amigos,estrategia
```

#### Support URL:
```
https://sospecha-game.com
```

#### Privacy Policy URL:
```
https://sospecha-game.com/privacy-policy.html
```

### Paso 4: Configurar Age Rating

1. Click en **"Age Rating"**
2. Responde el cuestionario:
   - Violence: None
   - Sexual Content: None
   - Profanity: None
   - Horror: None
   - Gambling: None
3. Resultado esperado: **4+**

### Paso 5: Seleccionar el Build

1. En **"Build"**, click **"+"**
2. Selecciona el build que subiste
3. Espera procesamiento (5-30 minutos)

### Paso 6: Enviar para Revisión
1. Verifica que todo esté completo
2. Click **"Submit for Review"**
3. Responde preguntas adicionales:
   - Export Compliance: No (si no usas encriptación fuerte)
   - Advertising Identifier: No
4. Click **"Submit"**

**Tiempo de revisión:** 1-3 días típicamente

---

## 🤖 PUBLICAR EN GOOGLE PLAY

### Paso 1: Crear la App en Play Console

1. Ve a https://play.google.com/console
2. Click **"Create app"**
3. Completa:
   - **App name:** Sospecha
   - **Default language:** Spanish
   - **App or game:** Game
   - **Free or paid:** Free
4. Acepta las declaraciones
5. Click **"Create app"**

### Paso 2: Configurar Store Listing

#### App details:
- **App name:** Sospecha
- **Short description:** (80 caracteres)
  ```
  Juego de deducción social. 4-8 jugadores. ¡Descubre al impostor!
  ```
- **Full description:** Copia de `STORE_LISTING_TEXTS.md`

#### Graphics:
- **App icon:** 512x512px
- **Feature graphic:** 1024x500px
- **Phone screenshots:** 2-8 imágenes (min 320px)
- **7-inch tablet:** (Opcional)
- **10-inch tablet:** (Opcional)

#### Categorization:
- **App category:** Games / Board
- **Tags:** Multiplayer, Strategy, Social

#### Contact details:
- **Email:** support@sospecha-game.com
- **Website:** https://sospecha-game.com
- **Privacy policy:** https://sospecha-game.com/privacy-policy.html

### Paso 3: Configurar Content Rating

1. Va a **"Content rating"**
2. Click **"Start questionnaire"**
3. Categoria: **Game**
4. Responde:
   - Violence: None
   - Sexual content: None
   - Drugs: None
   - Language: None
   - Horror: None
5. Resultado esperado: **PEGI 3** / **Everyone**

### Paso 4: Configurar App Content

#### Privacy Policy:
- URL: `https://sospecha-game.com/privacy-policy.html`

#### Ads:
- **Contains ads:** No

#### App access:
- **All functionality available:** Yes

#### Data safety:
1. Click **"Start"**
2. Datos recopilados:
   - ✅ User account info
   - ✅ App activity (game statistics)
   - ❌ Location, Contacts, etc.
3. Data usage: Game functionality
4. Data sharing: Only with Firebase

### Paso 5: Subir el Build

1. Va a **"Release"** → **"Production"**
2. Click **"Create new release"**
3. Sube el archivo `.aab`:

**Opción A: Desde EAS**
```bash
eas submit --platform android --latest
```

**Opción B: Manual**
- Arrastra el archivo `.aab` descargado

4. **Release name:** 1.0.0 (1)
5. **Release notes (en Español):**
   ```
   🎉 Lanzamiento inicial de SOSPECHA
   
   ✅ 6 tipos de misiones
   ✅ Partidas de 4-8 jugadores
   ✅ Sistema de roles secretos
   ✅ Marcadores de confianza
   ✅ Estadísticas personales
   
   ¡Gracias por descargar!
   ```

### Paso 6: Revisar y Publicar

1. Click **"Review release"**
2. Verifica todos los detalles
3. Click **"Start rollout to Production"**
4. Confirma

**Opciones de rollout:**
- **Full rollout:** 100% de usuarios inmediatamente
- **Staged rollout:** Gradualmente (10%, 25%, 50%, 100%)

**Tiempo de revisión:** Algunas horas a 1-2 días

---

## 🔧 TROUBLESHOOTING

### Error: "Build failed"

**Causa:** Problema de configuración o dependencias

**Solución:**
```bash
# Ver logs detallados
eas build --platform ios --profile production --local

# Limpiar cache
rm -rf node_modules
yarn install
```

### Error: "Invalid Bundle Identifier"

**Causa:** Bundle ID ya registrado o inválido

**Solución:**
1. Verifica en Apple Developer que el Bundle ID existe
2. Asegúrate de que `app.json` coincide
3. Usa un Bundle ID único: `com.tuempresa.sospecha`

### Error: "Missing compliance"

**Causa:** Apple requiere declaración de encriptación

**Solución:**
Añade a `app.json`:
```json
{
  "expo": {
    "ios": {
      "config": {
        "usesNonExemptEncryption": false
      }
    }
  }
}
```

### Error: "Keystore not found"

**Causa:** Android keystore no configurado

**Solución:**
```bash
eas credentials
# Selecciona "Set up new keystore"
```

### Error: "Screenshots wrong size"

**Causa:** Tamaños de capturas incorrectos

**Solución:**
- iOS: Usar exactamente 1290x2796 para iPhone 6.7"
- Android: Entre 320px-3840px de ancho
- Usar herramientas de redimensionado

---

## ✅ CHECKLIST FINAL

### Antes de Publicar:

- [ ] Build de producción exitoso
- [ ] Probado en dispositivos reales
- [ ] Todas las funciones operativas
- [ ] Sin contenido de prueba
- [ ] Política de privacidad hospedada
- [ ] Términos de servicio hospedados
- [ ] Email de soporte configurado
- [ ] Capturas de pantalla de calidad
- [ ] Descripciones completas
- [ ] Clasificación de edad correcta
- [ ] Íconos en todos los tamaños
- [ ] Firebase configurado (si aplica)

### Después de Publicar:

- [ ] Monitorear reviews
- [ ] Responder a usuarios
- [ ] Trackear crashes (Firebase Crashlytics)
- [ ] Planear actualizaciones
- [ ] Promover en redes sociales

---

## 📞 SOPORTE

**Expo Documentation:**
https://docs.expo.dev/

**EAS Build:**
https://docs.expo.dev/build/introduction/

**EAS Submit:**
https://docs.expo.dev/submit/introduction/

**App Store Connect:**
https://developer.apple.com/app-store-connect/

**Google Play Console:**
https://support.google.com/googleplay/android-developer/

---

**¡Buena suerte con tu lanzamiento!** 🎉
