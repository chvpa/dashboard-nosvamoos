# 🗺️ ROADMAP — Dashboard Analytics · Nos Vamoos

> **Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Recharts · Vercel  
> **API:** Botmaker REST API v2.0 (`https://api.botmaker.com/v2.0`)  
> **Principio rector:** La **Tabla Principal** es la única fuente de verdad. Todos los KPIs, gráficos y métricas se derivan de sus datos. Solo ella hace peticiones a la API.

---

## Estado actual (resumen)

- **Tabla Principal** (`/tabla`): integrada con API real de Botmaker (`/api/chats`). Filtros por fecha: Hoy, Semana, Mes, Personalizado (calendario + hora). Rangos > 1 día envían `long-term-search=true`. Paginación con "Cargar más".
- **Layout:** Sidebar (AppSidebar, SidebarNav), TopBar, rutas por sección. Scroll horizontal contenido en la tabla; layout con `overflow-hidden` en `SidebarInset` y `min-w-0` en `main`.
- **Pendiente:** Filtros globales en TopBar, KPIs, charts, sincronización de filtros con URL, endpoint de agentes.

**Próximos pasos sugeridos:** (1) Completar Sprint 6: `app/api/agents/route.ts`, transformación de respuesta de chats a modelo unificado si se necesita. (2) Sprint 3: store de filtros ya existe; conectar GlobalFilters en TopBar y KPIs en dashboard. (3) Sprint 4: gráficos con Recharts derivados de los datos de la tabla.

---

## Convenciones del Roadmap

| Símbolo | Significado |
|---------|-------------|
| ✅ | Sprint completado y mergeado |
| 🔄 | Sprint en progreso |
| ⏳ | Sprint pendiente |
| 🔴 | Bloqueado / requiere decisión |

Cada sprint finaliza con un **build de producción** (`next build`) para verificar que no hay errores de compilación antes de avanzar.

---

## 📐 Arquitectura General

```
dashboard-nosvamoos/
├── app/
│   ├── layout.tsx                  # Layout raíz con SidebarProvider
│   ├── globals.css                 # Variables CSS (oklch) + tema dark/light
│   ├── page.tsx                    # Redirect a /dashboard
│   └── (dashboard)/
│       ├── layout.tsx              # Shell con AppSidebar + main content
│       ├── dashboard/
│       │   └── page.tsx            # Vista general (Overview)
│       ├── ventas/
│       │   └── page.tsx            # Sección Análisis de Ventas
│       ├── agentes/
│       │   └── page.tsx            # Sección Rendimiento por Agente
│       ├── destinos/
│       │   └── page.tsx            # Sección Destinos Populares
│       ├── conversaciones/
│       │   └── page.tsx            # Sección Análisis Temporal / Conversaciones
│       └── tabla/
│           └── page.tsx            # Tabla Principal (fuente de verdad)
│
├── components/
│   ├── ui/                         # Componentes shadcn/ui (auto-generados)
│   ├── layout/
│   │   ├── AppSidebar.tsx          # Sidebar principal con navegación
│   │   ├── SidebarNav.tsx          # Items de navegación del sidebar
│   │   └── TopBar.tsx              # Barra superior: filtros globales + acciones
│   ├── filters/
│   │   ├── GlobalFilters.tsx       # Panel de filtros globales (fecha, agente, etc.)
│   │   ├── DateRangePicker.tsx     # Selector de rango de fechas
│   │   └── FilterBadges.tsx        # Chips de filtros activos
│   ├── table/
│   │   ├── ConversationsTable.tsx  # Tabla principal de conversaciones
│   │   ├── columns.tsx             # Definición de columnas (TanStack Table)
│   │   ├── TableToolbar.tsx        # Barra de herramientas: búsqueda, descarga, refresh
│   │   └── TablePagination.tsx     # Paginación de la tabla
│   ├── charts/
│   │   ├── SalesStatusChart.tsx    # Donut: Vendido / Potable / No Vendido / No Potable
│   │   ├── AgentPerformanceChart.tsx # Barras: ventas por agente
│   │   ├── DestinationsChart.tsx   # Barras horizontales: destinos más consultados
│   │   ├── PackageTypeChart.tsx    # Pie: tipo de paquete
│   │   ├── ConversationsOverTime.tsx # Línea: sesiones por fecha
│   │   ├── HourlyHeatmap.tsx       # Heatmap: actividad por hora del día
│   │   ├── PriorityChart.tsx       # Barras apiladas: prioridad vs cierre
│   │   └── FamilyCompositionChart.tsx # Barras: adultos vs niños
│   ├── kpis/
│   │   ├── KpiCard.tsx             # Card individual de KPI
│   │   └── KpiGrid.tsx             # Grilla de KPIs (6 métricas)
│   └── shared/
│       ├── SectionHeader.tsx       # Título + descripción de sección
│       └── EmptyState.tsx          # Estado vacío reutilizable
│
├── lib/
│   ├── utils.ts                    # cn() y helpers generales
│   ├── mock-data.ts                # Dataset mock (basado en CSV del HTML demo)
│   ├── data-transforms.ts          # Funciones puras de transformación de datos
│   └── botmaker-api.ts             # Cliente HTTP para Botmaker API
│
├── hooks/
│   ├── useConversations.ts         # Hook principal: fetch + estado de conversaciones
│   ├── useFilters.ts               # Hook de estado global de filtros
│   └── useFilteredData.ts          # Hook derivado: aplica filtros al dataset
│
├── types/
│   └── index.ts                    # Tipos TypeScript: Conversation, Agent, Filters, etc.
│
├── store/
│   └── filters.ts                  # Zustand store para filtros globales
│
└── ROADMAP.md
```

