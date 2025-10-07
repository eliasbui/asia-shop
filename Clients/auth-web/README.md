# Asia Shop Authentication Service

A dedicated Next.js application for handling authentication in the Asia Shop e-commerce platform. This service provides login, registration, password reset, and token management functionality.

## 🚀 Features

- **User Authentication**: Login, registration, and logout functionality
- **Password Management**: Forgot password and reset password flows
- **Token Management**: JWT access and refresh token handling
- **Cross-Domain Authentication**: Shared authentication state across multiple domains
- **Internationalization**: Support for English and Vietnamese languages
- **Form Validation**: Client-side validation with React Hook Form and Zod
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives
- **Internationalization**: next-intl
- **HTTP Client**: Fetch API with custom wrapper

## 📋 Prerequisites

- Node.js 20.0.0 or higher
- npm 10.0.0 or higher

## 🚦 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd auth-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Update the environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001
NEXT_PUBLIC_API_TIMEOUT=30000

# Application Configuration
NEXT_PUBLIC_APP_NAME="Asia Shop Authentication"
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Cookie Configuration
NEXT_PUBLIC_COOKIE_DOMAIN=localhost
NEXT_PUBLIC_COOKIE_SECURE=false
```

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3001`.

## 📚 API Endpoints

This application connects to the UserManagerServices backend API:

- `POST /login` - User login
- `POST /register` - User registration
- `POST /logout` - User logout
- `POST /refresh` - Refresh access token
- `POST /forgot-password` - Initiate password reset
- `POST /reset-password` - Reset password with token
- `GET /me` - Get current user profile

## 🏗️ Architecture

```
src/
├── app/
│   ├── [locale]/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   └── layout.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   └── common/
│       ├── button.tsx
│       ├── input.tsx
│       └── label.tsx
├── lib/
│   ├── api/
│   │   └── auth-client.ts
│   ├── i18n/
│   │   ├── config.ts
│   │   └── request.ts
│   ├── state/
│   │   └── auth-store.ts
│   ├── types.ts
│   └── utils.ts
└── middleware.ts
```

## 🔐 Authentication Flow

1. **Login**: User enters credentials, which are sent to the backend API
2. **Token Storage**: Access and refresh tokens are stored in cookies for cross-domain sharing
3. **State Management**: Authentication state is managed with Zustand and persisted to localStorage
4. **Cross-Tab Sync**: Authentication state is synchronized across browser tabs
5. **Token Refresh**: Access tokens are automatically refreshed when expired

## 🌐 Internationalization

The application supports multiple languages:

- **English** (`en`)
- **Vietnamese** (`vi`)

Translation files are located in the `messages/` directory.

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the authentication API | `http://localhost:5001` |
| `NEXT_PUBLIC_API_TIMEOUT` | Request timeout in milliseconds | `30000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Asia Shop Authentication` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3001` |
| `NEXT_PUBLIC_COOKIE_DOMAIN` | Domain for cookies | `localhost` |
| `NEXT_PUBLIC_COOKIE_SECURE` | Whether cookies should be secure | `false` |

### Cookie Configuration

Authentication tokens are stored in cookies with the following configuration:

- **Domain**: Set by `NEXT_PUBLIC_COOKIE_DOMAIN`
- **Path**: `/`
- **SameSite**: `Lax`
- **Secure**: Determined by `NEXT_PUBLIC_COOKIE_SECURE`
- **Max Age**: 
  - Access token: 24 hours
  - Refresh token: 7 days

## 🤝 Integration with Other Applications

This authentication service is designed to work with other applications in the Asia Shop ecosystem:

1. **Token Sharing**: Tokens are stored in cookies with a shared domain
2. **Cross-Domain Communication**: Uses postMessage API for communication between domains
3. **State Synchronization**: Authentication state is synchronized across applications

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
