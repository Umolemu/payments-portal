# Payments Portal

International payments portal with SWIFT integration, featuring secure authentication and transaction management.

## Quick Start

### Installation

From the project root, install all dependencies for both client and server:

```powershell
npm install
npm run install:all
```

### Development

Run both client and server in development mode:

```powershell
npm run dev
```

This will start:
- **Server**: https://localhost:5001 (HTTPS)
- **Client**: http://localhost:5173 (with proxy to server)

### Individual Commands

Run server only:
```powershell
npm run dev:server
```

Run client only:
```powershell
npm run dev:client
```

## Project Structure

```
payments-portal/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── api/     # API client functions
│   │   ├── components/
│   │   ├── context/ # Auth context
│   │   ├── pages/
│   │   └── ...
│   └── package.json
├── server/          # Express + TypeScript backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── validations/
│   │   └── ...
│   └── package.json
└── package.json     # Root package for running both
```

## Features

### Authentication
- ✅ Secure JWT-based authentication
- ✅ HttpOnly cookies for token storage
- ✅ CSRF protection on all POST requests
- ✅ Session management with auto-refresh
- ✅ Protected routes

### Payments
- ✅ Create international payments
- ✅ SWIFT/BIC validation
- ✅ IBAN validation
- ✅ Multi-currency support (USD, EUR, GBP, JPY, CHF, CAD, AUD)
- ✅ Send payments to SWIFT network
- ✅ Transaction history per user

### Security
- ✅ HTTPS enforcement
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Helmet.js security headers

## Environment Variables

### Server (.env in server directory)
```
JWT_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRES_IN=15m
FRONTEND_ORIGIN=https://localhost:3000
PORT=5001
```

## Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express
- TypeScript
- JWT
- Bcrypt
- express-validator

## Default Test Users

```javascript
Email: alice@example.com
Password: password123
Role: admin

Email: bob@example.com
Password: password123
Role: user

Email: carol@example.com
Password: password123
Role: user
```