---

## 🗂️ Modelo de Datos Principal

Basado en el CSV del demo y la API de Botmaker (`/chats`, `/agents`, `/messages`):

```typescript
// types/index.ts
interface Conversation {
  id: string                  // chatId de Botmaker
  nombre: string              // Nombre del contacto
  telefono: string            // Número de teléfono
  destino: string             // Destino de viaje (variable de chat)
  tipoPaquete: string         // "Vuelo + Hotel" | "Solo Vuelo" | "All Inclusive" | "Tour"
  fechaContacto: string       // ISO date
  horaContacto: number        // 0-23
  cantidadPasajeros: number
  cantidadAdultos: number
  cantidadNinos: number
  prioridad: "Alta" | "Media" | "Baja"
  cantidadMensajes: number
  cierreConversacion: "Vendido" | "Potable" | "No Vendido" | "No Potable"
  linkChat: string            // URL a Botmaker
  agente: string              // Nombre del agente asignado
}
```

---

## Sprint 1 — Estructura del Proyecto ✅

**Objetivo:** Scaffolding completo, estructura de carpetas, dependencias instaladas y app corriendo en dev con UI base.

**Criterio de completado:** `npm run dev` levanta sin errores · `npm run build` compila correctamente · Sidebar visible con navegación funcional.

### Tareas

#### 1.1 · Instalación de dependencias
- [ ] **shadcn/ui CLI ya está configurado** (`components.json` existe)
- [ ] Instalar componentes shadcn **por terminal** usando `npx shadcn@latest add <component-name>`:
  - `npx shadcn@latest add sidebar` (incluye SidebarProvider)
  - `npx shadcn@latest add table`
  - `npx shadcn@latest add button`
  - `npx shadcn@latest add badge`
  - `npx shadcn@latest add card`
  - `npx shadcn@latest add select`
  - `npx shadcn@latest add input`
  - `npx shadcn@latest add dropdown-menu`
  - `npx shadcn@latest add separator`
  - `npx shadcn@latest add sheet`
  - `npx shadcn@latest add tooltip`
  - `npx shadcn@latest add popover`
  - `npx shadcn@latest add calendar`
  - `npx shadcn@latest add skeleton` (para estados de carga)
  - `npx shadcn@latest add sonner` (para toasts/notificaciones)
