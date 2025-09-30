# HealthTech Portal - MVP Frontend

Portal web de coordinación de citas y teleasistencia médica desarrollado con React, TypeScript y Tailwind CSS.

## 🏥 Características Principales

### ✅ Funcionalidades Implementadas (Must-have)

- **Sistema de Autenticación Segura**
  - Login y registro de usuarios
  - Roles diferenciados (Pacientes y Médicos)
  - Gestión de sesiones con localStorage
  - Credenciales de prueba incluidas

- **Gestión de Citas Médicas**
  - Crear, ver y gestionar citas
  - Citas presenciales y virtuales
  - Sistema de horarios disponibles
  - Estados de citas (programada, completada, cancelada)

- **Dashboards Diferenciados**
  - Dashboard para pacientes con próximas citas e historial
  - Dashboard para médicos con agenda diaria y estadísticas
  - Navegación intuitiva y responsive

- **Gestión de Perfiles**
  - Perfil completo de usuarios
  - Información médica para doctores (especialización, licencia)
  - Actualización de datos personales

## 🎨 Diseño y Experiencia

- **Paleta de Colores Profesional**: Azules confiables y grises neutros
- **Responsive Design**: Optimizado para desktop, tablet y móvil
- **Accesibilidad**: Contraste adecuado, navegación por teclado, soporte para lectores de pantalla
- **Interfaz Limpia**: Sin bordes excesivamente redondeados ni sombras innecesarias

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19 + TypeScript
- **Estilos**: Tailwind CSS 4.x
- **Estado Global**: Zustand
- **Build Tool**: Vite
- **Linting**: ESLint

## 📱 Responsive Design

El diseño está optimizado para:
- **Desktop**: Experiencia completa con layout de múltiples columnas
- **Tablet**: Adaptación de grids y navegación
- **Mobile**: Interface optimizada para pantallas pequeñas

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base (Button, Input, Card, etc.)
│   └── layout/         # Layout principal y navegación
├── pages/              # Páginas de la aplicación
├── store/              # Estado global con Zustand
├── hooks/              # Custom hooks
├── types/              # Definiciones de TypeScript
├── utils/              # Utilidades y helpers
└── context/            # Context API para funcionalidades básicas
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repo]

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Credenciales de Prueba
```
Paciente:
Email: paciente@example.com
Password: 123456

Médico:
Email: doctor@example.com
Password: 123456
```

## 📋 Funcionalidades por Rol

### 👤 Pacientes
- Ver dashboard con próximas citas
- Crear nuevas citas médicas
- Seleccionar médico y tipo de consulta
- Ver historial de citas completadas
- Gestionar perfil personal

### 👨‍⚕️ Médicos
- Dashboard con agenda diaria
- Ver estadísticas de consultas
- Gestionar citas programadas
- Iniciar teleconsultas (interfaz preparada)
- Actualizar información profesional

## 🔧 Características Técnicas

### Componentes Reutilizables
- **Button**: Variantes, tamaños, estados de carga
- **Input**: Validación, errores, etiquetas
- **Card**: Layout flexible para contenido
- **Modal**: Diálogos y formularios
- **Badge**: Estados y categorías

### Gestión de Estado
- **Zustand**: Para estado global de citas y usuarios
- **Context API**: Para autenticación básica
- **LocalStorage**: Persistencia de sesión

### Validaciones
- Email y teléfono con regex
- Fechas futuras para citas
- Campos requeridos con feedback visual
- Disponibilidad de horarios en tiempo real

## 🎯 Próximas Funcionalidades (Nice-to-have)

- [ ] Integración con servicios de videollamada
- [ ] Sistema de notificaciones en tiempo real
- [ ] Módulo de facturación
- [ ] Análisis predictivo de cancelaciones
- [ ] Integración con sistemas EHR/FHIR

## 📱 Mobile-First Approach

- Grid responsive que se adapta a cualquier pantalla
- Navegación optimizada para touch
- Formularios que funcionan perfecto en móvil
- Componentes que escalan adecuadamente

## 🔒 Seguridad

- Validación en frontend (se complementaría con backend)
- Sanitización de inputs
- Gestión segura de sesiones
- Preparado para integración con autenticación multifactor

## 💻 Desarrollo

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting del código
```

### Estructura de Componentes
Los componentes siguen el patrón:
- Props tipadas con TypeScript
- Estilos con Tailwind CSS
- Lógica separada en custom hooks cuando aplica
- Documentación clara en el código

## 🎨 Sistema de Diseño

### Colores
- **Primario**: Azul (#2563eb) - Confianza y profesionalismo
- **Éxito**: Verde (#16a34a) - Citas completadas
- **Advertencia**: Naranja (#ea580c) - Citas pendientes
- **Error**: Rojo (#dc2626) - Cancelaciones

### Tipografía
- Sistema de fuentes nativo para mejor rendimiento
- Jerarquía clara con tamaños consistentes
- Line-height optimizado para legibilidad

## 📞 Soporte

Para preguntas sobre implementación o uso:
1. Revisar la documentación en el código
2. Consultar los componentes de ejemplo
3. Verificar los stores para entender el flujo de datos

---

**Desarrollado con ❤️ para el sector HealthTech**