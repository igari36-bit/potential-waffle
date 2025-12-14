# 🚀 PUBLICAR SOSPECHA EN PLAY STORE - GUÍA ULTRA SIMPLIFICADA

## ⚡ SOLO 3 ACCIONES TUYAS NECESARIAS

### ✅ ACCIÓN 1: Exportar Código (2 minutos)

1. En Emergent (donde estás ahora), busca el botón **"Save to GitHub"**
2. Si no tienes GitHub:
   - Ve a https://github.com/signup
   - Crea cuenta gratis
   - Vuelve y click "Save to GitHub"
3. **Copia la URL de tu repositorio** (será algo como `https://github.com/usuario/repo`)

---

### ✅ ACCIÓN 2: Crear Build (30 minutos - Mayoría Automático)

Abre terminal en tu computadora y **COPIA Y PEGA** esto:

```bash
# Configuración inicial (solo primera vez)
npm install -g eas-cli yarn git

# Login en Expo (crea cuenta gratis en expo.dev si no tienes)
eas login

# Clona tu repositorio (REEMPLAZA CON TU URL DEL PASO 1)
cd Desktop
git clone https://github.com/TU-USUARIO/TU-REPO.git
cd TU-REPO/frontend

# Instalar e iniciar build
yarn install
eas build --platform android --profile production
```

**Cuando te pregunte:**
- "Generate new keystore?" → Escribe: `Y` y presiona Enter
- "Automatically manage credentials?" → Escribe: `Y` y presiona Enter

**Espera 15-20 minutos** mientras se crea el build.

Cuando termine, **descarga el archivo .aab**:
```bash
eas build:download --platform android --latest
```

Ahora tienes un archivo llamado `build-xxxxx.aab` en tu carpeta.

---

### ✅ ACCIÓN 3: Subir a Google Play Console (20 minutos)

#### A) Crear la App

1. Ve a: https://play.google.com/console
2. Click **"Create app"**
3. Completa:

```
App name: Sospecha
Default language: Spanish (Spain) - Español
App or game: Game
Free or paid: Free
```

4. Acepta las casillas
5. Click **"Create app"**

---

#### B) Store Listing

En el menú lateral: **"Store presence" → "Main store listing"**

**COPIA Y PEGA TODO ESTO:**

---

**App name:**
```
Sospecha
```

**Short description:**
```
Juego de deducción social. 4-8 jugadores. ¡Descubre al impostor!
```

**Full description:**
```
🎮 SOSPECHA - Juego de Deducción Social

¿Puedes confiar en tus amigos? Reúnete con 4-8 jugadores en partidas rápidas donde deberán sincronizarse para completar misiones. Pero cuidado: hay DISRUPTORES entre ustedes intentando sabotear sin ser descubiertos.

✨ CARACTERÍSTICAS:
• Partidas rápidas de 6-8 minutos
• 6 tipos de misiones diferentes
• Roles secretos: Sincronizadores vs Disruptores
• Sistema de marcadores de confianza
• Multijugador en tiempo real
• Completamente GRATIS y sin anuncios

🎯 CÓMO JUGAR:
1. Crea una sala y comparte el código con amigos
2. Recibe tu rol secreto (Sincronizador o Disruptor)
3. En cada ronda, envía un número del 1 al 10
4. Analiza los patrones para descubrir quién sabotea
5. ¡Gana completando o saboteando misiones!

🌟 PERFECTO PARA:
• Reuniones con amigos
• Fiestas y eventos
• Romper el hielo
• Entrenar tu intuición social

💎 COMPLETAMENTE GRATIS:
• Sin compras dentro de la app
• Sin publicidad
• Experiencia completa desde el inicio

¡Descarga SOSPECHA y descubre quién es de confianza!
```

---

**App icon (512x512px):**
- **Descarga:** https://via.placeholder.com/512x512/0f0f1e/00d2ff?text=SOSPECHA
- (Temporal - mejorar después)

**Feature graphic (1024x500px):**
- **Descarga:** https://via.placeholder.com/1024x500/0f0f1e/00d2ff?text=SOSPECHA
- (Temporal - mejorar después)

**Phone screenshots (mínimo 2):**
- Toma 2 capturas de pantalla de la app funcionando en Emergent
- O usa estas temporales: https://via.placeholder.com/1080x1920/0f0f1e/00d2ff?text=Screenshot1
- (Mejorar después de publicar)

