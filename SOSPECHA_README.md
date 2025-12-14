# 🎮 SOSPECHA - Juego Social de Deducción

**Confía o desconfía**

Juego multijugador en tiempo real donde los jugadores deben sincronizarse para completar misiones, pero hay disruptores entre ellos intentando sabotear sin ser descubiertos.

---

## 🌟 Características Principales

### MVP Implementado

✅ **Sistema de Partidas**
- Crear y unirse a partidas con código de 6 dígitos
- 4-8 jugadores por partida
- Lobby de espera con visualización de jugadores

✅ **Mecánica de Juego**
- 6 rondas de juego intenso
- 6 tipos diferentes de misiones
- Sistema de roles secretos (Sincronizadores vs Disruptores)
- Decisiones simultáneas y anónimas
- Marcadores de confianza para análisis de jugadores

✅ **Fases del Juego**
1. **Misión**: Ver el objetivo de la ronda (10s)
2. **Decisión**: Enviar señal (número 1-10) en secreto (20s)
3. **Resultado**: Ver resultado y análisis (15s)
4. **Confianza**: Marcar jugadores como confiables/sospechosos (15s)

✅ **Experiencia iOS y Android**
- SafeAreaView para compatibilidad con notch/dynamic island
- Haptic feedback en iOS
- Diseño responsivo para móviles
- Interfaz nativa con React Native

✅ **Resultados Finales**
- Revelación de roles
- Estadísticas de la partida
- Clasificación de jugadores
- MVP del juego

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

**Frontend:**
- React Native 0.79.5
- Expo 54
- Expo Router (file-based routing)
- TypeScript 5.8
- Zustand (state management)
- React Native Safe Area Context
- Expo Haptics

**Backend (Preparado para Firebase):**
- FastAPI 0.115 (actualmente para testing)
- MongoDB (local, reemplazable por Firestore)
- Estado local con Zustand (MVP)

**Futuro:**
- Firebase Authentication
- Cloud Firestore (datos persistentes)
- Firebase Realtime Database (estado en tiempo real)
- Firebase Cloud Functions (lógica del servidor)

---

## 📁 Estructura del Proyecto

```
/app/frontend/
├── app/
│   ├── _layout.tsx          # Layout principal con SafeAreaView
│   ├── index.tsx             # Pantalla de inicio
│   ├── lobby.tsx             # Sala de espera
│   ├── game.tsx              # Pantalla de juego principal
│   └── result.tsx            # Resultados finales
├── src/
│   ├── components/
│   │   ├── CountdownTimer.tsx    # Temporizador visual
│   │   └── SignalSelector.tsx    # Selector de números
│   ├── store/
│   │   └── gameStore.ts          # Zustand store (estado global)
│   ├── types/
│   │   └── game.ts               # TypeScript types
│   └── utils/
│       ├── missionGenerator.ts   # Generador de misiones
│       └── gameHelpers.ts        # Funciones auxiliares
└── app.json                  # Configuración de Expo
```

---

## 🎯 Tipos de Misiones

1. **Suma Total**: "La suma debe estar entre 25-30"
2. **Números Pares**: "Al menos 3 jugadores deben enviar números pares"
3. **Secuencia**: "Envía números que formen una secuencia (3,4,5,6)"
4. **Mayoría**: "Al menos 3 jugadores deben enviar el MISMO número"
5. **Promedio**: "El promedio debe ser mayor a 5"
6. **Únicos**: "Todos los números deben ser DIFERENTES"

---

## 🚀 Cómo Ejecutar el Proyecto

### Prerequisitos
- Node.js 18+ y Yarn
- Expo CLI
- Expo Go app (para testing en dispositivo)

### Instalación

```bash
cd /app/frontend
yarn install
```

### Ejecutar en Desarrollo

```bash
yarn start
```

Esto iniciará:
- Metro bundler en puerto 3000
- Túnel de Expo para acceso remoto
- Web preview disponible

### Probar en Dispositivo

1. Abre Expo Go en tu iPhone/Android
2. Escanea el QR code
3. La app se cargará en tu dispositivo

---

## 🔥 Integración con Firebase (Próximos Pasos)

### Paso 1: Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto"
3. Nombre: "Sospecha" (o el que prefieras)
4. Habilita Google Analytics (opcional)
5. Crea el proyecto

### Paso 2: Configurar Firebase en la App

1. En Firebase Console → Project Settings → General
2. Scroll hasta "Tus apps" y click en el ícono de web `</>`
3. Registra la app con nombre "Sospecha Web"
4. Copia el `firebaseConfig`

