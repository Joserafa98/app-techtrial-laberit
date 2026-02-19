# Prueba Técnica Frontend React — Duacode

Aplicación web desarrollada con React y TypeScript que permite realizar operaciones CRUD sobre usuarios, consumiendo la API REST de [reqres.in](https://reqres.in/).

---

## 🛠️ Tecnologías utilizadas

- **React 18** con **TypeScript**
- **Vite** — entorno de desarrollo
- **React Router DOM** — navegación entre pantallas
- **Axios** — peticiones HTTP
- **Tailwind CSS** — estilos y diseño responsive
- **Context API + useReducer** — gestión de estado global

---

## 📋 Funcionalidades

- Listado de usuarios con avatar, nombre y email
- Paginación local (6 usuarios por página)
- Detalle completo de cada usuario
- Creación de nuevos usuarios con opción de subir foto de perfil
- Edición de usuarios existentes
- Eliminación con modal de confirmación animado
- Validaciones en formularios con indicación de campos obligatorios
- Notificaciones toast animadas en acciones CRUD
- Diseño responsive (mobile y desktop)
- Manejo de estados de carga y error

---

## ⚙️ Decisión técnica — CRUD simulado

La API de reqres.in en su plan gratuito permite operaciones de lectura (`GET`) pero las operaciones de escritura (`POST`, `PUT`, `DELETE`) están restringidas. Para ofrecer una experiencia CRUD completa sin depender de un plan de pago, se implementó la siguiente estrategia:

- `GET /users` → llamada real a la API, datos reales
- `POST`, `PUT`, `DELETE` → gestionados mediante estado global con **Context API + useReducer**, actualizando la UI de forma inmediata (optimistic update)

Esta arquitectura demuestra manejo de asincronía, sincronización cliente-servidor y gestión de estado global, que son exactamente las habilidades evaluadas en una prueba técnica frontend.

---

## 📸 Foto de perfil en creación de usuario

Al crear un nuevo usuario, la aplicación ofrece dos opciones para la foto de perfil:

- **Subir foto desde el dispositivo** — el usuario puede seleccionar cualquier imagen de su sistema. La imagen se convierte a base64 y se almacena en el estado local, mostrándose de forma inmediata sin necesidad de ningún servidor externo.
- **Iniciales generadas automáticamente** — si el usuario no sube ninguna foto, se genera un avatar con sus iniciales usando la API de [ui-avatars.com](https://ui-avatars.com/), manteniendo la coherencia visual con el resto del listado.

Esta decisión se tomó para ofrecer una experiencia más completa y cercana a una aplicación real, sin añadir dependencias externas innecesarias ni complicar la arquitectura del proyecto.

---

## 🎨 Diseño y experiencia de usuario

- Fondo con gradiente oscuro (`slate-900` a `blue-900`) para un acabado profesional
- Efectos de zoom y sombra brillante en botones e interacciones
- Animaciones suaves de entrada y salida en toasts y modales
- Toasts diferenciados por color según la acción (verde para éxito, rojo para eliminación)

---

## 🚀 Instalación y ejecución

### Requisitos previos

- Node.js 18 o superior
- npm 9 o superior

### Pasos

1. Clona el repositorio:

```bash
git clone https://github.com/Joserafa98/app-techtrial-laberit.git
cd app-techtrial-laberit
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea el archivo de variables de entorno:

```bash
cp .env.example .env
```

4. Abre el archivo `.env` y añade tu API key de reqres.in:

```
REQRES_API_KEY=tu_api_key_aqui
```

Puedes obtener una API key gratuita registrándote en [https://reqres.in](https://reqres.in/).

5. Inicia el servidor de desarrollo:

```bash
npm run dev
```

6. Abre el navegador en `http://localhost:5173`

---

## 📦 Compilación para producción

```bash
npm run build
```

El resultado se generará en la carpeta `dist/`.

---

## 📁 Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables (Toast, ConfirmModal)
├── context/          # Context API y useReducer (estado global)
├── hooks/            # Custom hooks (useToast)
├── pages/            # Páginas principales (UserList, UserDetail, UserForm)
├── services/         # Llamadas a la API con Axios
└── types/            # Interfaces y tipos TypeScript
```