- [ ] **Nota:** Los componentes se instalan automáticamente en `components/ui/` con el CLI. No se crean manualmente.
- [ ] Instalar **Recharts** (`recharts`) para charts
- [ ] Instalar **TanStack Table** (`@tanstack/react-table`) para tabla avanzada
- [ ] Instalar **Zustand** (`zustand`) para estado global de filtros
- [ ] Instalar **date-fns** para manipulación de fechas
- [ ] Instalar **lucide-react** (ya incluido con shadcn)

#### 1.2 · Estructura de carpetas y archivos base
- [ ] Crear estructura de directorios completa según arquitectura definida arriba
- [ ] Crear archivos vacíos (con exports básicos) para todos los componentes listados
- [ ] Definir `types/index.ts` completo con todos los tipos del modelo de datos
- [ ] Crear `lib/utils.ts` con `cn()` helper

#### 1.3 · Layout raíz y Sidebar
- [ ] Implementar `app/(dashboard)/layout.tsx` con `SidebarProvider` de shadcn
- [ ] Implementar `AppSidebar.tsx` con:
  - Logo de Nos Vamoos (SVG del HTML demo)
  - Items de navegación: Overview, Ventas, Agentes, Destinos, Conversaciones, Tabla
  - Íconos de Lucide por sección
  - Indicador de sección activa (`usePathname`)
  - Versión colapsable (mobile-friendly)
- [ ] Implementar `TopBar.tsx` con acciones globales (botones Exportar / Actualizar placeholder)

#### 1.4 · Rutas y páginas stub
- [ ] Crear `app/page.tsx` con redirect a `/dashboard`
- [ ] Crear páginas stub para cada sección (solo `<h1>` con el nombre de la sección)
- [ ] Verificar que la navegación del sidebar funciona correctamente entre rutas

#### 1.5 · Build y verificación
- [ ] `npm run build` sin errores
- [ ] Verificar en browser: sidebar visible, navegación entre secciones funciona
- [ ] Confirmar que el tema dark/light se aplica correctamente

---

## Sprint 2 — Tabla Principal con Datos Mock ⏳

**Objetivo:** Tabla de conversaciones completamente funcional con datos mock, columnas correctas, búsqueda, paginación y descarga CSV.

**Criterio de completado:** Tabla renderiza 50+ filas mock · Filtros de búsqueda y selects funcionan · Paginación operativa · Exportar CSV descarga el archivo.

### Tareas

#### 2.1 · Dataset mock
- [ ] Crear `lib/mock-data.ts` con al menos 80 filas de datos mock basadas en el CSV del HTML demo (expandido con más fechas, agentes y destinos variados)
- [ ] Asegurar variedad en: agentes (5+), destinos (8+), estados de cierre (los 4), fechas (últimos 3 meses)

#### 2.2 · Definición de columnas TanStack Table
- [ ] Crear `components/table/columns.tsx` con todas las columnas:
  - Nombre, Teléfono, Destino, Tipo Paquete, Fecha, Hora, Pasajeros, Prioridad, Mensajes, Cierre, Agente, Chat (link)
- [ ] Configurar `Badge` de shadcn para columnas de estado (`Cierre`, `Prioridad`)
- [ ] Columna "Chat" como link externo a Botmaker con ícono de Lucide
- [ ] Habilitar sorting por columna

#### 2.3 · Componente ConversationsTable
- [ ] Implementar `components/table/ConversationsTable.tsx` con TanStack Table
- [ ] Implementar `TableToolbar.tsx` con:
  - Input de búsqueda global (`shadcn Input`)
  - Select de filtro por estado de cierre (`shadcn Select`)
  - Select de filtro por prioridad
  - Select de filtro por agente
  - Botón "Exportar CSV" (`shadcn Button`)
  - Botón "Actualizar" con ícono de refresh
- [ ] Implementar `TablePagination.tsx` con controles de página (prev / next / selector de filas por página)

#### 2.4 · Lógica de exportación
- [ ] Función `exportToCSV()` en `lib/data-transforms.ts` que convierte el dataset filtrado actual a CSV
- [ ] Trigger descarga desde el browser (no server-side)

