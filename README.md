# EcoTrack AI

## Descripción

EcoTrack AI es un MVP que permite a pequeños negocios describir actividades de su operación en lenguaje natural y obtener una estimación simplificada de emisiones de CO2e.

## Problema

Los pequeños negocios pueden no disponer de tiempo o conocimiento técnico para completar inventarios complejos de emisiones.

## Solución

El usuario escribe frases como:

> "Hoy usamos 3 camionetas de reparto, recorrimos 120 km y consumimos 200 kWh de electricidad."

La aplicación interpreta la información disponible, estructura los datos y genera una estimación.

## Funcionalidades

- Entrada en lenguaje natural.
- Detección de consumo eléctrico.
- Detección de vehículos.
- Detección de kilómetros.
- Estimación simplificada de CO2e.
- Desglose por categorías.
- Interfaz responsive.

## Tecnologías

- Next.js
- React
- TypeScript
- Tailwind CSS
- ESLint

## Vibe Coding

Este proyecto se desarrolló de forma iterativa mediante Codex. El trabajo se guio por prompts, cambios pequeños, restricciones explícitas, revisión del resultado y correcciones incrementales para mantener el alcance del MVP claro y verificable.

## Limitaciones

- Los factores de emisión utilizados tienen propósito demostrativo.
- No constituye un inventario oficial de gases de efecto invernadero.
- El procesamiento de lenguaje natural utilizado es simplificado y sólo reconoce patrones definidos localmente.

## Ejecución local

Desde la carpeta `ecotrack-ai`:

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` en el navegador.

Para validar el proyecto antes de una ejecución de producción:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start
```
