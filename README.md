# Vostraslater

Vostraslater AI es una plataforma de inteligencia artificial moderna diseñada para ejecutar modelos de lenguaje de forma local mediante Ollama, incorporando además capacidades avanzadas de transcripción de audio utilizando Faster-Whisper.

El proyecto combina una interfaz moderna desarrollada con Next.js y React, junto con servicios de procesamiento de IA que permiten interactuar mediante texto y voz, ofreciendo una experiencia similar a los asistentes conversacionales modernos pero con control total sobre los datos y la infraestructura.

## Características

* Chat conversacional impulsado por Ollama.
* Interfaz moderna con diseño Glassmorphism.
* Renderizado de respuestas en Markdown.
* Soporte para carga de archivos de audio.
* Transcripción automática mediante Faster-Whisper.
* Arquitectura preparada para integración con FastAPI y NestJS.
* Procesamiento local sin depender de servicios externos.
* Compatible con modelos open-source ejecutados en hardware propio.

## Tecnologías Utilizadas

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Lucide React

### Inteligencia Artificial

* Ollama
* Llama
* Mistral
* Gemma
* DeepSeek
* Faster-Whisper

### Backend

* FastAPI
* Python
* Node.js
* NestJS (Integración futura)

## Arquitectura

```text
Usuario
   │
   ▼
Next.js + React
   │
   ├── Chat IA
   ├── Markdown
   └── Carga de Audio
   │
   ▼
FastAPI
   │
   ├── Faster-Whisper
   └── Procesamiento de Audio
   │
   ▼
Ollama
   │
   └── Modelos de IA Locales
```

## Objetivos del Proyecto

* Crear una plataforma de IA privada y ejecutable localmente.
* Permitir interacción mediante texto y voz.
* Facilitar la integración con sistemas empresariales.
* Incorporar análisis y clasificación automática de conversaciones.
* Implementar identificación de hablantes en futuras versiones.
* Generar resúmenes inteligentes y extracción de información relevante.

## Próximas Funcionalidades

* Grabación de voz desde el navegador.
* Identificación automática de hablantes.
* Resúmenes automáticos mediante IA.
* Memoria conversacional persistente.
* Integración con bases de datos.
* API pública para desarrolladores.
* Panel administrativo.
* Sistema multiusuario.

## Licencia

Este proyecto se encuentra en desarrollo activo y tiene como objetivo servir como base para aplicaciones de inteligencia artificial privadas, empresariales y de productividad impulsadas por modelos open-source.