#### 2.5 · Página Tabla
- [ ] Integrar tabla en `app/(dashboard)/tabla/page.tsx`
- [ ] Mostrar contador de registros ("Mostrando X de Y conversaciones")

#### 2.6 · Build y verificación
- [ ] `npm run build` sin errores
- [ ] Verificar tabla en browser con datos mock
- [ ] Verificar que exportar CSV descarga el archivo correctamente

---

## Sprint 3 — UI: Sidebar, KPIs y Secciones Mock ⏳

**Objetivo:** Todas las secciones del dashboard tienen su UI base completa con datos mock derivados de la tabla. El dashboard se ve completo aunque los datos no sean reales.

**Criterio de completado:** Las 6 secciones son navegables · KPIs se calculan desde mock-data · Cada sección tiene su layout correcto · Build sin errores.

### Tareas

#### 3.1 · Hook useFilters y store Zustand
- [ ] Implementar `store/filters.ts` con Zustand:
  - Estado: `{ dateRange, agent, destination, status, priority, packageType }`
  - Acciones: `setFilter()`, `clearFilters()`, `resetFilters()`
- [ ] Implementar `hooks/useFilters.ts` como wrapper del store
- [ ] Implementar `hooks/useFilteredData.ts` que recibe el dataset completo y devuelve el dataset filtrado según el estado del store

#### 3.2 · Componente GlobalFilters
- [ ] Implementar `components/filters/GlobalFilters.tsx` con:
  - `DateRangePicker` (shadcn Calendar + Popover) para rango de fechas
  - Select de Agente (opciones dinámicas desde dataset)
  - Select de Destino (opciones dinámicas)
  - Select de Estado de Cierre
  - Select de Prioridad
  - Select de Tipo de Paquete
  - Botón "Limpiar Filtros"
- [ ] Integrar `GlobalFilters` en `TopBar.tsx`
- [ ] Mostrar `FilterBadges` con chips de filtros activos y botón para eliminar cada uno

#### 3.3 · KPIs
- [ ] Implementar `components/kpis/KpiCard.tsx` usando `shadcn Card`
- [ ] Implementar `components/kpis/KpiGrid.tsx` con las 6 métricas:
  - Sesiones Totales (count de conversaciones filtradas)
  - Tasa de Conversión (Vendido / Total × 100)
  - Mensajes Totales (suma) + Promedio por sesión
  - Pasajeros Promedio por reserva
  - Agente Top (agente con más ventas)
  - Destino Más Consultado
- [ ] Todas las métricas se calculan en `lib/data-transforms.ts` como funciones puras
- [ ] Los KPIs reaccionan a los filtros globales en tiempo real

#### 3.4 · Sección Overview (Dashboard principal)
- [ ] Layout en `app/(dashboard)/dashboard/page.tsx`:
  - KpiGrid en la parte superior
  - 2 gráficos principales (sesiones por fecha + estado de cierre)
  - Acceso rápido a otras secciones

#### 3.5 · Sección Ventas
- [ ] Layout en `app/(dashboard)/ventas/page.tsx`:
  - KpiGrid con métricas de ventas
  - Gráfico Estado de Cierre (donut)
  - Gráfico Rendimiento por Agente (barras)
  - Mini-tabla top 5 agentes

#### 3.6 · Sección Agentes
- [ ] Layout en `app/(dashboard)/agentes/page.tsx`:
  - Gráfico comparativo por agente (ventas vs no-ventas)
  - Cards individuales por agente con métricas
  - Tabla de rendimiento por agente

#### 3.7 · Sección Destinos
- [ ] Layout en `app/(dashboard)/destinos/page.tsx`:
  - Gráfico destinos populares (barras horizontales)
  - Gráfico tipo de paquete (pie)
  - Gráfico prioridad vs cierre

#### 3.8 · Sección Conversaciones
- [ ] Layout en `app/(dashboard)/conversaciones/page.tsx`:
  - Gráfico sesiones por fecha (línea / área)
  - Heatmap de horarios populares
  - Calendario de actividad mensual
  - Gráfico composición familiar (adultos vs niños)

