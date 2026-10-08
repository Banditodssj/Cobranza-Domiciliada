# Cobranza Domiciliada - Layouts Bancarios

[🇺🇸 English](README.md)
# Cobranza Domiciliada - Layouts Bancarios


Aplicación Full Stack para la administración de layouts bancarios utilizados
en procesos de cobranza domiciliada.

## Funcionalidades actuales

- Consulta de layouts bancarios
- Búsqueda por nombre
- Filtro por banco
- Filtro por estatus
- Creación de layouts
- Consulta de detalle
- Edición de layouts
- Copia de layouts existentes
- Confirmación antes de realizar copias
- Notificaciones de éxito y error
- Prevención de operaciones duplicadas durante el procesamiento

## Tecnologías

### Backend
- C#
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- Pomelo.EntityFrameworkCore.MySql

### Frontend
- React
- JavaScript
- Vite
- CSS
- Fetch API

### Base de datos
- MySQL
- Docker

## Arquitectura

React → ASP.NET Core Web API → Entity Framework Core → MySQL

## Estructura del proyecto

```text
Tesoreria/
├── CobranzaAPI/
├── CobranzaFrontEnd/
├── docs/
├── .gitignore
└── README.md
