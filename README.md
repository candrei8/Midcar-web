# MidCar Web - Página Pública

Sitio web público moderno para MID Car, concesionario de vehículos de segunda mano en Madrid.

## Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Framer Motion** - Animaciones
- **Lucide React** - Iconos

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del proyecto

```
src/
├── app/                    # Páginas (App Router)
│   ├── page.tsx           # Página principal
│   ├── vehiculos/         # Catálogo de vehículos
│   ├── contacto/          # Página de contacto
│   └── financiacion/      # Calculadora de financiación
├── components/
│   ├── home/              # Componentes de la landing
│   ├── layout/            # Header, Footer
│   ├── ui/                # Componentes reutilizables
│   └── vehicles/          # Catálogo de vehículos
└── lib/                   # Utilidades
```

## Características

- Diseño moderno y responsive 2026
- Buscador de vehículos con filtros
- Calculadora de financiación interactiva
- Integración con WhatsApp
- SEO optimizado
- Animaciones fluidas

## Build de producción

```bash
npm run build
npm start
```