#### 3.9 · Build y verificación
- [ ] `npm run build` sin errores
- [ ] Navegar todas las secciones, verificar que KPIs y layouts se ven correctos
- [ ] Verificar responsividad en mobile (375px) y desktop (1440px)

---

## Sprint 4 — Charts con Datos Derivados de la Tabla ⏳

**Objetivo:** Todos los gráficos implementados con Recharts, consumiendo datos del hook `useFilteredData`. Cuando cambia un filtro, todos los charts se actualizan automáticamente.

**Criterio de completado:** 8 gráficos funcionando · Todos reaccionan a filtros globales · Usan variables CSS del theme · Build sin errores.

### Tareas

#### 4.1 · Funciones de transformación de datos
Implementar en `lib/data-transforms.ts` todas las funciones de agregación:
- [ ] `getSalesByStatus(data)` → `{ name: string, value: number }[]` (para donut/pie)
- [ ] `getAgentPerformance(data)` → `{ agent, sold, notSold, potable }[]` (para barras apiladas)
- [ ] `getTopDestinations(data, limit?)` → `{ destination, count }[]`
- [ ] `getPackageTypeDistribution(data)` → `{ type, count }[]`
- [ ] `getConversationsOverTime(data)` → `{ date, count }[]` ordenado
- [ ] `getHourlyDistribution(data)` → `{ hour: number, count: number }[]` (0-23)
- [ ] `getPriorityVsClosure(data)` → tabla cruzada prioridad × cierre
- [ ] `getFamilyComposition(data)` → `{ adultos, ninos }` aggregated
- [ ] `getCalendarHeatmap(data, month, year)` → `{ day: number, count: number }[]`

#### 4.2 · Implementar charts con Recharts
Para cada chart, usar las **variables CSS del theme** (`var(--chart-1)` a `var(--chart-5)`, `var(--primary)`, etc.) [[memory:4122643]]:

- [ ] **SalesStatusChart** — `PieChart` (Recharts) + `shadcn ChartContainer`
  - Colores: `--chart-1` (Vendido), `--chart-2` (Potable), `--chart-3` (No Vendido), `--destructive` (No Potable)
  - Tooltip con porcentaje y cantidad
  - Leyenda debajo

- [ ] **AgentPerformanceChart** — `BarChart` apilado
  - Eje X: nombres de agentes
  - Eje Y: cantidad de conversaciones
  - Segmentos: Vendido / Potable / No Vendido / No Potable
  - Colores: `--chart-1` a `--chart-4`

- [ ] **DestinationsChart** — `BarChart` horizontal
  - Eje Y: nombres de destinos
  - Eje X: cantidad de consultas
  - Color: `--primary`
  - Top 10 destinos

- [ ] **PackageTypeChart** — `PieChart` / `RadialBarChart`
  - 4 tipos de paquete
  - Tooltip con porcentaje

- [ ] **ConversationsOverTime** — `AreaChart` o `LineChart`
  - Eje X: fechas
  - Eje Y: número de sesiones
  - Gradiente de relleno con `--primary` al 20% de opacidad

- [ ] **HourlyHeatmap** — Grid custom con `div` + `shadcn Tooltip`
  - 24 celdas (hora 0 a 23)
  - Intensidad de color según volumen
  - Colores: escala de `--muted` a `--primary`

- [ ] **PriorityChart** — `BarChart` agrupado
  - Alta / Media / Baja por eje X
  - Barras por estado de cierre
  - Colores: `--destructive` (Alta), `--chart-3` (Media), `--chart-1` (Baja)

- [ ] **FamilyCompositionChart** — `BarChart`
  - Adultos vs Niños
  - Promedio por reserva

#### 4.3 · Integrar charts en secciones
- [ ] Conectar cada chart a su sección correspondiente vía `useFilteredData`
- [ ] Asegurar que `useMemo` se usa para evitar recálculos innecesarios
- [ ] Agregar estado de carga (`Skeleton` de shadcn) mientras los datos se procesan

#### 4.4 · Build y verificación
- [ ] `npm run build` sin errores
- [ ] Verificar que cambiar un filtro actualiza TODOS los charts simultaneamente
- [ ] Verificar que los charts se ven correctos en dark mode

