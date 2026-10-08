# Direct Debit Collections - Bank Layouts
[🇪🇸 Español](README-ES.md)

Full Stack application for managing bank layouts used in direct debit collection processes.

## Current Features

- View bank layouts
- Search by name
- Filter by bank
- Filter by status
- Create layouts
- View layout details
- Edit layouts
- Copy existing layouts
- Confirmation before copying layouts
- Success and error notifications
- Prevention of duplicate operations during processing

## Technologies

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

### Database
- MySQL
- Docker

## Architecture

React → ASP.NET Core Web API → Entity Framework Core → MySQL

## Project Structure

```text
Tesoreria/
├── CobranzaAPI/
├── CobranzaFrontEnd/
├── docs/
├── .gitignore
└── README.md