### Paso 3: Habilitar Servicios

**Authentication:**
```
Firebase Console → Authentication → Get Started
→ Sign-in method → Habilitar:
  - Anonymous (para usuarios invitados)
  - Google (para usuarios registrados)
```

**Firestore Database:**
```
Firebase Console → Firestore Database → Create database
→ Start in test mode (por ahora)
→ Selecciona región más cercana
```

**Realtime Database:**
```
Firebase Console → Realtime Database → Create database
→ Start in test mode
```

### Paso 4: Instalar Dependencias Firebase

```bash
cd /app/frontend
yarn add firebase
```

### Paso 5: Configurar Firebase en el Código

Crear archivo `/app/frontend/src/services/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_MESSAGING_ID",
  appId: "TU_APP_ID",
  databaseURL: "https://TU_PROJECT_ID-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const realtimeDb = getDatabase(app);
```

### Paso 6: Migrar de Estado Local a Firebase

El store de Zustand actual ya está estructurado para facilitar la migración:
- Los métodos del store se convertirán en llamadas a Firebase
- El estado local se sincronizará con Firestore/Realtime DB
- La autenticación se integrará con Firebase Auth

---

## 🎨 Paleta de Colores

```
Background:     #0f0f1e  (Casi negro)
Background 2:   #1a1a2e  (Gris oscuro)
Accent:         #00d2ff  (Cyan brillante)
Success:        #00d2ff  (Sincronizadores)
Danger:         #ff4757  (Disruptores)
Text:           #ffffff  (Blanco)
Text Secondary: #888888  (Gris)
Border:         #16213e  (Gris azulado)
```

---

## 📱 Compatibilidad

✅ **iOS:**
- iPhone SE hasta iPhone 15 Pro Max
- iPad (orientación portrait)
- SafeAreaView para notch/dynamic island
- Haptic feedback nativo

✅ **Android:**
- Android 6.0+ (API 23+)
- Todos los tamaños de pantalla
- Haptic feedback con Vibration API

✅ **Web:**
- Funciona en navegadores modernos
- Responsive para móvil y desktop

---

## 🎮 Flujo del Juego

```
1. Pantalla de Inicio
   ↓
2. Crear Partida / Unirse con Código
   ↓
3. Lobby (esperar jugadores, mínimo 4)
   ↓
4. Host inicia la partida
   ↓
5. Se asignan roles secretamente
   ↓
6. RONDAS (x6):
   - Ver Misión (10s)
   - Enviar Señal (20s)
   - Ver Resultado (15s)
   - Marcar Confianza (15s)
   ↓
7. Revelación de Roles
   ↓
8. Estadísticas y MVP
   ↓
9. Jugar de Nuevo / Salir
```

---

## 🐛 Troubleshooting

### El juego no sincroniza entre jugadores
**Causa**: El MVP usa estado local (Zustand)
**Solución**: Integrar Firebase Realtime Database (ver sección de Firebase)

### Error de SafeAreaView en web
**Causa**: SafeAreaView es específico de móvil
**Solución**: Ya manejado automáticamente, funciona en web como View normal

### Haptics no funcionan en Android
**Causa**: Permisos o hardware no compatible
**Solución**: Ya manejado con Platform.OS check, se omite en web

---

## 🔜 Roadmap

### Versión Beta (Próxima)
- ✅ Integración completa con Firebase
- ✅ Autenticación (anónima + Google)
- ✅ Sincronización en tiempo real entre jugadores
- ✅ Persistencia de estadísticas de usuario
- ✅ Chat rápido con emojis predefinidos
- ✅ Sonidos y música

### Versión 1.0 (Release)
- ✅ Ranking global
- ✅ Sistema de niveles/XP
- ✅ Logros y achievements
- ✅ Salas privadas (solo amigos)
- ✅ Modos de juego adicionales (rápido, épico)
- ✅ Tutorial interactivo
- ✅ Push notifications
- ✅ Deep linking
- ✅ Modo práctica vs IA

---

## 📄 Licencia

Este proyecto es un MVP de demostración.

---

## 👥 Créditos

**Concepto y Diseño**: Juego social de deducción original
**Desarrollo**: Implementación en React Native + Expo
**Stack**: Firebase + TypeScript + Zustand

---

## 📞 Soporte

Para preguntas o reportar bugs:
- Crea un issue en el repositorio
- Documentación: Este README

---

**¡Disfruta jugando SOSPECHA!** 🎮🌐✨