---

## Sprint 5 — Lógica de Filtros Globales ⏳

**Objetivo:** Sistema de filtros robusto, aplicable desde cualquier sección, con URL sync para compartir vistas filtradas.

**Criterio de completado:** Filtros persisten al navegar entre secciones · URL refleja estado de filtros · Limpiar filtros resetea todo · Build sin errores.

### Tareas

#### 5.1 · Filtros disponibles
| Filtro | Tipo | Fuente de opciones |
|--------|------|-------------------|
| Rango de fechas | DateRangePicker | Libre |
| Agente | Select múltiple | Dinámico desde dataset |
| Destino | Select múltiple | Dinámico desde dataset |
| Estado de cierre | Checkboxes | Fijo: Vendido, Potable, No Vendido, No Potable |
| Prioridad | Checkboxes | Fijo: Alta, Media, Baja |
| Tipo de paquete | Select múltiple | Dinámico desde dataset |
| Búsqueda texto | Input | Busca en: nombre, teléfono, destino |

#### 5.2 · Sincronización con URL (Search Params)
- [ ] Usar `useSearchParams` de Next.js para serializar estado de filtros en la URL
- [ ] Ejemplo: `?desde=2026-01-01&hasta=2026-01-31&agente=Carlos+Vera&estado=Vendido`
- [ ] Al cargar la página, restaurar filtros desde URL
- [ ] Botón "Copiar enlace filtrado" en la UI

#### 5.3 · Persistencia cross-section
- [ ] Verificar que al navegar de Ventas → Destinos los filtros se mantienen (Zustand persiste en memoria)
- [ ] Indicador visual en el sidebar o TopBar cuando hay filtros activos (badge con count)

#### 5.4 · Filtros en tabla
- [ ] Los filtros globales afectan la tabla principal
- [ ] La tabla tiene filtros locales adicionales (búsqueda por texto, sorting por columna)
- [ ] Los filtros locales se combinan con los filtros globales (AND)

#### 5.5 · Build y verificación
- [ ] `npm run build` sin errores
- [ ] Test manual: aplicar filtro de fecha → verificar que tabla + charts + KPIs se actualizan
- [ ] Test: navegar entre secciones con filtros activos → verificar que se mantienen
- [ ] Test: compartir URL filtrada → verificar que se restaura el estado

---

## Sprint 6 — Integración con API de Botmaker 🔄

**Objetivo:** Reemplazar datos mock por datos reales de la API de Botmaker. La tabla hace las peticiones; todos los demás componentes consumen desde el estado de la tabla.

**Criterio de completado:** Tabla carga datos reales de Botmaker · Charts y KPIs muestran datos reales · Paginación contra API funciona · Refresh manual disponible · Build sin errores.

### Endpoints a consumir

| Endpoint | Método | Uso |
|----------|--------|-----|
| `GET /chats` | Paginado | Lista de conversaciones con variables y tags |
| `GET /agents` | Simple | Lista de agentes para filtros y labels |
| `GET /messages` | Por chatId | Conteo de mensajes por conversación |

### Tareas

#### 6.1 · Cliente HTTP Botmaker
- [ ] Implementar `lib/botmaker-api.ts`:
  - Configuración base: `baseURL`, `access-token` header desde `process.env.BOTMAKER_TOKEN`
  - Función `fetchChats(params)`: con parámetros de filtro (`from`, `to`, `channel-id`, paginación)
  - Función `fetchAgents()`: lista todos los agentes
  - Manejo de rate limits (429): retry con backoff exponencial
  - Manejo de paginación: `nextPage` token para traer todos los resultados

#### 6.2 · Variables de entorno
- [ ] Crear `.env.local` con:
  ```
  BOTMAKER_TOKEN=<access-token>
  BOTMAKER_CHANNEL_ID=<channel-id-de-whatsapp>
  ```
- [ ] Crear `.env.example` documentado para el equipo
- [ ] **Nunca** commitear `.env.local` (verificar `.gitignore`)

