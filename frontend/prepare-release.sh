#!/bin/bash

# Script de Preparación para Release - SOSPECHA
# Este script automatiza los pasos previos a la publicación

echo "🎮 SOSPECHA - Preparación para Release"
echo "======================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Debe ejecutar este script desde /app/frontend${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Paso 1: Verificando prerequisitos...${NC}"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
fi

# Verificar Yarn
if ! command -v yarn &> /dev/null; then
    echo -e "${RED}❌ Yarn no está instalado${NC}"
    exit 1
else
    YARN_VERSION=$(yarn --version)
    echo -e "${GREEN}✅ Yarn: $YARN_VERSION${NC}"
fi

# Verificar EAS CLI
if ! command -v eas &> /dev/null; then
    echo -e "${YELLOW}⚠️  EAS CLI no está instalado${NC}"
    echo "Instalando EAS CLI..."
    npm install -g eas-cli
fi

EAS_VERSION=$(eas --version)
echo -e "${GREEN}✅ EAS CLI: $EAS_VERSION${NC}"
echo ""

# Login en Expo
echo -e "${YELLOW}📋 Paso 2: Verificando login en Expo...${NC}"
if ! eas whoami &> /dev/null; then
    echo "Por favor, inicia sesión en Expo:"
    eas login
else
    EXPO_USER=$(eas whoami)
    echo -e "${GREEN}✅ Logged in as: $EXPO_USER${NC}"
fi
echo ""

# Instalar dependencias
echo -e "${YELLOW}📋 Paso 3: Instalando dependencias...${NC}"
yarn install
echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

# Verificar configuración
echo -e "${YELLOW}📋 Paso 4: Verificando configuración...${NC}"

# Verificar app.json
if [ ! -f "app.json" ]; then
    echo -e "${RED}❌ app.json no encontrado${NC}"
    exit 1
else
    echo -e "${GREEN}✅ app.json encontrado${NC}"
fi

# Verificar eas.json
if [ ! -f "eas.json" ]; then
    echo -e "${YELLOW}⚠️  eas.json no encontrado. Creando...${NC}"
    eas build:configure
fi
echo -e "${GREEN}✅ eas.json configurado${NC}"
echo ""

# Verificar archivos legales
echo -e "${YELLOW}📋 Paso 5: Verificando archivos legales...${NC}"

if [ ! -f "privacy-policy.html" ]; then
    echo -e "${RED}❌ privacy-policy.html no encontrado${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Política de privacidad encontrada${NC}"
fi

if [ ! -f "terms-of-service.html" ]; then
    echo -e "${RED}❌ terms-of-service.html no encontrado${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Términos de servicio encontrados${NC}"
fi
echo ""

# Mostrar siguiente pasos
echo ""
echo -e "${GREEN}✅ ¡Preparación completa!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}📱 PRÓXIMOS PASOS:${NC}"
echo ""
echo "1. Hostea los archivos HTML:"
echo "   - privacy-policy.html"
echo "   - terms-of-service.html"
echo "   En: https://tu-dominio.com/"
echo ""
echo "2. Actualiza las URLs en las consolas de desarrolladores"
echo ""
echo "3. Para BUILD de iOS:"
echo "   $ eas build --platform ios --profile production"
echo ""
echo "4. Para BUILD de Android:"
echo "   $ eas build --platform android --profile production"
echo ""
echo "5. Para SUBMIT a las tiendas:"
echo "   $ eas submit --platform ios --latest"
echo "   $ eas submit --platform android --latest"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}📚 Documentación completa en:${NC}"
echo "   - DEPLOYMENT_GUIDE.md"
echo "   - STORE_LISTING_TEXTS.md"
echo "   - SOSPECHA_README.md"
echo ""
echo -e "${GREEN}🎉 ¡Buena suerte con tu lanzamiento!${NC}"
echo ""
