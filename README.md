# UniBalance - Aplicación de Bienestar Mental y Cognitivo 🧠💚

**UniBalance** es una aplicación móvil desarrollada con React Native y Expo que ofrece herramientas integrales para mejorar el bienestar mental y cognitivo de los usuarios. La aplicación combina ejercicios de relajación, entrenamiento cognitivo y seguimiento emocional en una plataforma unificada.

## 📋 Funcionalidades Principales

### 🧘 **Ejercicios de Respiración Guiada**
- Rutinas de respiración personalizables (1-5 minutos)
- Audio guía con música relajante
- Animaciones visuales sincronizadas
- Ciclos de inhalación y exhalación configurables

### 🎯 **Trivia Interactiva de Salud**
- Preguntas sobre nutrición, ejercicio, salud mental y sueño
- Sistema de puntuación y retroalimentación
- Recomendaciones personalizadas basadas en respuestas
- Múltiples categorías temáticas

### 📚 **Entrenador de Lectura Rápida**
- Técnica RSVP (Rapid Serial Visual Presentation)
- Velocidades ajustables (50-1000 palabras por minuto)
- Textos variados con comprensión lectora
- Seguimiento de progreso y estadísticas

### 🏃‍♂️ **Pausas Ergonómicas Activas**
- **Descanso Visual**: Ejercicios oculares guiados con animaciones
- **Estiramientos Cervicales**: Rutinas para cuello y espalda
  - Flexión de barbilla
  - Flexión hacia adelante
  - Postura gato-vaca en silla

### 😊 **Registro de Estado Emocional**
- Selector visual de emociones con emojis
- Escala de intensidad emocional
- Registro histórico de estados anímicos
- Gráficos de seguimiento temporal

### 🎤 **Práctica de Exposición Oral**
- Grabación de video con temporizador
- Indicador visual de volumen de voz
- Guardado automático en galería
- Herramienta para mejorar habilidades de presentación

## 🛠️ Tecnologías Utilizadas

- **React Native**: Framework principal
- **Expo**: Plataforma de desarrollo
- **React Navigation**: Navegación entre pantallas
- **Expo AV**: Reproducción de audio
- **Expo Camera**: Funcionalidad de cámara
- **React Native Reanimated**: Animaciones fluidas
- **React Native Chart Kit**: Gráficos estadísticos
- **TypeScript**: Tipado estático

## 📱 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- Expo CLI
- Emulador Android/iOS o dispositivo físico

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Donald1526/IHC-app.git
cd IHC-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo**
```bash
npm start
# o
expo start

# Para usar túnel (recomendado para dispositivos físicos)
expo start --tunnel
```

4. **Ejecutar en dispositivo específico**
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

### 📲 Conexión con Dispositivos Físicos

Para probar en dispositivos físicos, recomendamos usar el túnel de Expo:

```bash
expo start --tunnel
```

**Ventajas del túnel:**
- Funciona desde cualquier red (no requiere estar en la misma WiFi)
- Ideal para pruebas con dispositivos físicos
- Permite compartir la app fácilmente con otros desarrolladores
- Funciona detrás de firewalls corporativos

**Nota:** El túnel puede ser más lento que la conexión LAN, pero es más confiable para el desarrollo con dispositivos reales.

## � Estructura del Proyecto

```
├── app/                          # Pantallas principales
│   ├── index.js                 # Pantalla de inicio
│   ├── breathing-exercise.js     # Ejercicios de respiración
│   ├── trivia.js                # Trivia interactiva
│   ├── speed-reader.js          # Lectura rápida
│   ├── PausasActivas.js         # Menú de pausas activas
│   ├── DescansoVisualScreen.js  # Ejercicios oculares
│   ├── EstiramientosScreen.js   # Estiramientos
│   ├── emotion-simulator.js     # Registro emocional
│   ├── emotion-chart.js         # Gráficos emocionales
│   └── camera.js                # Grabación de video
├── assets/                       # Recursos multimedia
│   ├── audio/                   # Archivos de audio
│   ├── images/                  # Imágenes e iconos
│   └── fonts/                   # Fuentes personalizadas
├── data/                        # Datos de la aplicación
│   ├── triviaData.js           # Preguntas de trivia
│   └── readingTexts.js         # Textos para lectura
└── components/                  # Componentes reutilizables
```

## 🎨 Diseño y UX

La aplicación utiliza un diseño moderno con:
- **Color principal**: #5ECBC2 (turquesa calmante)
- **Animaciones suaves** con React Native Reanimated
- **Iconografía consistente** con Ionicons
- **Navegación intuitiva** con gestos nativos
- **Feedback haptico** para mejor experiencia

## 📊 Características Técnicas

- **Multiplataforma**: iOS, Android y Web
- **Offline Ready**: Funciona sin conexión a internet
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Rendimiento optimizado**: Animaciones nativas de 60fps
- **Gestión de permisos**: Cámara, micrófono y almacenamiento

## 🎯 Público Objetivo

- Estudiantes universitarios
- Profesionales que trabajan frente a computadoras
- Personas interesadas en bienestar mental
- Usuarios que buscan herramientas de productividad
- Cualquier persona interesada en mejorar su salud cognitiva

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

**Desarrollador**: Donald1526  
**Repositorio**: [https://github.com/Donald1526/IHC-app](https://github.com/Donald1526/IHC-app)

## 🎥 Demo

Para ver la aplicación en funcionamiento, puedes ver el video demo:
[https://www.youtube.com/watch?v=U23lNFm_J70](https://www.youtube.com/watch?v=U23lNFm_J70)

---

*Desarrollado con ❤️ para promover el bienestar mental y cognitivo*