#### 6.3 · API Route de Next.js (proxy)
- [ ] Crear `app/api/conversations/route.ts`:
  - Recibe parámetros de filtro del cliente
  - Llama a Botmaker API con el token (server-side, token nunca expuesto al browser)
  - Transforma la respuesta al tipo `Conversation[]`
  - Maneja paginación interna si necesario
- [ ] Crear `app/api/agents/route.ts`:
  - Devuelve lista de agentes para poblar selects de filtros

#### 6.4 · Mapeo de datos de Botmaker → Tipo Conversation
Las variables de chat de Botmaker almacenan datos específicos de Nos Vamoos. Mapear:
- `chat.name` → `nombre`
- `chat.contactId` → `telefono`  
- Variable `destino` → `destino`
- Variable `tipo_paquete` → `tipoPaquete`
- `chat.creationTime` → `fechaContacto` / `horaContacto`
- Variable `cantidad_pasajeros` → `cantidadPasajeros`
- Variable `prioridad` → `prioridad`
- `chat.messagesCount` → `cantidadMensajes`
- Tag o variable `cierre_conversacion` → `cierreConversacion`
- `chat.assignedAgentName` → `agente`
- `chat.id` → `id` + construcción del `linkChat`

#### 6.5 · Hook useConversations
- [ ] Implementar `hooks/useConversations.ts`:
  - Llama a `/api/conversations` con los filtros de fecha del store
  - Estados: `loading`, `error`, `data`
  - Función `refresh()` para recarga manual
  - Cache con `SWR` o `React Query` (TTL: 5 minutos)
  - Si falla la API, fallback a datos mock con toast de advertencia

#### 6.6 · Actualizar tabla y componentes
- [ ] Reemplazar `mock-data` por `useConversations` en `ConversationsTable`
- [ ] Agregar estado de loading con `Skeleton` rows de shadcn
- [ ] Botón "Actualizar" en `TableToolbar` llama a `refresh()`
- [ ] Toast de éxito/error en refresh (usar `shadcn Sonner`)
- [ ] Mostrar timestamp de "Última actualización: hace X minutos"

#### 6.7 · Build y verificación
- [ ] `npm run build` sin errores
- [ ] Verificar con token real: tabla carga datos de Botmaker
- [ ] Verificar que charts y KPIs se actualizan con datos reales
- [ ] Verificar que el botón Refresh funciona y actualiza el timestamp

---

## Sprint 7 — Testing y Quality Assurance ⏳

**Objetivo:** El dashboard pasa todas las verificaciones de calidad antes del deploy a producción.

**Criterio de completado:** Build de producción sin errores · Sin warnings de TypeScript · Performance score ≥ 85 en Lighthouse · Funcional en Chrome, Firefox y Safari.

### Tareas

#### 7.1 · Calidad del código
- [ ] Ejecutar `npm run lint` y corregir todos los warnings
- [ ] Verificar que no hay `any` sin justificar en TypeScript
- [ ] Revisar que todas las funciones de `data-transforms.ts` tienen tipado correcto

#### 7.2 · Testing funcional manual
- [ ] **Tabla:** Verificar sorting, paginación, búsqueda, exportar CSV
- [ ] **Filtros:** Verificar todos los filtros individualmente y combinados
- [ ] **Charts:** Verificar que reaccionan a cambios de filtro
- [ ] **KPIs:** Verificar que las métricas son correctas con datos conocidos
- [ ] **Sidebar:** Verificar navegación y estado activo
- [ ] **Dark mode:** Verificar que todos los componentes se ven bien en ambos temas
- [ ] **Mobile (375px):** Verificar que el sidebar colapsa y la tabla es scrollable

#### 7.3 · Performance
- [ ] Verificar que los charts usan `useMemo` para evitar re-renders
- [ ] Verificar que la tabla no re-renderiza si los datos no cambian
- [ ] Agregar `loading.tsx` en cada ruta para streaming

#### 7.4 · Manejo de errores
- [ ] Verificar comportamiento cuando la API de Botmaker no responde
- [ ] Verificar que el fallback a mock-data muestra un aviso claro al usuario
- [ ] Agregar `error.tsx` en rutas principales