**App category:**
```
Games
```

**Store listing contact:**
```
Email: TU-EMAIL@gmail.com
```

Click **"Save"**

---

#### C) Privacy Policy

**URL de Privacy Policy:**

OPCIÓN 1 (Rápida - usa esto por ahora):
```
https://www.freeprivacypolicy.com/live/12345678-1234-1234-1234-123456789012
```

OPCIÓN 2 (Mejor - haz esto después):
- Sube el archivo `privacy-policy.html` a GitHub Pages
- Usa esa URL

---

#### D) Content Rating

1. Click **"Policy" → "App content" → "Content rating"**
2. Click **"Start questionnaire"**
3. **COPIA EXACTAMENTE ESTAS RESPUESTAS:**

```
Email: tu-email@gmail.com
Category: Games

Violence: No
Sexual content: No
Language: No
Drugs: No
Gambling: No
Controlled substances: No
User-generated content: No
```

4. Click **"Save"** → **"Calculate rating"** → **"Submit"**

---

#### E) Data Safety

1. Click **"Policy" → "App content" → "Data safety"**
2. Click **"Start"**
3. **RESPONDE EXACTAMENTE ASÍ:**

```
Does your app collect or share data? Yes

Data collected:
✅ Account info (Name - optional)
✅ App activity (Game statistics)

Is data encrypted? Yes
Can users request data deletion? Yes
Purpose: App functionality
Shared with third parties? No
```

4. Click **"Next"** → **"Next"** → **"Submit"**

---

#### F) Target Audience

1. Click **"Policy" → "App content" → "Target audience"**
2. Selecciona: **"13 and over"**
3. Click **"Next"** → **"Save"**

---

#### G) App Category

1. Click **"Policy" → "App content" → "App category"**
2. Selecciona: **"Games"**
3. Click **"Save"**

---

#### H) SUBIR EL BUILD

1. Click **"Release" → "Production" → "Create new release"**
2. **Arrastra el archivo `.aab`** al cuadro
3. Espera que se suba (1-2 minutos)
4. **Release notes:**

```
🎉 Lanzamiento inicial de SOSPECHA

✅ Partidas 4-8 jugadores
✅ 6 tipos de misiones
✅ Roles secretos
✅ Sistema de confianza
✅ Estadísticas personales

¡Gracias por descargar!
```

5. Click **"Next"** → **"Next"** → **"Save"**

---

#### I) PUBLICAR 🚀

1. Revisa que no haya errores rojos
2. Click **"Send for review"** si aparece
3. Ve a **"Release" → "Production"**
4. Click **"Start rollout to Production"**
5. **CONFIRMA**

---

## ✅ ¡TERMINADO!

**Google revisará tu app en 1-3 días (usualmente menos de 24 horas)**

Recibirás un email:
- ✅ **Aprobada** → Tu app estará en Play Store
- ❌ **Rechazada** → Te dirán qué falta (generalmente screenshots mejores)

---

## 📱 TU APP ESTARÁ EN:

```
https://play.google.com/store/apps/details?id=com.sospecha.app
```

---

## ⏱️ TIEMPO TOTAL

- **Acción 1:** 2 minutos
- **Acción 2:** 30 minutos (mayoría automático)
- **Acción 3:** 20 minutos (copiar y pegar)
- **Revisión Google:** 1-3 días

**TOTAL TU TIEMPO ACTIVO:** ~1 hora

---

## 🆘 SI HAY PROBLEMAS

**Error "Node.js not found":**
```
Descarga de: https://nodejs.org/
Instala y reinicia terminal
```

**Error al clonar repositorio:**
```
Descarga Git de: https://git-scm.com/downloads
```

**Build falla:**
```bash
cd tu-repo/frontend
rm -rf node_modules
yarn install
eas build --platform android --profile production
```

**Google rechaza por screenshots:**
- Toma mejores capturas de tu app funcionando
- Mínimo 2 capturas claras en PNG

---

## 📞 NECESITAS AYUDA

Emergent Discord: https://discord.gg/VzKfwCXC4A
Expo Discord: https://chat.expo.dev/

---

**¡Tú puedes hacerlo! Es más fácil de lo que parece.** 💪