#### 7.5 · Preparación para producción
- [ ] Revisar que todas las variables de entorno están documentadas en `.env.example`
- [ ] Configurar `next.config.ts` para optimización de imágenes si aplica
- [ ] `npm run build` final sin errores ni warnings

---

## Sprint 8 — Deploy en Vercel ⏳

**Objetivo:** Dashboard de Nos Vamoos publicado y accesible en producción en Vercel.

**Criterio de completado:** URL pública funcional · Variables de entorno configuradas · Build de producción exitoso en Vercel · Dashboard accesible desde el browser.

### Tareas

#### 8.1 · Preparación del repositorio
- [ ] Verificar `.gitignore` incluye: `node_modules`, `.env.local`, `.next`, `*.log`
- [ ] Crear repositorio en GitHub / GitLab
- [ ] Push del código al repositorio

#### 8.2 · Configuración en Vercel
- [ ] Conectar repositorio a Vercel (importar proyecto)
- [ ] Configurar variables de entorno en Vercel Dashboard:
  - `BOTMAKER_TOKEN`
  - `BOTMAKER_CHANNEL_ID`
- [ ] Verificar que el framework es detectado como **Next.js**
- [ ] Build command: `npm run build` · Output directory: `.next`

#### 8.3 · Dominio y DNS (opcional)
- [ ] Configurar dominio personalizado si se tiene (`dashboard.nosvamoos.com` o similar)
- [ ] Verificar SSL (automático en Vercel)

#### 8.4 · Verificación post-deploy
- [ ] Acceder a la URL de Vercel y verificar que el dashboard carga
- [ ] Verificar que la conexión con Botmaker API funciona en producción
- [ ] Verificar que los charts y la tabla muestran datos reales
- [ ] Verificar dark mode, navegación y filtros en producción

#### 8.5 · Monitoreo
- [ ] Activar Vercel Analytics (free tier)
- [ ] Revisar logs de funciones en Vercel Dashboard si hay errores

---

## 📊 Resumen de Sprints

| Sprint | Descripción | Estimación | Estado |
|--------|-------------|------------|--------|
| 1 | Estructura del proyecto + Sidebar | 2-3 hs | ⏳ |
| 2 | Tabla principal con datos mock | 3-4 hs | ⏳ |
| 3 | UI: KPIs y secciones mock | 4-5 hs | ⏳ |
| 4 | Charts con datos derivados | 4-5 hs | ⏳ |
| 5 | Lógica de filtros globales | 3-4 hs | ⏳ |
| 6 | Integración API Botmaker | 4-6 hs | ⏳ |
| 7 | Testing y QA | 2-3 hs | ⏳ |
| 8 | Deploy en Vercel | 1-2 hs | ⏳ |
| **Total** | | **~23-32 hs** | |

---

## 🔑 Decisiones de Diseño

1. **Tabla como única fuente de verdad:** La tabla hace las peticiones a la API; charts y KPIs consumen sus datos derivados. Esto evita múltiples requests paralelos y garantiza consistencia.

2. **Filtros globales con Zustand:** Un store centralizado permite que cualquier sección acceda y modifique los filtros. Los filtros se sincronizan con URL para compartir vistas.

3. **API proxy en Next.js:** El token de Botmaker nunca se expone al browser. Todas las peticiones a Botmaker pasan por `app/api/*` en el servidor.

4. **Datos mock como fallback:** Si la API no responde, el dashboard muestra datos mock con un aviso. Esto evita pantallas en blanco en producción.

5. **shadcn/ui exclusivamente para UI:** Todos los componentes de interfaz usan shadcn. Los charts usan Recharts con el wrapper `ChartContainer` de shadcn para consistencia visual.

6. **Variables CSS del theme para charts:** Los colores de los gráficos usan las variables `--chart-1` a `--chart-5` definidas en `globals.css`, garantizando consistencia con el tema y soporte nativo de dark mode.

---

*Última actualización: 25 de Febrero 2026*
